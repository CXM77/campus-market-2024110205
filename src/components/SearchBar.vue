<script setup lang="ts">
defineProps<{
  placeholder?: string
  categories?: string[]
  actionText?: string
  actionTo?: string
  search: string
  filter?: string
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:filter': [value: string]
}>()
</script>

<template>
  <div class="card mb-16">
    <div class="flex flex-center gap-16">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input :value="search" @input="emit('update:search', ($event.target as HTMLInputElement).value)" :placeholder="placeholder ?? '搜索...'" class="search-input" />
      </div>
      <div v-if="categories" class="flex flex-center gap-8">
        <button v-for="c in categories" :key="c" class="filter-btn" :class="{ active: filter === c }" @click="emit('update:filter', c)">{{ c }}</button>
      </div>
      <router-link v-if="actionText" :to="actionTo ?? '/publish'" class="btn btn-primary" style="margin-left:auto">{{ actionText }}</router-link>
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
</style>
