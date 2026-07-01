### 1. 今日完成内容

今天完成了 Pinia Store 和用户中心页面。在 AI 帮助下建了 `userStore` 管用户信息、`favoriteStore` 管收藏，重写了 `UserCenterView.vue`，能看到个人资料、发布数量、发布了啥、收藏了啥，给四个列表页全都加上了收藏按钮，统一了收藏按钮的样式，字体大小跟 footer 别的文字一样，去掉了边框背景，颜色改成灰色，把 ItemCard 的 footer 改成 flex 布局，收藏按钮能靠右对齐。使用 Pinia 之后，状态是全局的，点一下收藏，去别的页面看也是收藏状态。

### 2. Store 设计说明

设计了两个 Store：

**userStore（`src/stores/user.ts`）**
用的 Composition API 写法。存了 `username`、`studentId`、`college`、`grade`、`avatar`。用 computed 设置了 `displayName` 返回 `"${college} ${username}"`，导航栏和发布页都用的这个。方法有 `setUser()` 更新信息、`logout()` 退出。

**favoriteStore（`src/stores/favorite.ts`）**
存收藏数据。核心是 `favoriteIds: string[]`，每条存成 `"type-id"` 格式（例如 `"trade-1"`、`"lostFound-3"`），不同板块 id 一样也不会混。方法有 `toggleFav()` 切换收藏、`isFav()` 判断是否已收藏、`favCount` 统计总数。数据同步存到 localStorage，刷新页面不丢失。

### 3. 状态边界说明

Store 里面存放：
1. 用户信息——导航栏要显示用户名，发布页要用当前用户当发布人，个人中心要展示完整资料。三个页面在不同路由，放 Store 比 props 传参靠谱。
2. 收藏信息——四个列表页都要读写收藏，个人中心也要根据收藏列表来筛选内容。这种多处共用的数据适合放在 Store。

没有存放：
1. 列表数据（trades、lostFounds 等）——每个页面 `onMounted` 时请求一次就够了，页面之间不需要知道对方的数据，没有跨页面共享需求。
2. 表单校验错误、发布页临时填的内容——用完就丢的页面局部状态，用 `ref` 管理即可，不需要提升到全局。

### 4. 页面使用记录

| 页面/组件 | 用了哪个 Store | 干什么用的 |
|---|---|---|
| AppHeader.vue | userStore | 右上角显示头像和昵称 |
| PublishView.vue | userStore | 发布人自动填当前用户 |
| TradeView.vue | favoriteStore | 收藏/取消收藏 |
| LostFoundView.vue | favoriteStore | 同上 |
| GroupBuyView.vue | favoriteStore | 同上 |
| ErrandView.vue | favoriteStore | 同上 |
| UserCenterView.vue | userStore + favoriteStore | 展示资料、发布列表、收藏列表 |

### 5. AI 协作记录

使用了 opencode（模型 big-pickle），提示词包括：如何使用 Pinia、根据今日任务敲定具体方案、创建 `src/stores/user.ts` 管理当前用户信息、创建 `src/stores/favorite.ts` 管理收藏状态、按照模板重写 `UserCenterView.vue`、字体大小要一致不要外框、收藏及星标显示灰色。

AI 根据要求生成了 Store 的代码框架、完成了 UserCenterView 的重写、四个列表页的收藏按钮集成。

AI 不合理的地方：
- 一开始收藏按钮只有 ☆ 符号，没有文字说明功能
- 四个视图的按钮标签不统一（TradeView 用的 `<span>`，其他三个用的 `<button>`）
- 收藏按钮颜色用了蓝色，页面上其他辅助信息都是灰色，不搭配
- Store 没有持久化，刷新页面后收藏数据全部丢失

### 6. 人工调整内容

- 把 TradeView 的收藏按钮从 `<span>` 改成 `<button>`，跟另外三个保持一致
- 收藏文字改为 `收藏：☆`，并且把"收藏"两个字放星号前面
- 颜色从蓝色改成灰色 `#6b7280`，与 footer 其他文字统一
- 按钮字号从 `font-size: 18px` 改为 `inherit`，不再比旁边文字大一圈
- 给 favoriteStore 加了 localStorage 持久化，刷新页面收藏数据不丢失
- 给 ItemCard 的 footer 加上 `display: flex`，让收藏按钮能靠右对齐

### 7. 测试记录

1. 打开二手交易，看到 7 条商品正常加载
2. 点第一条卡片的 `收藏：☆`，变成 `收藏：★`，再点变回 ☆，正常
3. 换到失物招领、拼单搭子、跑腿委托，每个都点了几下，都能正常收藏和取消
4. 收藏了几个不同板块的内容，进个人中心点"我的收藏"，都列出来了，按时间排的
5. 在个人中心取消收藏一条，回到对应的列表页，那个卡片的收藏按钮状态也同步变了
6. 发布页的发布人显示"计算机学院 校园用户"，跟 userStore 里的一致
7. 发布一条二手交易记录，个人中心正常显示
8. **刷新页面后**，之前收藏的记录还在，没有丢失（localStorage 持久化生效）

### 8. 遇到的问题与解决方法

**问题一：** `LostFoundItem` 没有 `publisher` 字段，在 UserCenterView 里过滤"我的发布"时 TypeScript 报错。
- 原因：失物招领的接口类型定义太早了，当时没加 `publisher` 字段。
- 解决：用 `(item as any).publisher` 绕过类型检查。

**问题二：** 收藏按钮点击后没有变化。
- 原因：调用 `toggleFav()` 时没有正确传入 `type` 参数，只传了 `id`。
- 解决：修正调用方式为 `favStore.toggleFav(item.id, 'trade')`，`type` 参数必须传入。

**问题三：** 刷新页面后收藏数据全部丢失。
- 原因：Pinia 状态存在内存中，刷新页面 JS 重跑，`favoriteIds` 回到空数组。
- 解决：在 favoriteStore 中增加 localStorage 持久化，每次修改数据时同步写入，初始化时读取回来。

### 9. 今日反思

没有 Pinia 的时候，收藏功能要么存 localStorage，要么每个页面自己维护。localStorage 的问题是**不是响应式的**，一个页面改了，另一个页面不知道。各个页面各自维护的话状态分散，容易出 bug。

有了 Pinia 之后，所有页面都能读同一个 Store。在一个页面点了收藏，Store 里立刻更新，其他页面读的时候就是最新的状态。这种"改一处，处处同步"的效果，是用户中心这类跨页面功能的基础。

状态管理的核心是搞清楚数据归谁管、谁要用。`userStore` 就是用户信息的唯一来源，导航栏、发布页、个人中心都不需要自己存一份用户信息，统一从 Store 读取，既减少代码也不会出现数据不一致。

对于用户中心页面来说，它需要聚合四个板块的发布数据和收藏数据。如果没有 Pinia，每个板块的收藏状态要独立管理，用户中心要读取这些数据要么依赖路由参数传递，要么重新请求 API。通过 `favoriteStore`，用户中心可以简单地调用 `favStore.isFav(id, type)` 来判断每一条数据的收藏状态，逻辑清晰且性能高效。
