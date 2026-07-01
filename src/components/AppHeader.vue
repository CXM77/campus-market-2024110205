<script setup lang="ts">
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/trade', label: '二手交易', icon: '🛒' },
  { path: '/lost-found', label: '失物招领', icon: '🔍' },
  { path: '/group-buy', label: '拼单搭子', icon: '👥' },
  { path: '/errand', label: '跑腿委托', icon: '🏃' },
  { path: '/publish', label: '发布', icon: '✏️' },
  { path: '/message', label: '消息', icon: '💬' },
  { path: '/user', label: '我的', icon: '👤' },
]
</script>

<template>
  <header class="topbar">
    <div class="topbar-inner">
      <router-link to="/" class="logo">
        <span class="logo-icon">🎒</span>
        <span class="logo-text">校园轻集市</span>
      </router-link>
      <nav class="nav">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </nav>
      <router-link to="/user" class="nav-item user-badge">
        <span>{{ userStore.avatar }}</span>
        <span>{{ userStore.username }}</span>
      </router-link>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  background: #fff; border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 100; box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.topbar-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 24px;
  display: flex; align-items: center; height: 60px;
}
.logo { display: flex; align-items: center; gap: 8px; text-decoration: none; margin-right: 32px; }
.logo-icon { font-size: 24px; }
.logo-text { font-size: 18px; font-weight: 700; color: var(--primary); white-space: nowrap; }
.nav { display: flex; gap: 2px; flex: 1; }
.nav-item {
  display: flex; align-items: center; gap: 4px;
  padding: 6px 14px; border-radius: 8px; text-decoration: none;
  color: var(--text-secondary); font-size: 14px; transition: all .2s;
}
.nav-item:hover { background: var(--primary-light); color: var(--primary); }
.nav-item.router-link-active { background: var(--primary); color: #fff; }
.nav-icon { font-size: 16px; }
</style>
