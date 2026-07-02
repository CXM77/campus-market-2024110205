<template>
  <div class="loading-state">
    <div class="spinner"></div>
    <p>{{ text || '正在加载数据...' }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text?: string }>()
</script>

<style scoped>
.loading-state { padding: 48px 32px; text-align: center; color: var(--text-secondary); background: #fff; border-radius: var(--radius); }
.spinner { width: 32px; height: 32px; margin: 0 auto 14px; border: 3px solid #e2e8f0; border-top-color: var(--primary); border-radius: 50%; animation: spin 0.7s linear infinite; }
.loading-state p { margin: 0; font-size: 14px; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
