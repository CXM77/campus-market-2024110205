1. 今日完成内容
今天完成了以下工作：
注册功能：填写用户名、密码、姓名、学院、年级，提交后写入db.json的users资源，同时校验用户名唯一性、密码长度≥6位
登录功能：输入用户名/密码，从users中查询匹配，成功后将用户信息存入Pinia userStore，失败提示"账号或密码错误"
状态持久化：登录成功后将当前用户写入localStorage，页面刷新后通过restoreLogin() 自动恢复
退出登录：清空Pinia中的currentUser和localStorage，跳转登录页
导航联动：未登录显示"登录/注册"，登录后显示用户名和"退出"按钮
页面保护：发布页和个人中心在未登录时提示"请先登录"
发布关联：发布信息时publisher字段自动取自当前登录用户的displayName
交互优化：增补了多个体验优化组件和功能

2. 注册登录设计说明

本项目的注册/登录基本流程：
注册流程：
用户在注册页填写用户名、密码、姓名、学院、年级
前端校验：用户名不能为空、密码≥6 位、姓名/学院/年级不能为空
调用getUsers() 查询所有已有用户，检查用户名是否重复
若不重复，调用createUser() 将新用户写入JSON Server的/users资源
注册成功后window.alert提示，跳转到登录页

登录流程：
用户输入用户名和密码
调用getUsers()获取所有用户
用Array.find()匹配username和password一致的记录
匹配成功：将整条用户记录存入userStore.currentUser，同时JSON.stringify写入localStorage
匹配失败：显示"账号或密码错误"
userStore的isLoggedIn计算属性通过currentUser判断

状态恢复：
App.vue的onMounted中调用restoreLogin()，从localStorage读取并反序列化恢复currentUser
退出登录：
userStore.logout()将currentUser置为null，并删除localStorage对应键

3. 用户数据结构说明

User接口定义在src/api/user.ts：
export interface User {
  id?: number
  username: string
  password: string
  name: string
  college: string
  grade: string
  avatar: string
  bio: string
}

各字段含义与示例：
字段	含义	示例
id	自增主键（由 JSON Server 自动生成）	1
username	登录用户名，唯一	student
password	登录密码（当前为明文存储）	123456
name	用户显示名称	校园用户
college	所属学院	计算机学院
grade	年级	2023级
avatar	头像 URL（本项目暂空）	""
bio	个人简介	热爱校园生活
displayName 计算属性返回 name，userDescription 返回 college + " · " + grade。

4. 状态持久化说明
Pinia的状态存储在JavaScript内存中，页面刷新后内存释放，状态会全部丢失、localStorage是浏览器提供的持久化存储，刷新后数据仍然存在
用户在登录后如果刷新页面，需要保持登录状态而不是被强制登出、登录成功时localStorage.setItem('campus-market-current-user', JSON.stringify(res.data))，App.vue的onMounted中调用userStore.restoreLogin()读取并恢复

5. 页面联动记录
页面/组件	未登录表现	登录后表现
AppHeader.vue	显示"登录 / 注册"链接	显示用户名 + "退出"按钮
PublishView.vue	handleSubmit 中 window.alert('请先登录') 并跳转 /login	正常发布，publisher 取 userStore.displayName
UserCenterView.vue	显示"请先登录"提示+「去登录」按钮	显示头像、昵称、学院年级、发布列表、收藏列表
4个列表页（Trade/LostFound/GroupBuy/ErrandView）	仍可浏览，但不会显示"编辑/删除"按钮	自己的帖子显示"编辑/删除"按钮（publisher===displayName判断）
收藏功能	正常工作（favoriteStore使用Pinia独立管理）	正常工作
路由守卫	没有实现路由级别权限控制（属于功能边界）	—

