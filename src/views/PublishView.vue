<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import { createTrade } from '@/api/trade'
import { createLostFound } from '@/api/lostFound'
import { createGroupBuy } from '@/api/groupBuy'
import { createErrand } from '@/api/errand'

const router = useRouter()

const form = ref({
  type: 'trade',
  title: '',
  description: '',
  location: '',
  contactType: '手机',
  contactValue: '',
  category: '',
  condition: '',
  price: undefined as number | undefined,
  lostType: 'lost',
  itemName: '',
  eventTime: '',
  groupType: '',
  targetCount: undefined as number | undefined,
  deadline: '',
  taskType: '',
  reward: undefined as number | undefined,
  from: '',
  to: '',
})

const errors = ref<Record<string, string>>({})

const typeList = [
  { value: 'trade', label: '二手交易' },
  { value: 'lostFound', label: '失物招领' },
  { value: 'groupBuy', label: '拼单搭子' },
  { value: 'errand', label: '跑腿委托' },
]

const tradeCategories = ['电子产品', '书籍教材', '生活用品', '服饰鞋包', '其他']
const conditions = ['全新', '九成新', '八成新', '七成新', '五成及以下']
const groupTypes = ['拼餐', '学习资料', '运动娱乐', '生活团购', '其他']
const taskTypes = ['取快递', '代买', '跑腿', '其他']
const contactOptions = ['手机', '微信', 'QQ']
const needInput = ['手机', '微信', 'QQ']

function validateForm(): boolean {
  const e: Record<string, string> = {}
  if (!form.value.title.trim()) e.title = '请输入标题'
  if (form.value.type === 'trade') {
    if (!form.value.price || form.value.price <= 0) e.price = '请输入有效价格'
    if (!form.value.condition.trim()) e.condition = '请选择成色'
  }
  if (form.value.type === 'lostFound') {
    if (!form.value.itemName.trim()) e.itemName = '请输入物品名称'
  }
  if (form.value.type === 'groupBuy') {
    if (!form.value.targetCount || form.value.targetCount <= 0) e.targetCount = '请输入有效目标人数'
  }
  if (form.value.type === 'errand') {
    if (!form.value.reward || form.value.reward <= 0) e.reward = '请输入有效酬劳'
    if (!form.value.from.trim()) e.from = '请输入取件地点'
    if (!form.value.to.trim()) e.to = '请输入送达地点'
  }
  if (needInput.includes(form.value.contactType) && !form.value.contactValue.trim()) {
    e.contactValue = '请输入' + form.value.contactType
  }
  errors.value = e
  return Object.keys(e).length === 0
}

function resetForm() {
  form.value = {
    type: form.value.type,
    title: '', description: '', location: '', contactType: '手机', contactValue: '',
    category: '', condition: '', price: undefined,
    lostType: 'lost', itemName: '', eventTime: '',
    groupType: '', targetCount: undefined, deadline: '',
    taskType: '', reward: undefined, from: '', to: '',
  }
  errors.value = {}
}

watch(() => form.value.type, () => resetForm())

const routeMap: Record<string, string> = {
  trade: '/trade',
  lostFound: '/lost-found',
  groupBuy: '/group-buy',
  errand: '/errand',
}

async function handleSubmit() {
  if (!validateForm()) return
  const d = new Date()
  const now = d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0') + ' ' +
    String(d.getHours()).padStart(2, '0') + ':' +
    String(d.getMinutes()).padStart(2, '0')
  const formatDT = (v: string) => v ? v.replace('T', ' ') : ''
  const f = form.value
  const contact = needInput.includes(f.contactType)
    ? f.contactType + ': ' + f.contactValue.trim()
    : f.contactType
  try {
    switch (f.type) {
      case 'trade':
        await createTrade({
          title: f.title,
          category: f.category,
          price: f.price!,
          condition: f.condition,
          location: f.location,
          publisher: '校园用户',
          publishTime: now,
          image: '',
          status: 'open',
          description: f.description,
          contact,
        })
        break
      case 'lostFound':
        await createLostFound({
          title: f.title,
          type: f.lostType as 'lost' | 'found',
          itemName: f.itemName,
          location: f.location,
          eventTime: formatDT(f.eventTime),
          contact,
          status: 'open',
          description: f.description,
        })
        break
      case 'groupBuy':
        await createGroupBuy({
          title: f.title,
          type: f.groupType,
          targetCount: f.targetCount!,
          currentCount: 1,
          deadline: formatDT(f.deadline),
          location: f.location,
          publisher: '校园用户',
          status: 'open',
          description: f.description,
          contact,
        })
        break
      case 'errand':
        await createErrand({
          title: f.title,
          taskType: f.taskType,
          reward: f.reward!,
          from: f.from,
          to: f.to,
          deadline: formatDT(f.deadline),
          publisher: '校园用户',
          status: 'open',
          description: f.description,
        })
        break
    }
    alert('发布成功！')
    router.push(routeMap[f.type]!)
  } catch {
    alert('发布失败，请检查 Mock 服务是否运行。')
  }
}
</script>

