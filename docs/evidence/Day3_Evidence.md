# Day3 Evidence - Mock 数据建模与列表渲染

## 1. 今日完成内容
结合校园轻集市四大核心业务（二手交易、失物招领、拼单搭子、跑腿委托），结合语雀上的模板完成Mock数据结构建模与添加，结合模板设计标准化数据表字段，搭建JSON Server本地模拟服务，借助AI工具辅助完成编写db.json模拟数据源，完成Axios网络请求封装，统一接口请求配置，编写各业务模块的API请求方法。在前端页面调用模拟接口，成功获取Mock数据并完成了各业务板块的基础列表渲染，实现了数据与页面的动态绑定，对比AI生成的数据结构，结合校园真实业务场景完成了数据字段的检查、优化、删减和适配调整，解决开发过程中接口请求、数据渲染的问题。

## 2. Mock 数据结构说明

| 数据集合 | 对应业务 | 主要字段 | 页面用途 |
|---|---|---|---|
| trades | 二手交易 | title、price、category、location、status | 展示二手商品列表 |
| lostFounds | 失物招领 | title、type、itemName、location、eventTime、status | 展示失物和招领信息 |
| groupBuys | 拼单搭子 | title、type、targetCount、currentCount、deadline | 展示拼单和搭子信息 |
| errands | 跑腿委托 | title、taskType、reward、from、to、deadline | 展示跑腿任务列表 |

## 3. 我的设计

请说明自己为什么这样设计数据字段。
例如：
- 二手交易需要price和condition：price是交易的核心信息，用户必须知道价格；condition（成色）可以帮助买家判断物品新旧程度，是二手交易区别于普通商品的关键字段。失物招领需要type字段：区分"丢失"和"拾到"两种状态，分别面向不同的需求者，例如失主和拾获者，页面展示时可以用不同标签颜色区分。拼单搭子需要targetCount和currentCount：拼单的核心是凑够人数，展示当前人数和目标人数可以让用户直观了解进度，决定是否参与拼单。跑腿委托需要from、to和reward：from是取件地、to是送达地，明确了任务路线；reward（酬劳）是跑腿任务的激励与报酬，参与方可以据此决定是否接单。

## 4. AI 设计

请说明 AI 工具生成了哪些内容。

- AI结合语雀上的模板生成了db.json的四组Mock数据结构和示例数据、帮助生成了src/api/目录下的HTTP实例、四个业务模块的接口定义和请求函数、还结合模板生成了ItemCard.vue和EmptyState.vue公共组件
- AI最初将API请求封装在src/api/index.ts和src/api/types.ts中，没有按业务模块拆分

## 5. 最终调整

请说明你自己做了哪些修改。
例如：
- 重新调整，在AI的辅助下，将src/api/index.ts和src/api/types.ts拆分为trade.ts、lostFound.ts、groupBuy.ts、errand.ts四个独立模块，按业务划分职责，根据模板将字段名称对齐：targetPeople→targetCount，currentPeople→currentCount，pickupLocation/deliveryLocation→from/to，自己检查所有mock数据是否合理，并重新进行调整修改

## 6. 遇到的问题与解决方法

请记录至少一个真实问题：

- 问题：前端页面获取不到json-server的数据，页面列表一直渲染为空。
  原因：项目之前缺少了API层（src/api/ 目录为空），Pinia store中使用的是硬编码的mock数据，没有向json-server发送过HTTP请求。页面组件依赖 store但store不包含网络请求逻辑，导致数据流断裂，无法显示数据。

   解决：询问AI,并结合模板的代码修改调整，创建了完整的API分层架构：http.ts（axios实例，baseURL指向 localhost:3001）→四个业务模块文件（各自的TypeScript接口类型+对应的getXxx请求函数）→页面在onMounted生命周期中调用getTrades()/getLostFounds()等函数获取数据并赋给ref响应式变量。视图组件不再依赖store，改为直接消费API返回的数据，同时使用EmptyState组件处理数据为空的情况。

## 7. 今日反思

请用一小段话说明：

今天通过Mock数据建模、接口请求和页面列表渲染的实操，我切实掌握了前后端分离的基础开发流程。借助Mock模拟数据，我不用等待后端接口开发完成，就能独立完成页面搭建和数据渲染，大大提高了前端开发效率。在梳理数据结构的过程中，我也理清了校园集市四大业务的核心逻辑，提前规避了字段不匹配导致页面空白的问题。同时，封装Axios请求让代码更加规整、方便复用，列表动态渲染的实现也为后续筛选、详情展示、发布新增等功能做好了铺垫。这次实操让我明白，提前做好数据建模和接口封装，能有效减少后期联调的bug，让项目开发更加顺畅。