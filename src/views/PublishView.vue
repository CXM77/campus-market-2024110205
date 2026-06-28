<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const form = ref({
  type: 'trade',
  title: '',
  description: '',
  price: undefined as number | undefined,
  reward: undefined as number | undefined,
  location: '',
  contact: '',
  category: '',
})

const types = [
  { value: 'trade', label: '二手交易', icon: '🛒' },
  { value: 'lost', label: '失物招领', icon: '🔍' },
  { value: 'group', label: '拼单搭子', icon: '👥' },
  { value: 'errand', label: '跑腿委托', icon: '🏃' },
]

const tradeCategories = ['电子产品', '书籍教材', '生活用品', '服饰鞋包', '其他']

function submit() {
  if (!form.value.title) return alert('请输入标题')
  router.push('/')
}
</script>

<template>
  <div>
    <h1 class="page-title">发布信息</h1>

    <div class="card" style="max-width:640px;margin:0 auto">
      <div class="form-group">
        <label class="form-label">信息类型</label>
        <div class="grid-4">
          <div v-for="t in types" :key="t.value"
            class="type-card" :class="{ active: form.type === t.value }"
            @click="form.type = t.value">
            <div class="type-icon">{{ t.icon }}</div>
            <div>{{ t.label }}</div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">标题</label>
        <input v-model="form.title" class="form-input" placeholder="请输入标题" />
      </div>

      <div class="form-group">
        <label class="form-label">描述</label>
        <textarea v-model="form.description" class="form-textarea" placeholder="请详细描述..." rows="4"></textarea>
      </div>

      <div class="form-group" v-if="form.type === 'trade'">
        <label class="form-label">分类</label>
        <div class="flex flex-center gap-8">
          <button v-for="c in tradeCategories" :key="c"
            class="filter-btn" :class="{ active: form.category === c }"
            @click="form.category = c">{{ c }}</button>
        </div>
      </div>

      <div class="grid-2">
        <div class="form-group" v-if="form.type === 'trade' || form.type === 'group'">
          <label class="form-label">{{ form.type === 'group' ? '预估价格' : '价格' }}</label>
          <input v-model="form.price" type="number" class="form-input" placeholder="0" />
        </div>
        <div class="form-group" v-if="form.type === 'lost' || form.type === 'errand'">
          <label class="form-label">酬金</label>
          <input v-model="form.reward" type="number" class="form-input" placeholder="0" />
        </div>
        <div class="form-group">
          <label class="form-label">地点</label>
          <input v-model="form.location" class="form-input" placeholder="如：二食堂" />
        </div>
        <div class="form-group">
          <label class="form-label">联系方式</label>
          <input v-model="form.contact" class="form-input" placeholder="手机号/微信" />
        </div>
      </div>

      <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px" @click="submit">提交发布</button>
    </div>
  </div>
</template>

<style scoped>
.form-group { margin-bottom: 16px; }
.form-label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; color: var(--text); }
.form-input { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; outline: none; }
.form-input:focus { border-color: var(--primary); }
.form-textarea { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; outline: none; resize: vertical; font-family: inherit; }
.form-textarea:focus { border-color: var(--primary); }
.type-card { text-align: center; padding: 12px 8px; border-radius: 8px; border: 2px solid var(--border); cursor: pointer; transition: all .2s; font-size: 13px; }
.type-card:hover { border-color: var(--primary); }
.type-card.active { border-color: var(--primary); background: var(--primary-light); color: var(--primary); }
.type-icon { font-size: 24px; margin-bottom: 4px; }
.filter-btn { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background: #fff; cursor: pointer; font-size: 13px; color: var(--text-secondary); }
.filter-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }
</style>
