<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import FormField from '@/components/FormField.vue'

const userStore = useUserStore()
import { createTrade, updateTrade, getTradeById } from '@/api/trade'
import { createLostFound, updateLostFound, getLostFoundById } from '@/api/lostFound'
import { createGroupBuy, updateGroupBuy, getGroupBuyById } from '@/api/groupBuy'
import { createErrand, updateErrand, getErrandById } from '@/api/errand'

const router = useRouter()
const route = useRoute()

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

const submitting = ref(false)
const errors = ref<Record<string, string>>({})
const editingId = ref<string | null>(null)

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

function onTargetInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  form.value.targetCount = val === '' ? undefined : parseInt(val, 10) || undefined
}

function onPriceInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  form.value.price = val === '' ? undefined : parseFloat(val) || undefined
}

function onRewardInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  form.value.reward = val === '' ? undefined : parseFloat(val) || undefined
}

function onContactInput(e: Event) {
  const input = e.target as HTMLInputElement
  let val = input.value
  if (form.value.contactType === '手机' || form.value.contactType === 'QQ') {
    val = val.replace(/\D/g, '')
    if (form.value.contactType === '手机') val = val.slice(0, 11)
  }
  form.value.contactValue = val
}

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
  if (needInput.includes(form.value.contactType)) {
    if (!form.value.contactValue.trim()) {
      e.contactValue = '请输入' + form.value.contactType
    } else if (form.value.contactType === '手机' && !/^1\d{10}$/.test(form.value.contactValue)) {
      e.contactValue = '请输入正确的11位手机号'
    }
  }
  errors.value = e
  return Object.keys(e).length === 0
}

function resetForm() {
  const s = form.value
  s.title = ''
  s.description = ''
  s.location = ''
  s.contactType = '手机'
  s.contactValue = ''
  s.category = ''
  s.condition = ''
  s.price = undefined
  s.lostType = 'lost'
  s.itemName = ''
  s.eventTime = ''
  s.groupType = ''
  s.targetCount = undefined
  s.deadline = ''
  s.taskType = ''
  s.reward = undefined
  s.from = ''
  s.to = ''
  errors.value = {}
}

watch(() => form.value.type, () => resetForm())

const routeMap: Record<string, string> = {
  trade: '/trade',
  lostFound: '/lost-found',
  groupBuy: '/group-buy',
  errand: '/errand',
}

onMounted(async () => {
  const editType = route.query.edit as string | undefined
  const id = route.query.id as string | undefined
  if (editType && id) {
    editingId.value = id
    form.value.type = editType
    try {
      let item: any
      switch (editType) {
        case 'trade': item = (await getTradeById(id)).data; break
        case 'lostFound': item = (await getLostFoundById(id)).data; break
        case 'groupBuy': item = (await getGroupBuyById(id)).data; break
        case 'errand': item = (await getErrandById(id)).data; break
      }
      prefillForm(item, editType)
    } catch {
      window.alert('加载数据失败')
      router.push('/')
    }
  }
})

function prefillForm(item: any, type: string) {
  const s = form.value
  s.title = item.title || ''
  s.description = item.description || ''
  const contact = item.contact || ''
  const found = contactOptions.find(opt => contact.startsWith(opt + ':') || contact.startsWith(opt + '：'))
  if (found) {
    s.contactType = found
    const sep = contact.includes('：') ? '：' : ': '
    s.contactValue = contact.substring(contact.indexOf(sep) + sep.length)
  } else {
    s.contactType = contact || '手机'
    s.contactValue = ''
  }
  switch (type) {
    case 'trade':
      s.category = item.category || ''
      s.condition = item.condition || ''
      s.price = item.price || undefined
      s.location = item.location || ''
      break
    case 'lostFound':
      s.lostType = item.type || 'lost'
      s.itemName = item.itemName || ''
      s.eventTime = item.eventTime ? item.eventTime.replace(' ', 'T') : ''
      s.location = item.location || ''
      break
    case 'groupBuy':
      s.groupType = item.type || ''
      s.targetCount = item.targetCount || undefined
      s.deadline = item.deadline ? item.deadline.replace(' ', 'T') : ''
      s.location = item.location || ''
      break
    case 'errand':
      s.taskType = item.taskType || ''
      s.reward = item.reward || undefined
      s.from = item.from || ''
      s.to = item.to || ''
      s.deadline = item.deadline ? item.deadline.replace(' ', 'T') : ''
      break
  }
}

