<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'

const items = ref<GroupBuyItem[]>([])

onMounted(async () => {
  const res = await getGroupBuys()
  items.value = res.data
})
</script>

<template>
  <section class="page">
    <div class="page-header">
      <h1>拼单搭子</h1>
      <p>寻找志同道合的伙伴，一起拼单省钱、共享快乐。</p>
    </div>

    <EmptyState v-if="items.length === 0" text="暂无拼单信息" />
    <div v-else class="list">
      <ItemCard
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.type"
        :location="item.location"
        :time="item.deadline"
      >
        <template #footer>
          <span>已报 {{ item.currentCount }} / {{ item.targetCount }} 人</span>
          <span :class="item.status === 'open' ? 'status-open' : 'status-done'">
            {{ item.status === 'open' ? '进行中' : item.status === 'closed' ? '已截止' : '已完成' }}
          </span>
          <span class="contact">{{ item.contact }}</span>
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
.status-open { color: #059669; }
.status-done { color: #6b7280; }
.contact { margin-left: auto; color: #2563eb; font-size: 13px; }
</style>
