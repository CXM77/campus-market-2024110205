<template>
  <div class="empty-state">
    <span class="empty-icon">📭</span>
    <p>{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<style scoped>
.empty-state {
  padding: 48px 32px;
  text-align: center;
  color: var(--text-secondary);
  background: #fff;
  border-radius: var(--radius);
  border: 1px dashed var(--border);
}
.empty-icon { font-size: 40px; display: block; margin-bottom: 12px; }
.empty-state p { margin: 0; font-size: 15px; }
</style>