async function handleSubmit() {
  if (!validateForm()) return
  if (!userStore.isLoggedIn || !userStore.currentUser) {
    window.alert('请先登录后再发布信息')
    router.push('/login')
    return
  }
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
  submitting.value = true
  try {
    if (editingId.value) {
      const id = editingId.value
      switch (f.type) {
        case 'trade':
          await updateTrade(id, {
            title: f.title, category: f.category, price: Number(f.price),
            condition: f.condition, location: f.location,
            description: f.description, contact,
          })
          break
        case 'lostFound':
          await updateLostFound(id, {
            title: f.title, type: f.lostType as 'lost' | 'found',
            itemName: f.itemName, location: f.location,
            eventTime: formatDT(f.eventTime), contact,
            description: f.description,
          })
          break
        case 'groupBuy':
          await updateGroupBuy(id, {
            title: f.title, type: f.groupType, targetCount: Number(f.targetCount),
            deadline: formatDT(f.deadline), location: f.location,
            description: f.description, contact,
          })
          break
        case 'errand':
          await updateErrand(id, {
            title: f.title, taskType: f.taskType, reward: Number(f.reward),
            from: f.from, to: f.to, deadline: formatDT(f.deadline),
            description: f.description,
          })
          break
      }
      window.alert('更新成功！')
    } else {
      switch (f.type) {
        case 'trade':
          await createTrade({
            title: f.title, category: f.category, price: Number(f.price),
            condition: f.condition, location: f.location,
            publisher: userStore.displayName, publishTime: now,
            image: '', status: 'open', description: f.description, contact,
          })
          break
        case 'lostFound':
          await createLostFound({
            title: f.title, type: f.lostType as 'lost' | 'found',
            itemName: f.itemName, location: f.location,
            eventTime: formatDT(f.eventTime), contact,
            status: 'open', description: f.description,
            publisher: userStore.displayName,
          })
          break
        case 'groupBuy':
          await createGroupBuy({
            title: f.title, type: f.groupType, targetCount: Number(f.targetCount),
            currentCount: 1, deadline: formatDT(f.deadline), location: f.location,
            publisher: userStore.displayName, status: 'open',
            description: f.description, contact,
          })
          break
        case 'errand':
          await createErrand({
            title: f.title, taskType: f.taskType, reward: Number(f.reward),
            from: f.from, to: f.to, deadline: formatDT(f.deadline),
            publisher: userStore.displayName, status: 'open',
            description: f.description,
          })
          break
      }
      window.alert('发布成功！')
    }
    router.push(routeMap[f.type]!)
  } catch {
    window.alert(editingId.value ? '更新失败' : '发布失败，请确认 JSON Server 已启动，并检查表单数据是否完整。')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="page">
    <div class="page-header">
      <h1>{{ editingId ? '编辑信息' : '发布信息' }}</h1>
      <p>{{ editingId ? '修改已发布的信息内容。' : '选择信息类型，填写相关内容后提交。' }}</p>
    </div>

    <form class="publish-form" @submit.prevent="handleSubmit">
      <!-- 类型选择 -->
      <FormField label="信息类型" required>
        <div class="type-group">
          <button
            v-for="t in typeList" :key="t.value"
            type="button"
            :class="['type-btn', { active: form.type === t.value }]"
            :disabled="!!editingId"
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
          <input :value="form.price || ''" @input="onPriceInput" type="text" inputmode="numeric" placeholder="0" />
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
          <input :value="form.targetCount || ''" @input="onTargetInput" type="text" inputmode="numeric" placeholder="如：4" />
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
          <input :value="form.reward || ''" @input="onRewardInput" type="text" inputmode="numeric" placeholder="如：5" />
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
          :value="form.contactValue"
          @input="onContactInput"
          :inputmode="form.contactType === '手机' || form.contactType === 'QQ' ? 'numeric' : 'text'"
          :placeholder="'请输入' + form.contactType"
        />
      </FormField>

      <!-- 操作按钮 -->
      <div class="actions">
        <button type="button" class="secondary" @click="resetForm">重置</button>
        <button type="submit" class="primary" :disabled="submitting">{{ submitting ? '提交中...' : editingId ? '保存修改' : '提交发布' }}</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }
.page-header { padding: 24px; border-radius: var(--radius); background: #fff; border-left: 4px solid var(--primary); }
.page-header h1 { margin: 0 0 8px; }
.page-header p { margin: 0; color: var(--text-secondary); }
.publish-form { display: grid; gap: 20px; padding: 28px; border-radius: var(--radius); background: #fff; box-shadow: var(--shadow); }
input, select, textarea { width: 100%; box-sizing: border-box; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 11px 14px; font-size: 14px; outline: none; transition: all .25s ease; }
input:focus, select:focus, textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(79,140,247,0.15); }
textarea { resize: vertical; }
.actions { display: flex; justify-content: flex-end; gap: 12px; }
button { border: none; border-radius: var(--radius-sm); padding: 10px 20px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all .25s ease; }
button:disabled { cursor: not-allowed; opacity: 0.7; }
.primary { background: var(--primary-gradient); color: #fff; box-shadow: 0 4px 14px rgba(79,140,247,0.3); }
.primary:hover { box-shadow: 0 6px 20px rgba(79,140,247,0.4); transform: translateY(-1px); }
.secondary { background: #f1f5f9; color: var(--text); border: 1px solid var(--border); }
.secondary:hover { background: #e2e8f0; }
.type-group { display: flex; gap: 8px; flex-wrap: wrap; }
.type-btn { padding: 9px 18px; border-radius: var(--radius-sm); background: #f1f5f9; color: var(--text-secondary); font-size: 14px; font-weight: 500; }
.type-btn.active { background: var(--primary-gradient); color: #fff; }
.chip-group { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { padding: 7px 16px; border-radius: 999px; background: #f1f5f9; color: var(--text-secondary); font-size: 13px; font-weight: 500; transition: all .2s; }
.chip:hover { background: #e2e8f0; }
.chip.active { background: var(--primary-gradient); color: #fff; }
</style>
