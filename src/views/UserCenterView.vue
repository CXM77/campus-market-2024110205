<script setup lang="ts">
import { useMarketStore } from '@/stores/market'
import { useRouter } from 'vue-router'
const store = useMarketStore()
const router = useRouter()

const user = {
  name: '校园用户',
  id: '2024001',
  avatar: '👤',
  joinDate: '2024年9月',
  publishedCount: store.goodsList.length,
}

const menuItems = [
  { icon: '📋', label: '我的发布', path: '' },
  { icon: '⭐', label: '我的收藏', path: '' },
  { icon: '🔄', label: '我的交易', path: '' },
  { icon: '💬', label: '我的评价', path: '' },
  { icon: '⚙️', label: '账号设置', path: '' },
]
</script>

<template>
  <div>
    <h1 class="page-title">个人中心</h1>

    <div class="user-card card">
      <div class="user-avatar">{{ user.avatar }}</div>
      <div class="user-info">
        <h2 class="user-name">{{ user.name }}</h2>
        <p class="user-meta">学号: {{ user.id }} · 加入于 {{ user.joinDate }}</p>
      </div>
      <button class="btn btn-outline">编辑资料</button>
    </div>

    <div class="grid-3 mt-16">
      <div v-for="item in menuItems" :key="item.label" class="card card-hover menu-item">
        <div class="menu-icon">{{ item.icon }}</div>
        <div class="menu-label">{{ item.label }}</div>
      </div>
    </div>

    <div class="card mt-24">
      <h3 class="section-title">我的数据</h3>
      <div class="stats-row">
        <div class="stat-box">
          <div class="stat-num">{{ user.publishedCount }}</div>
          <div class="stat-lbl">发布总数</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">0</div>
          <div class="stat-lbl">完成交易</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">0</div>
          <div class="stat-lbl">收藏</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-card { display: flex; align-items: center; gap: 16px; }
.user-avatar { width: 60px; height: 60px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; font-size: 28px; }
.user-name { font-size: 18px; font-weight: 700; }
.user-meta { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }
.menu-item { text-align: center; padding: 20px; }
.menu-icon { font-size: 32px; margin-bottom: 8px; }
.menu-label { font-size: 14px; font-weight: 500; }
.section-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
.stats-row { display: flex; gap: 24px; }
.stat-box { flex: 1; text-align: center; }
.stat-num { font-size: 28px; font-weight: 800; color: var(--primary); }
.stat-lbl { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }
</style>
