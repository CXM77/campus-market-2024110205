<script setup lang="ts">
import { useMarketStore } from '@/stores/market'

const store = useMarketStore()
</script>

<template>
  <div>
    <h1>列表页</h1>
    <div class="list">
      <div v-for="item in store.goodsList" :key="item.id" class="card">
        <router-link :to="`/detail/${item.id}`" class="card-title">{{ item.title }}</router-link>
        <p class="card-meta">¥{{ item.price }} · {{ item.category }}</p>
        <div class="card-actions">
          <button :class="{ active: store.isFav(item.id) }" @click="store.toggleFav(item.id)">
            {{ store.isFav(item.id) ? '❤️' : '🤍' }}
          </button>
          <button :disabled="store.isInCart(item.id)" @click="store.addToCart(item.id)">
            {{ store.isInCart(item.id) ? '已在购物车' : '加入购物车' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; max-width: 500px; }
.card { border: 1px solid #eee; padding: 14px; border-radius: 8px; }
.card-title { font-size: 16px; font-weight: 600; text-decoration: none; color: inherit; }
.card-title:hover { color: #f43f5e; }
.card-meta { color: #666; margin: 4px 0 8px; font-size: 14px; }
.card-actions { display: flex; gap: 8px; }
button { padding: 4px 12px; border-radius: 4px; border: 1px solid #ccc; cursor: pointer; }
button.active { background: #f43f5e; color: #fff; border-color: #f43f5e; }
button:disabled { opacity: .5; cursor: default; }
</style>
