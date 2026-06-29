<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { getTrades, type TradeItem } from '@/api/trade'

const trades = ref<TradeItem[]>([])

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
.condition { margin-left: 12px; color: #6b7280; }
.contact { margin-left: auto; color: #2563eb; font-size: 13px; }
</style>
