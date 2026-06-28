<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMarketStore } from '@/stores/market'

const route = useRoute()
const router = useRouter()
const store = useMarketStore()

const goods = computed(() => store.getGoodsById(Number(route.params.id)))
</script>

<template>
  <div>
    <h1>详情页</h1>
    <div v-if="goods">
      <h2>{{ goods.title }}</h2>
      <ul class="info">
        <li>分类：{{ goods.category }}</li>
        <li>价格：¥{{ goods.price }}</li>
        <li>描述：{{ goods.description }}</li>
      </ul>
      <div class="actions">
        <button :class="{ active: store.isFav(goods.id) }" @click="store.toggleFav(goods.id)">
          {{ store.isFav(goods.id) ? '❤️ 已收藏' : '🤍 收藏' }}
        </button>
        <button :disabled="store.isInCart(goods.id)" @click="store.addToCart(goods.id)">
          {{ store.isInCart(goods.id) ? '已在购物车' : '加入购物车' }}
        </button>
      </div>
      <br />
      <button class="back" @click="router.push('/list')">← 返回列表</button>
    </div>
    <div v-else>
      <p>商品不存在</p>
      <button class="back" @click="router.push('/list')">← 返回列表</button>
    </div>
  </div>
</template>

<style scoped>
.info { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; margin: 12px 0; }
.actions { display: flex; gap: 8px; }
button { padding: 6px 14px; border-radius: 4px; border: 1px solid #ccc; cursor: pointer; }
button.active { background: #f43f5e; color: #fff; border-color: #f43f5e; }
button:disabled { opacity: .5; cursor: default; }
.back { background: #f5f5f5; }
</style>
