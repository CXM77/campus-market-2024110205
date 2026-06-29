<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { getErrands, type ErrandItem } from '@/api/errand'

const items = ref<ErrandItem[]>([])

onMounted(async () => {
  const res = await getErrands()
  items.value = res.data
})
</script>

<template>
  <section class="page">
    <div class="page-header">
      <h1>跑腿委托</h1>
      <p>发布或接取跑腿任务，互帮互助让校园生活更便利。</p>
    </div>

    <EmptyState v-if="items.length === 0" text="暂无跑腿任务" />
    <div v-else class="list">
      <ItemCard
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.taskType"
        :location="`${item.from} → ${item.to}`"
        :time="item.deadline"
      >
        <template #footer>
          <strong>￥{{ item.reward }}</strong>
          <span class="publisher">{{ item.publisher }}</span>
        </template>
      </ItemCard>
    </div>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }
.page-header { padding: 24px; border-radius: 16px; background: #fff; }
.page-header h1 { margin: 0 0 8px; }
.page-header p { margin: 0; color: #6b7280; }
.list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.publisher { margin-left: auto; color: #6b7280; font-size: 13px; }
</style>
