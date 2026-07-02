<template>
  <div class="search-bar">
    <input :value="modelValue" type="text" :placeholder="placeholder" @input="handleInput" />
    <button v-if="modelValue" type="button" @click="$emit('update:modelValue', '')">清空</button>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ modelValue: string; placeholder?: string }>(), { placeholder: '请输入关键词搜索' })
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.search-bar { display: flex; gap: 12px; padding: 16px 20px; border-radius: var(--radius); background: #fff; box-shadow: var(--shadow); border: 1px solid var(--border); }
.search-bar input { flex: 1; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 14px; outline: none; transition: all .25s ease; }
.search-bar input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(79,140,247,0.15); }
.search-bar button { border: none; border-radius: var(--radius-sm); padding: 0 16px; cursor: pointer; background: #f1f5f9; color: var(--text-secondary); font-size: 13px; transition: all .2s; }
.search-bar button:hover { background: #e2e8f0; color: var(--text); }
</style>
