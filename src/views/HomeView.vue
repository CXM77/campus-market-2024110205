<script setup lang="ts">
// 收藏本地存储标识
const COLLECT_KEY = "campus_market_collect"
// 模拟商品数据
const goodsList = [
  { id: 1, title: "二手高数课本", price: 12 },
  { id: 2, title: "校园电动车", price: 580 },
  { id: 3, title: "无线耳机", price: 75 }
]

// 获取本地收藏ID数组
const getCollectIds = () => {
  const data = localStorage.getItem(COLLECT_KEY)
  return data ? JSON.parse(data) : []
}

// 判断商品是否已收藏
const isCollected = (goodsId: number) => {
  return getCollectIds().includes(goodsId)
}

// 切换收藏/取消收藏
const toggleCollect = (goodsId: number) => {
  let list = getCollectIds()
  if (list.includes(goodsId)) {
    list = list.filter((id: number) => id !== goodsId)
    alert("已取消收藏")
  } else {
    list.push(goodsId)
    alert("收藏成功，刷新页面状态不会丢失")
  }
  localStorage.setItem(COLLECT_KEY, JSON.stringify(list))
}
</script>

<template>
  <section>
    <h2>项目启动成功 - 校园集市商品列表（新增收藏功能）</h2>
    <p>请按照每日任务要求，完成代码、证据卡和自动化检测。</p>

    <!-- 商品列表+收藏按钮 -->
    <div class="goods-wrap">
      <div class="goods-item" v-for="item in goodsList" :key="item.id">
        <h3>{{ item.title }}</h3>
        <p>售价：¥{{ item.price }}</p>
        <button
          class="collect-btn"
          :class="{ active: isCollected(item.id) }"
          @click="toggleCollect(item.id)"
        >
          {{ isCollected(item.id) ? "❤️ 已收藏" : "🤍 收藏商品" }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.goods-wrap {
  margin-top: 20px;
  display: flex;
  gap: 16px;
}
.goods-item {
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 8px;
}
.collect-btn {
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
}
.collect-btn.active {
  background: #f43f5e;
  color: white;
  border-color: #f43f5e;
}
</style>
