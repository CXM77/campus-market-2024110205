<script setup lang="ts">
import { useMarketStore } from '@/stores/market'

const store = useMarketStore()
const s = store.boardStats
</script>

<template>
  <div>
    <h1>看板页</h1>
    <div class="grid">
      <div class="card"><span>商品总数</span><strong>{{ s.total }}</strong></div>
      <div class="card"><span>收藏数</span><strong>{{ s.fav }}</strong></div>
      <div class="card"><span>购物车</span><strong>{{ s.cart }}</strong></div>
      <div class="card"><span>订单数</span><strong>{{ s.order }}</strong></div>
      <div class="card"><span>未读消息</span><strong class="warn">{{ s.unread }}</strong></div>
    </div>
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; margin-top: 16px; max-width: 500px; }
.card { background: #fafafa; border: 1px solid #eee; border-radius: 8px; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.card span { font-size: 14px; color: #666; }
.card strong { font-size: 28px; }
.warn { color: #f43f5e; }
</style>
