<script setup lang="ts">
import { useMarketStore } from '@/stores/market'
import { ref, computed } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import GoodsCard from '@/components/GoodsCard.vue'
const store = useMarketStore()
const search = ref('')
const filter = ref('全部')

const list = computed(() => {
  let items = store.lostList
  if (search.value) items = items.filter(i => i.title.includes(search.value))
  if (filter.value !== '全部') items = items.filter(i => i.status === filter.value)
  return items
})

const categories = ['全部', '丢失', '拾到']
</script>

<template>
  <div>
    <h1 class="page-title">失物招领</h1>
    <SearchBar v-model:search="search" v-model:filter="filter" :categories="categories" placeholder="搜索失物名称..." action-text="发布信息" />
    <div v-if="list.length === 0" class="empty">暂无信息</div>
    <div v-else class="grid-3">
      <GoodsCard v-for="item in list" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<style scoped>
.empty { text-align: center; padding: 60px 0; color: var(--text-secondary); font-size: 15px; }
</style>
