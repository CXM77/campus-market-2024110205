<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { getTrades, type TradeItem } from '@/api/trade'
import { useFavoriteStore } from '@/stores/favorite'
const favStore = useFavoriteStore()

const trades = ref<TradeItem[]>([])

function formatContact(contact: string): string {
  const prefixes = ['手机:', '手机：', '微信:', '微信：', 'QQ:', 'QQ：', '站内消息', '站外消息']
  if (prefixes.some(p => contact.startsWith(p))) return contact
  if (/^\d{7,15}$/.test(contact)) return '手机: ' + contact
  return contact
}

onMounted(async () => {
  const res = await getTrades()
  trades.value = res.data
})
</script>

<template>
  <section class="page">
    <div class="page-header">
      <h1>二手交易</h1>
      <p>浏览同学发布的闲置物品，发现校园内的实用好物。</p>
    </div>

    <EmptyState v-if="trades.length === 0" text="暂无二手交易信息" />
    <div v-else class="list">
      <ItemCard
        v-for="item in trades"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.category"
        :location="item.location"
        :time="item.publishTime"
      >
        <template #footer>
          <strong>￥{{ item.price }}</strong>
          <span class="condition">{{ item.condition }}</span>
          <span class="contact">{{ formatContact(item.contact) }}</span>
          <button class="fav-btn" @click="favStore.toggleFav(item.id, 'trade')">收藏：{{ favStore.isFav(item.id, 'trade') ? '★' : '☆' }}</button>
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
.condition { margin-left: 12px; color: #6b7280; }
.contact { color: #2563eb; font-size: 13px; }
.fav-btn { cursor: pointer; font-size: inherit; margin-left: auto; user-select: none; border: none; background: none; padding: 0; font-family: inherit; color: #6b7280; }
</style>
