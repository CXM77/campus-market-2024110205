<template>
  <div class="error-state">
    <h3>加载失败</h3>
    <p>{{ message }}</p>
    <button v-if="showRetry" type="button" @click="$emit('retry')">重新加载</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ message: string; showRetry?: boolean }>()
defineEmits<{ retry: [] }>()
</script>

<style scoped>
.error-state { padding: 40px 32px; text-align: center; color: #991b1b; background: #fef2f2; border: 1px solid #fecaca; border-radius: var(--radius); }
.error-state h3 { margin: 0 0 8px; font-size: 16px; }
.error-state p { margin: 0 0 16px; font-size: 14px; }
.error-state button { border: none; border-radius: var(--radius-sm); padding: 9px 18px; cursor: pointer; background: var(--danger); color: #fff; font-weight: 600; transition: all .2s; }
.error-state button:hover { background: #dc2626; }
</style>
