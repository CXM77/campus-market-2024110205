<script setup lang="ts">
import { useMarketStore } from '@/stores/market'
import { ref, computed } from 'vue'
const store = useMarketStore()
const search = ref('')

const list = computed(() => {
  if (!search.value) return store.errandList
  return store.errandList.filter(i => i.title.includes(search.value))
})
</script>

<template>
  <div>
    <h1 class="page-title">跑腿委托</h1>

    <div class="card mb-16">
      <div class="flex flex-center gap-16">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input v-model="search" placeholder="搜索跑腿任务..." class="search-input" />
        </div>
        <router-link to="/publish" class="btn btn-primary" style="margin-left:auto">发布任务</router-link>
      </div>
    </div>

    <div v-if="list.length === 0" class="empty">暂无跑腿任务</div>
    <div v-else class="grid-3">
      <div v-for="item in list" :key="item.id" class="card card-hover">
        <div class="flex flex-center gap-8">
          <span class="tag" :class="item.status === '进行中' ? 'tag-green' : 'tag-gray'">{{ item.status ?? '进行中' }}</span>
        </div>
        <h3 class="item-title mt-16">{{ item.title }}</h3>
        <p class="item-desc">{{ item.description }}</p>
        <div class="flex flex-center gap-12 mt-16">
          <span class="price">¥{{ item.reward ?? 0 }}</span>
          <span class="text-secondary">📍 {{ item.location }}</span>
        </div>
        <div class="flex flex-center gap-8 mt-8">
          <span class="text-secondary">发布人: {{ item.contact || '匿名' }}</span>
          <button class="btn btn-outline" style="margin-left:auto;padding:4px 16px">接单</button>
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
.item-title { font-size: 15px; font-weight: 600; }
.item-desc { font-size: 13px; color: var(--text-secondary); margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.empty { text-align: center; padding: 60px 0; color: var(--text-secondary); font-size: 15px; }
</style>
