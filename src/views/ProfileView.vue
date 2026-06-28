<script setup lang="ts">
import { useMarketStore } from '@/stores/market'

const store = useMarketStore()
</script>

<template>
  <div>
    <h1>个人中心</h1>
    <div class="stats">
      <div class="stat"><strong>{{ store.boardStats.total }}</strong><span>商品</span></div>
      <div class="stat"><strong>{{ store.boardStats.fav }}</strong><span>收藏</span></div>
      <div class="stat"><strong>{{ store.boardStats.order }}</strong><span>订单</span></div>
    </div>
    <h2>我的收藏</h2>
    <div v-if="store.favList.length" class="list">
      <div v-for="item in store.favList" :key="item.id" class="item">
        <router-link :to="`/detail/${item.id}`">{{ item.title }}</router-link>
        <span>¥{{ item.price }}</span>
      </div>
    </div>
    <p v-else>暂无收藏</p>
  </div>
</template>

<style scoped>
.stats { display: flex; gap: 20px; margin: 16px 0; }
.stat { display: flex; flex-direction: column; align-items: center; background: #fafafa; padding: 16px 24px; border-radius: 8px; }
.stat strong { font-size: 24px; }
.stat span { font-size: 13px; color: #666; }
.list { display: flex; flex-direction: column; gap: 8px; }
.item { display: flex; gap: 16px; align-items: center; padding: 8px 12px; border: 1px solid #eee; border-radius: 6px; }
.item a { text-decoration: none; color: inherit; flex: 1; }
.item a:hover { color: #f43f5e; }
</style>
