<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'

const items = ref<LostFoundItem[]>([])

function formatContact(contact: string): string {
  const prefixes = ['手机:', '手机：', '微信:', '微信：', 'QQ:', 'QQ：', '站内消息', '站外消息']
  if (prefixes.some(p => contact.startsWith(p))) return contact
  if (/^\d{7,15}$/.test(contact)) return '手机: ' + contact
  return contact
}

const typeLabel: Record<string, string> = { lost: '丢失', found: '拾到' }

onMounted(async () => {
  const res = await getLostFounds()
  items.value = res.data
})
</script>

<template>
  <section class="page">
    <div class="page-header">
      <h1>失物招领</h1>
      <p>帮助遗失物品找回主人，让每一件失物都能物归原主。</p>
    </div>

    <EmptyState v-if="items.length === 0" text="暂无失物招领信息" />
    <div v-else class="list">
      <ItemCard
        v-for="item in items"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="typeLabel[item.type] || item.type"
        :location="item.location"
        :time="item.eventTime"
      >
        <template #footer>
          <span>物品：{{ item.itemName }}</span>
          <span class="contact">{{ formatContact(item.contact) }}</span>
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
.contact { margin-left: auto; color: #6b7280; font-size: 13px; }
</style>
