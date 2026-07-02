<template>
  <article class="item-card">
    <div class="item-card__header">
      <h3>{{ title }}</h3>
      <span v-if="tag" class="tag">{{ tag }}</span>
    </div>

    <p class="description">{{ description }}</p>

    <div class="meta">
      <span v-if="location">地点：{{ location }}</span>
      <span v-if="time">时间：{{ time }}</span>
    </div>

    <div v-if="$slots.footer" class="footer">
      <slot name="footer" />
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  tag?: string
  location?: string
  time?: string
}>()
</script>

<style scoped>
.item-card {
  padding: 20px;
  border-radius: var(--radius);
  background: #fff;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  transition: all .25s ease;
}
.item-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

.item-card__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.item-card h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.4;
}

.tag {
  flex-shrink: 0;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--primary-gradient);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.description {
  margin: 12px 0;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  color: var(--text-secondary);
  font-size: 12px;
}

.footer {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