<template>
  <section class="page">
    <div class="page-header">
      <h1>发布信息</h1>
      <p>选择信息类型，填写相关内容后提交。</p>
    </div>

    <form class="publish-form" @submit.prevent="handleSubmit">
      <!-- 类型选择 -->
      <FormField label="信息类型" required>
        <div class="type-group">
          <button
            v-for="t in typeList" :key="t.value"
            type="button"
            :class="['type-btn', { active: form.type === t.value }]"
            @click="form.type = t.value"
          >{{ t.label }}</button>
        </div>
      </FormField>

      <!-- 标题 -->
      <FormField label="标题" required :error="errors.title">
        <input v-model="form.title" placeholder="请输入标题" />
      </FormField>

      <!-- 二手交易专属 -->
      <template v-if="form.type === 'trade'">
        <FormField label="分类" :error="errors.category">
          <div class="chip-group">
            <button
              v-for="c in tradeCategories" :key="c"
              type="button"
              :class="['chip', { active: form.category === c }]"
              @click="form.category = c"
            >{{ c }}</button>
          </div>
        </FormField>
        <FormField label="成色">
          <div class="chip-group">
            <button
              v-for="c in conditions" :key="c"
              type="button"
              :class="['chip', { active: form.condition === c }]"
              @click="form.condition = c"
            >{{ c }}</button>
          </div>
        </FormField>
        <FormField label="价格" required :error="errors.price">
          <input v-model.number="form.price" type="number" min="0" placeholder="0" />
        </FormField>
      </template>

      <!-- 失物招领专属 -->
      <template v-if="form.type === 'lostFound'">
        <FormField label="类型" required>
          <div class="chip-group">
            <button
              type="button"
              :class="['chip', { active: form.lostType === 'lost' }]"
              @click="form.lostType = 'lost'"
            >丢失</button>
            <button
              type="button"
              :class="['chip', { active: form.lostType === 'found' }]"
              @click="form.lostType = 'found'"
            >拾到</button>
          </div>
        </FormField>
        <FormField label="物品名称" required :error="errors.itemName">
          <input v-model="form.itemName" placeholder="如：校园卡、雨伞" />
        </FormField>
        <FormField label="时间">
          <input v-model="form.eventTime" type="datetime-local" />
        </FormField>
      </template>

      <!-- 拼单搭子专属 -->
      <template v-if="form.type === 'groupBuy'">
        <FormField label="类型">
          <div class="chip-group">
            <button
              v-for="c in groupTypes" :key="c"
              type="button"
              :class="['chip', { active: form.groupType === c }]"
              @click="form.groupType = c"
            >{{ c }}</button>
          </div>
        </FormField>
        <FormField label="目标人数" required :error="errors.targetCount">
          <input v-model.number="form.targetCount" type="number" min="1" placeholder="如：4" />
        </FormField>
        <FormField label="截止时间">
          <input v-model="form.deadline" type="datetime-local" />
        </FormField>
      </template>

      <!-- 跑腿委托专属 -->
      <template v-if="form.type === 'errand'">
        <FormField label="任务类型">
          <div class="chip-group">
            <button
              v-for="c in taskTypes" :key="c"
              type="button"
              :class="['chip', { active: form.taskType === c }]"
              @click="form.taskType = c"
            >{{ c }}</button>
          </div>
        </FormField>
        <FormField label="酬劳" required :error="errors.reward">
          <input v-model.number="form.reward" type="number" min="0" placeholder="如：5" />
        </FormField>
        <FormField label="取件地点" required :error="errors.from">
          <input v-model="form.from" placeholder="如：菜鸟驿站" />
        </FormField>
        <FormField label="送达地点" required :error="errors.to">
          <input v-model="form.to" placeholder="如：西区 5 栋" />
        </FormField>
        <FormField label="截止时间">
          <input v-model="form.deadline" type="datetime-local" />
        </FormField>
      </template>

      <!-- 通用字段 -->
      <FormField v-if="form.type !== 'errand'" label="地点">
        <input v-model="form.location" placeholder="如：二食堂" />
      </FormField>
      <FormField label="描述">
        <textarea v-model="form.description" rows="4" placeholder="请详细描述..."></textarea>
      </FormField>
      <FormField label="联系方式" :error="errors.contactValue">
        <div class="chip-group">
          <button
            v-for="opt in contactOptions" :key="opt"
            type="button"
            class="chip"
            :class="{ active: form.contactType === opt }"
            @click="form.contactType = opt"
          >{{ opt }}</button>
        </div>
        <input
          v-if="needInput.includes(form.contactType)"
          v-model="form.contactValue"
          :placeholder="'请输入' + form.contactType"
        />
      </FormField>

      <!-- 操作按钮 -->
      <div class="actions">
        <button type="button" class="secondary" @click="resetForm">重置</button>
        <button type="submit" class="primary">提交发布</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }
.page-header { padding: 24px; border-radius: 16px; background: #fff; }
.page-header h1 { margin: 0 0 8px; }
.page-header p { margin: 0; color: #6b7280; }
.publish-form { display: grid; gap: 18px; padding: 24px; border-radius: 16px; background: #fff; }
input, select, textarea { width: 100%; box-sizing: border-box; border: 1px solid #d1d5db; border-radius: 8px; padding: 10px 12px; font-size: 14px; }
textarea { resize: vertical; }
.actions { display: flex; justify-content: flex-end; gap: 12px; }
button { border: none; border-radius: 8px; padding: 10px 18px; cursor: pointer; }
button:disabled { cursor: not-allowed; opacity: 0.7; }
.primary { background: #2563eb; color: #fff; }
.secondary { background: #f3f4f6; color: #374151; }
.type-group { display: flex; gap: 8px; flex-wrap: wrap; }
.type-btn { padding: 8px 16px; border-radius: 8px; background: #f3f4f6; color: #374151; font-size: 14px; }
.type-btn.active { background: #2563eb; color: #fff; }
.chip-group { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { padding: 6px 14px; border-radius: 20px; background: #f3f4f6; color: #374151; font-size: 13px; }
.chip.active { background: #2563eb; color: #fff; }
</style>
