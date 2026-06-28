<script setup lang="ts">
import { useMarketStore } from '@/stores/market'
import { ref, computed } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import GoodsCard from '@/components/GoodsCard.vue'
const store = useMarketStore()
const search = ref('')

const list = computed(() => {
  if (!search.value) return store.groupList
  return store.groupList.filter(i => i.title.includes(search.value))
})
</script>

<template>
  <div>
    <h1 class="page-title">拼单搭子</h1>
    <SearchBar v-model:search="search" placeholder="搜索拼单..." action-text="发起拼单" />
    <div v-if="list.length === 0" class="empty">暂无拼单</div>
    <div v-else class="grid-3">
      <GoodsCard v-for="item in list" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<style scoped>
.empty { text-align: center; padding: 60px 0; color: var(--text-secondary); font-size: 15px; }
</style>
