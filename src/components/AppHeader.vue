<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
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

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
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
      <div class="user-actions">
        <template v-if="userStore.isLoggedIn">
          <router-link to="/user">{{ userStore.displayName }}</router-link>
          <button type="button" @click="handleLogout">退出</button>
        </template>
        <template v-else>
          <router-link to="/login">登录</router-link>
          <router-link to="/register">注册</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar { background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.topbar-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; height: 64px; }
.logo { display: flex; align-items: center; gap: 10px; text-decoration: none; margin-right: 32px; }
.logo-icon { font-size: 26px; }
.logo-text { font-size: 20px; font-weight: 800; background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; white-space: nowrap; }
.nav { display: flex; gap: 2px; flex: 1; }
.nav-item { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: var(--radius-sm); text-decoration: none; color: var(--text-secondary); font-size: 14px; font-weight: 500; transition: all .25s ease; }
.nav-item:hover { background: var(--primary-light); color: var(--primary); }
.nav-item.router-link-active { background: var(--primary-gradient); color: #fff; box-shadow: 0 4px 12px rgba(79,140,247,0.3); }
.nav-icon { font-size: 16px; }
.user-actions { display: flex; align-items: center; gap: 12px; font-size: 14px; }
.user-actions a { color: var(--primary); text-decoration: none; font-weight: 500; }
.user-actions button { border: none; border-radius: var(--radius-sm); padding: 6px 12px; cursor: pointer; background: #f1f5f9; color: var(--text); font-size: 13px; }
.user-actions button:hover { background: #e2e8f0; }
</style>
