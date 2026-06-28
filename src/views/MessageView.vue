<script setup lang="ts">
import { useMarketStore } from '@/stores/market'

const store = useMarketStore()
</script>

<template>
  <div>
    <h1>消息页</h1>
    <div v-if="store.messages.length" class="list">
      <div
        v-for="m in store.messages"
        :key="m.id"
        class="msg"
        :class="{ unread: !m.read }"
        @click="store.markRead(m.id)"
      >
        <div class="msg-head">
          <strong>{{ m.from }}</strong>
          <span class="time">{{ m.time }}</span>
          <span v-if="!m.read" class="dot"></span>
        </div>
        <p class="msg-text">{{ m.text }}</p>
      </div>
    </div>
    <p v-else>暂无消息</p>
  </div>
</template>

<style scoped>
.list { margin-top: 16px; display: flex; flex-direction: column; gap: 8px; max-width: 500px; }
.msg { border: 1px solid #eee; padding: 12px; border-radius: 8px; cursor: pointer; }
.msg.unread { background: #fef2f2; border-color: #fecaca; }
.msg-head { display: flex; align-items: center; gap: 10px; }
.time { color: #999; font-size: 13px; margin-left: auto; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: #f43f5e; }
.msg-text { margin: 6px 0 0; color: #555; font-size: 14px; }
</style>
