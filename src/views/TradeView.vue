<script setup lang="ts">
import { useMarketStore } from '@/stores/market'
import { ref, computed } from 'vue'
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

    <div class="card mb-16">
      <div class="flex flex-center gap-16">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input v-model="search" placeholder="搜索商品名称..." class="search-input" />
        </div>
        <div class="flex flex-center gap-8">
          <button v-for="c in categories" :key="c" class="filter-btn" :class="{ active: filter === c }" @click="filter = c">{{ c }}</button>
        </div>
        <router-link to="/publish" class="btn btn-primary" style="margin-left:auto">发布商品</router-link>
      </div>
    </div>

    <div v-if="list.length === 0" class="empty">暂无匹配商品</div>
    <div v-else class="grid-3">
      <div v-for="item in list" :key="item.id" class="card card-hover">
        <h3 class="item-title">{{ item.title }}</h3>
        <p class="item-desc">{{ item.description }}</p>
        <div class="flex flex-center gap-12 mt-16">
          <span class="price">¥{{ item.price ?? 0 }}</span>
          <span class="tag tag-blue">{{ item.category }}</span>
          <span class="text-secondary" style="margin-left:auto">{{ item.location }}</span>
        </div>
        <div class="flex flex-center gap-8 mt-8">
          <span class="text-secondary">卖家: {{ item.contact || '匿名' }}</span>
          <span class="tag tag-gray">{{ item.status ?? '在售' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-box { display: flex; align-items: center; gap: 8px; flex: 1; max-width: 360px; }
.search-icon { font-size: 16px; }
.search-input { flex: 1; padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; outline: none; }
.search-input:focus { border-color: var(--primary); }
.filter-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background: #fff; cursor: pointer; font-size: 13px; color: var(--text-secondary); }
.filter-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.item-title { font-size: 15px; font-weight: 600; }
.item-desc { font-size: 13px; color: var(--text-secondary); margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.empty { text-align: center; padding: 60px 0; color: var(--text-secondary); font-size: 15px; }
</style>