6. 交互优化记录
LoadingState.vue — 数据加载时显示旋转动画+提示文字，替代空白页面
ErrorState.vue — 请求失败时显示错误信息+重新加载」按钮，替代静默失败
SearchBar.vue — 统一的搜索组件，支持关键词输入和清空，配合v-model实现实时过滤4个列表页搜索功能：
二手交易：按标题/分类/地点/描述搜索
失物招领：按标题/物品名/地点/描述/联系方式搜索
拼单搭子：按标题/类型/地点/描述/联系方式搜索
跑腿委托：按标题/任务类型/出发地/目的地/描述搜索
发布提交状态：提交按钮显示"提交中..."并disabled，防止重复提交
收藏状态反馈：★/☆ 动态切换，配合favoriteStore.isFav()
列表页分状态展示：LoadingState→ErrorState→EmptyState→数据列表
编辑/删除操作：删除前confirm()确认，操作后刷新列表
编辑模式：PublishView通过?edit=+?id=查询参数进入编辑模式，预填已有数据

7. AI 协作记录
使用了opencode，提示词有：帮我实现注册登录功能，使用JSON Server作为后端、在列表页添加编辑和删除按钮，仅对当前用户自己的内容显示、增加 LoadingState和ErrorState组件、实现搜索功能，按标题/描述/地点过滤、完后页面优化、让整个页面变得好看一点，颜色搭配协调一点，蓝色渐变风格

AI生成的内容：userStore Pinia store（src/stores/user.ts）、useLogin/RegisterView的模板、ItemCard.vue的#footer插槽设计、搜索过滤逻辑（computed+filter）、CSS变量体系和全局样式重构

AI生成的不合理之处：
AI修改的拼单页面显示人数不对
CSS颜色值有时不一致，手动统一

自己保留、修改或删除的内容：
保留： Pinia store结构、登录/注册表单验证、localStorage持久化、搜索过滤逻辑
修改： 将API调用统一到src/api/ 目录下的模块中，颜色值改用 CSS 变量

8. 功能边界说明
本项目注册/登录功能基于JSON Server、Pinia 和 localStorage 实现，仅用于前端实训和状态管理模拟，不是生产环境安全认证系统。
本项目暂未实现：
密码加密（当前明文存储于db.json）
JWT/Token 认证
路由守卫 / 权限路由
短信验证码
找回密码 / 修改密码
后端安全校验（任何前端发起的请求JSON Server都会接受）
Token 过期 / 刷新机制
HTTPS 传输加密

9. 完整功能走查记录
注册了一个新用户--顾惜：
打开浏览器访问 http://localhost:5173
点击导航栏「注册」
填写：用户名、密码、姓名、学院、年级
点击「注册」
弹出「注册成功，请登录」，跳转到登录页
打开db.json，在users数组中看到新增了顾惜记录、且个人中心页面正常展示
进行发布一条拼单信息（烤肉）、收藏了信息，刷新后还可以在个人中心中看到

10. 遇到的问题与解决方法
问题：注册成功但db.json中没有新增用户数据

现象： 注册时弹出「注册成功，请登录」，但打开db.json发现users数组没有新增记录
原因： 起初使用了独立的auth.ts文件调用createUser()，但URL路径写成了/users而JSON Server实际运行在http://localhost:3001，由于axios的 baseURL未正确配置，请求发送到了Vite开发服务器而非JSON Server
解决： 在src/api/http.ts中检查axios实例的baseURL，确保设为http://localhost:3001。同时将API调用统一整合到src/api/user.ts 中，避免路径不一致

11. 今日反思
通过补充注册/登录功能，我对"用户状态"有了更清晰的认识：用户状态不是登录时的一次性操作，而是贯穿整个应用生命周期的——导航栏要感知、发布时要关联、个人中心要展示、刷新后要恢复。状态持久化让我理解了内存状态和存储状态的区别：Pinia负责运行时的响应式状态，localStorage负责跨会话的数据留存，两者配合才能让用户体验流畅。而前端Mock认证边界也让我意识到，在前端实现"看起来像认证"的功能并不难，但要真正保证安全需要后端参与——密码加密、JWT、HTTPS、路由守卫缺一不可。