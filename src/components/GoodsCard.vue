<script setup lang="ts">
import type { Goods } from '@/stores/market'

const props = defineProps<{
  item: Goods
}>()

const typeLabel: Record<string, string> = { trade: '二手', lost: '失物', group: '拼单', errand: '跑腿' }
const typeTagClass: Record<string, string> = { trade: 'tag-blue', lost: 'tag-red', group: 'tag-yellow', errand: 'tag-green' }
</script>

<template>
  <div v-if="item.type === 'trade'" class="card card-hover">
    <h3 class="item-title">{{ item.title }}</h3>
    <p class="item-desc">{{ item.description }}</p>
    <div class="flex flex-center gap-12 mt-16">
      <span class="price">¥{{ item.price ?? 0 }}</span>
      <span class="tag tag-blue">{{ item.category }}</span>
      <span class="text-secondary" style="margin-left:auto">{{ item.location }}</span>
    </div>
    <div class="flex flex-center gap-8 mt-8">
      <span class="text-secondary">卖家: {{ item.contact || '匿名' }}</span>
      <span class="tag tag-gray">{{ item.status ?? '在售' }}</span>
    </div>
  </div>

  <div v-else-if="item.type === 'lost'" class="card card-hover">
    <div class="flex flex-center gap-8">
      <span class="tag" :class="item.status === '丢失' ? 'tag-red' : 'tag-green'">{{ item.status }}</span>
      <span class="text-secondary">{{ item.time ?? '' }}</span>
    </div>
    <h3 class="item-title mt-16">{{ item.title }}</h3>
    <p class="item-desc">{{ item.description }}</p>
    <div class="flex flex-center gap-12 mt-16">
      <span class="text-secondary">📍 {{ item.location }}</span>
      <span v-if="item.reward" class="price">¥{{ item.reward }}</span>
    </div>
    <div class="flex flex-center gap-8 mt-8">
      <span class="text-secondary">联系人: {{ item.contact || '匿名' }}</span>
      <span class="tag tag-gray">{{ item.status ?? '进行中' }}</span>
    </div>
  </div>

  <div v-else-if="item.type === 'group'" class="card card-hover">
    <div class="flex flex-center gap-8">
      <span class="tag tag-yellow">{{ item.category ?? '拼单' }}</span>
      <span class="tag tag-green">进行中</span>
    </div>
    <h3 class="item-title mt-16">{{ item.title }}</h3>
    <p class="item-desc">{{ item.description }}</p>
    <div class="flex flex-center gap-12 mt-16">
      <span class="price">¥{{ item.price ?? 0 }}</span>
      <span class="text-secondary">目标: {{ item.maxPeople ?? 0 }}人</span>
    </div>
    <div class="progress-bar mt-8">
      <div class="progress-fill" :style="{ width: Math.min(100, ((item.people ?? 0) / (item.maxPeople ?? 1)) * 100) + '%' }"></div>
    </div>
    <div class="flex flex-center gap-8 mt-8">
      <span class="text-secondary">已参与 {{ item.people ?? 0 }} / {{ item.maxPeople ?? 0 }} 人</span>
      <button class="btn btn-outline" style="margin-left:auto;padding:4px 16px">加入</button>
    </div>
  </div>

  <div v-else-if="item.type === 'errand'" class="card card-hover">
    <div class="flex flex-center gap-8">
      <span class="tag" :class="item.status === '进行中' ? 'tag-green' : 'tag-gray'">{{ item.status ?? '进行中' }}</span>
    </div>
    <h3 class="item-title mt-16">{{ item.title }}</h3>
    <p class="item-desc">{{ item.description }}</p>
    <div class="flex flex-center gap-12 mt-16">
      <span class="price">¥{{ item.reward ?? 0 }}</span>
      <span class="text-secondary">📍 {{ item.location }}</span>
    </div>
    <div class="flex flex-center gap-8 mt-8">
      <span class="text-secondary">发布人: {{ item.contact || '匿名' }}</span>
      <button class="btn btn-outline" style="margin-left:auto;padding:4px 16px">接单</button>
    </div>
  </div>

  <div v-else class="card card-hover">
    <div class="flex flex-center gap-8">
      <span class="tag" :class="typeTagClass[item.type]">{{ typeLabel[item.type] || item.type }}</span>
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
</template>

<style scoped>
.item-title { font-size: 15px; font-weight: 600; }
.item-desc { font-size: 13px; color: var(--text-secondary); margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.progress-bar { height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--primary); border-radius: 3px; transition: width .3s; }
</style>
