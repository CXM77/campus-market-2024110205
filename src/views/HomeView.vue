<script setup lang="ts">
import { useMarketStore } from '@/stores/market'
import { useRouter } from 'vue-router'
const store = useMarketStore()
const router = useRouter()

const stats = [
  { label: '在售商品', value: store.tradeList.length, color: '#4a90d9' },
  { label: '失物信息', value: store.lostList.length, color: '#059669' },
  { label: '拼单进行中', value: store.groupList.length, color: '#d97706' },
  { label: '跑腿任务', value: store.errandList.length, color: '#dc2626' },
]

const categories = [
  { name: '二手交易', icon: '🛒', path: '/trade', desc: '闲置物品流转' },
  { name: '失物招领', icon: '🔍', path: '/lost-found', desc: '遗失与拾获' },
  { name: '拼单搭子', icon: '👥', path: '/group-buy', desc: '组队拼单' },
  { name: '跑腿委托', icon: '🏃', path: '/errand', desc: '任务互助' },
]

const recentItems = store.goodsList.slice(0, 4)
</script>

<template>
  <div>
    <div class="hero">
      <h1 class="hero-title">校园轻集市</h1>
      <p class="hero-desc">二手交易 · 失物招领 · 拼单互助 · 跑腿委托</p>
      <div class="hero-search">
        <input class="search-input" placeholder="搜索二手商品、失物、拼单、跑腿任务..." />
        <button class="btn btn-primary">搜索</button>
      </div>
    </div>

    <div class="stats-row">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <div class="stat-value" :style="{ color: s.color }">{{ s.value }}</div>
        <div class="stat-label">{{ s.label }}</div>
      </div>
    </div>

    <h2 class="section-title">快捷入口</h2>
    <div class="grid-4">
      <div v-for="c in categories" :key="c.name" class="card card-hover" @click="router.push(c.path)">
        <div class="cat-icon">{{ c.icon }}</div>
        <div class="cat-name">{{ c.name }}</div>
        <div class="cat-desc">{{ c.desc }}</div>
      </div>
    </div>

    <h2 class="section-title mt-24">最新信息</h2>
    <div class="grid-2">
      <div v-for="item in recentItems" :key="item.id" class="card card-hover" @click="router.push('/' + item.type)">
        <div class="flex flex-center gap-8">
          <span class="tag" :class="'tag-' + (item.type === 'trade' ? 'blue' : item.type === 'lost' ? 'red' : item.type === 'group' ? 'yellow' : 'green')">
            {{ { trade: '二手', lost: '失物', group: '拼单', errand: '跑腿' }[item.type] }}
          </span>
          <span class="text-secondary">{{ item.location }}</span>
        </div>
        <h3 class="item-title mt-16">{{ item.title }}</h3>
        <p class="item-desc">{{ item.description }}</p>
        <div class="flex flex-center gap-12 mt-16">
          <span v-if="item.price" class="price">¥{{ item.price }}</span>
          <span v-if="item.reward" class="price">¥{{ item.reward }}</span>
          <span class="text-secondary">{{ item.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero { text-align: center; padding: 48px 20px 36px; }
.hero-title { font-size: 32px; font-weight: 800; color: var(--primary); }
.hero-desc { color: var(--text-secondary); margin-top: 8px; font-size: 15px; }
.hero-search { display: flex; gap: 8px; max-width: 500px; margin: 20px auto 0; }
.search-input { flex: 1; padding: 10px 16px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; outline: none; }
.search-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(74,144,217,0.1); }
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
.stat-card { background: var(--card-bg); border-radius: var(--radius); padding: 20px; text-align: center; box-shadow: var(--shadow); }
.stat-value { font-size: 32px; font-weight: 800; }
.stat-label { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }
.section-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
.cat-icon { font-size: 36px; margin-bottom: 8px; }
.cat-name { font-weight: 600; font-size: 15px; }
.cat-desc { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }
.item-title { font-size: 15px; font-weight: 600; }
.item-desc { font-size: 13px; color: var(--text-secondary); margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
