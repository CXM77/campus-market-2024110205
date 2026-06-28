<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('all')

const messages = [
  { id: 1, user: '张三', avatar: '👤', content: '你好，请问这个商品还在吗？', time: '10:32', unread: true },
  { id: 2, user: '李四', avatar: '👤', content: '我已经收到物品了，谢谢！', time: '昨天', unread: true },
  { id: 3, user: '王五', avatar: '👤', content: '拼单还差一个人，要一起吗？', time: '昨天', unread: false },
  { id: 4, user: '系统通知', avatar: '📢', content: '您的发布已审核通过', time: '3天前', unread: false },
]
</script>

<template>
  <div>
    <h1 class="page-title">消息</h1>

    <div class="card mb-16">
      <div class="flex flex-center gap-8">
        <button class="tab-btn" :class="{ active: tab === 'all' }" @click="tab = 'all'">全部</button>
        <button class="tab-btn" :class="{ active: tab === 'unread' }" @click="tab = 'unread'">未读</button>
      </div>
    </div>

    <div class="msg-list">
      <div v-for="msg in messages.filter(m => tab === 'all' || (tab === 'unread' && m.unread))" :key="msg.id" class="msg-item card card-hover">
        <div class="msg-avatar">{{ msg.avatar }}</div>
        <div class="msg-body">
          <div class="msg-header">
            <span class="msg-name">{{ msg.user }}</span>
            <span class="msg-time">{{ msg.time }}</span>
          </div>
          <p class="msg-content">{{ msg.content }}</p>
        </div>
        <span v-if="msg.unread" class="unread-dot"></span>
      </div>
    </div>

    <div v-if="messages.filter(m => tab === 'all' || (tab === 'unread' && m.unread)).length === 0" class="empty">暂无消息</div>
  </div>
</template>

<style scoped>
.tab-btn { padding: 6px 18px; border-radius: 20px; border: 1px solid var(--border); background: #fff; cursor: pointer; font-size: 14px; color: var(--text-secondary); }
.tab-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
.msg-list { display: flex; flex-direction: column; gap: 12px; }
.msg-item { display: flex; gap: 14px; align-items: flex-start; position: relative; }
.msg-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.msg-body { flex: 1; min-width: 0; }
.msg-header { display: flex; justify-content: space-between; align-items: center; }
.msg-name { font-weight: 600; font-size: 14px; }
.msg-time { font-size: 12px; color: var(--text-secondary); }
.msg-content { font-size: 13px; color: var(--text-secondary); margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.unread-dot { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; position: absolute; top: 20px; right: 20px; }
.empty { text-align: center; padding: 60px 0; color: var(--text-secondary); }
</style>
