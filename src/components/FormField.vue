<template>
  <div class="form-field">
    <label class="form-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <slot />
    <p v-if="error" class="error-msg">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  required?: boolean
  error?: string
}>()
</script>

<style scoped>
.form-field { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 14px; font-weight: 600; color: #1a1a2e; }
.required { color: #dc2626; }
.error-msg { margin: 0; font-size: 12px; color: #dc2626; }
</style>
