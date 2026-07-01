<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useUserStore } from '@/stores/user'
import { useFavoriteStore } from '@/stores/favorite'
import { getTrades, type TradeItem } from '@/api/trade'
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'
import { getErrands, type ErrandItem } from '@/api/errand'

const userStore = useUserStore()
const favStore = useFavoriteStore()

const trades = ref<TradeItem[]>([])
const lostFounds = ref<LostFoundItem[]>([])
const groupBuys = ref<GroupBuyItem[]>([])
const errands = ref<ErrandItem[]>([])

onMounted(async () => {
  const [a, b, c, d] = await Promise.all([
    getTrades(),
    getLostFounds(),
    getGroupBuys(),
    getErrands(),
  ])
  trades.value = a.data
  lostFounds.value = b.data
  groupBuys.value = c.data
  errands.value = d.data
})

const tab = ref('publish')

const myPublishes = computed(() => {
  const list: { type: string; tag: string; time: string; title: string; description: string; location: string }[] = []
  const name = userStore.displayName
  for (const item of trades.value) {
    if (item.publisher === name) {
      list.push({ type: 'trade', tag: '二手', time: item.publishTime, title: item.title, description: item.description, location: item.location })
    }
  }
  for (const item of lostFounds.value) {
    if ((item as any).publisher === name) {
      list.push({ type: 'lostFound', tag: item.type === 'lost' ? '丢失' : '拾到', time: item.eventTime, title: item.title, description: item.description, location: item.location })
    }
  }
  for (const item of groupBuys.value) {
    if (item.publisher === name) {
      list.push({ type: 'groupBuy', tag: '拼单', time: item.deadline, title: item.title, description: item.description, location: item.location })
    }
  }
  for (const item of errands.value) {
    if (item.publisher === name) {
      list.push({ type: 'errand', tag: '跑腿', time: item.deadline, title: item.title, description: item.description, location: item.from + ' → ' + item.to })
    }
  }
  return list.sort((a, b) => b.time.localeCompare(a.time))
})

const myFavorites = computed(() => {
  const list: { time: string; title: string; description: string; tag: string; location: string }[] = []
  for (const item of trades.value) {
    if (favStore.isFav(item.id, 'trade')) {
      list.push({ time: item.publishTime, title: item.title, description: item.description, tag: '二手', location: item.location })
    }
  }
  for (const item of lostFounds.value) {
    if (favStore.isFav(item.id, 'lostFound')) {
      const tag = item.type === 'lost' ? '丢失' : '拾到'
      list.push({ time: item.eventTime, title: item.title, description: item.description, tag, location: item.location })
    }
  }
  for (const item of groupBuys.value) {
    if (favStore.isFav(item.id, 'groupBuy')) {
      list.push({ time: item.deadline, title: item.title, description: item.description, tag: '拼单', location: item.location })
    }
  }
  for (const item of errands.value) {
    if (favStore.isFav(item.id, 'errand')) {
      list.push({ time: item.deadline, title: item.title, description: item.description, tag: '跑腿', location: item.from + ' → ' + item.to })
    }
  }
  return list.sort((a, b) => b.time.localeCompare(a.time))
})

function formatContact(contact: string): string {
  const prefixes = ['手机:', '手机：', '微信:', '微信：', 'QQ:', 'QQ：', '站内消息', '站外消息']
  if (prefixes.some(p => contact.startsWith(p))) return contact
  if (/^\d{7,15}$/.test(contact)) return '手机: ' + contact
  return contact
}
</script>

<template>
  <section class="page">
    <div class="page-header">
      <h1>个人中心</h1>
    </div>

    <div class="user-card card">
      <div class="user-avatar">{{ userStore.avatar }}</div>
      <div class="user-info">
        <h2 class="user-name">{{ userStore.username }}</h2>
        <p class="user-meta">{{ userStore.college }} · {{ userStore.grade }} · 学号 {{ userStore.studentId }}</p>
      </div>
    </div>

    <div class="card">
      <div class="stats-row">
        <div class="stat-box">
          <div class="stat-num">{{ myPublishes.length }}</div>
          <div class="stat-lbl">发布总数</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">{{ favStore.favCount }}</div>
          <div class="stat-lbl">收藏</div>
        </div>
      </div>
    </div>

    <div class="card tabs">
      <button class="tab-btn" :class="{ active: tab === 'publish' }" @click="tab = 'publish'">我的发布</button>
      <button class="tab-btn" :class="{ active: tab === 'fav' }" @click="tab = 'fav'">我的收藏</button>
    </div>

    <template v-if="tab === 'publish'">
      <EmptyState v-if="myPublishes.length === 0" text="还没有发布过内容" />
      <div v-else class="list">
        <ItemCard
          v-for="(item, i) in myPublishes" :key="i"
          :title="item.title"
          :description="item.description"
          :tag="item.tag"
          :location="item.location"
          :time="item.time"
        />
      </div>
    </template>

    <template v-else>
      <EmptyState v-if="myFavorites.length === 0" text="还没有收藏过内容" />
      <div v-else class="list">
        <ItemCard
          v-for="(item, i) in myFavorites" :key="i"
          :title="item.title"
          :description="item.description"
          :tag="item.tag"
          :location="item.location"
          :time="item.time"
        />
      </div>
    </template>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }
.page-header { padding: 24px; border-radius: 16px; background: #fff; }
.page-header h1 { margin: 0 0 8px; }
.user-card { display: flex; align-items: center; gap: 16px; }
.user-avatar { width: 60px; height: 60px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
.user-name { font-size: 18px; font-weight: 700; }
.user-meta { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }
.stats-row { display: flex; gap: 24px; }
.stat-box { flex: 1; text-align: center; }
.stat-num { font-size: 28px; font-weight: 800; color: var(--primary); }
.stat-lbl { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }
.tabs { display: flex; gap: 8px; }
.tab-btn { padding: 8px 20px; border-radius: 8px; border: none; background: #f3f4f6; color: #374151; font-size: 14px; cursor: pointer; }
.tab-btn.active { background: var(--primary); color: #fff; }
.list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
</style>
