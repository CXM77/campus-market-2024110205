<script setup lang="ts">
import { useMarketStore } from '@/stores/market'
import { ref, computed } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import GoodsCard from '@/components/GoodsCard.vue'
const store = useMarketStore()
const search = ref('')
const filter = ref('全部')

const list = computed(() => {
  let items = store.tradeList
  if (search.value) items = items.filter(i => i.title.includes(search.value))
  if (filter.value !== '全部') items = items.filter(i => i.category === filter.value)
  return items
})

const categories = ['全部', '电子产品', '书籍教材', '生活用品', '服饰鞋包']
</script>

<template>
  <div>
    <h1 class="page-title">二手交易</h1>
    <SearchBar v-model:search="search" v-model:filter="filter" :categories="categories" placeholder="搜索商品名称..." action-text="发布商品" />
    <div v-if="list.length === 0" class="empty">暂无匹配商品</div>
    <div v-else class="grid-3">
      <GoodsCard v-for="item in list" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<style scoped>
.empty { text-align: center; padding: 60px 0; color: var(--text-secondary); font-size: 15px; }
</style>
