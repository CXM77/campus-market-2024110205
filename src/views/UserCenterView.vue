<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ItemCard from '@/components/ItemCard.vue'
import FormField from '@/components/FormField.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useUserStore } from '@/stores/user'
import { useFavoriteStore } from '@/stores/favorite'
import { getTrades, deleteTrade, type TradeItem } from '@/api/trade'
import { getLostFounds, deleteLostFound, type LostFoundItem } from '@/api/lostFound'
import { getGroupBuys, deleteGroupBuy, type GroupBuyItem } from '@/api/groupBuy'
import { getErrands, deleteErrand, type ErrandItem } from '@/api/errand'
import { updateUser } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()
const favStore = useFavoriteStore()

const trades = ref<TradeItem[]>([])
const lostFounds = ref<LostFoundItem[]>([])
const groupBuys = ref<GroupBuyItem[]>([])
const errands = ref<ErrandItem[]>([])

async function loadAll() {
  const [a, b, c, d] = await Promise.all([
    getTrades(), getLostFounds(), getGroupBuys(), getErrands(),
  ])
  trades.value = a.data
  lostFounds.value = b.data
  groupBuys.value = c.data
  errands.value = d.data
}

onMounted(() => loadAll())

const tab = ref('publish')

interface PublishEntry {
  id: string
  apiType: string
  tag: string
  time: string
  title: string
  description: string
  location: string
}

const myPublishes = computed(() => {
  const list: PublishEntry[] = []
  const name = userStore.displayName
  for (const item of trades.value) {
    if (item.publisher === name) {
      list.push({ id: item.id as any as string, apiType: 'trade', tag: '二手', time: item.publishTime, title: item.title, description: item.description, location: item.location })
    }
  }
  for (const item of lostFounds.value) {
    if ((item as any).publisher === name) {
      list.push({ id: item.id as any as string, apiType: 'lostFound', tag: item.type === 'lost' ? '丢失' : '拾到', time: item.eventTime, title: item.title, description: item.description, location: item.location })
    }
  }
  for (const item of groupBuys.value) {
    if (item.publisher === name) {
      list.push({ id: item.id as any as string, apiType: 'groupBuy', tag: '拼单', time: item.deadline, title: item.title, description: item.description, location: item.location })
    }
  }
  for (const item of errands.value) {
    if (item.publisher === name) {
      list.push({ id: item.id as any as string, apiType: 'errand', tag: '跑腿', time: item.deadline, title: item.title, description: item.description, location: item.from + ' → ' + item.to })
    }
  }
  return list.sort((a, b) => b.time.localeCompare(a.time))
})

async function deletePublish(item: PublishEntry) {
  if (!confirm('确定删除该' + item.tag + '信息吗？')) return
  try {
    switch (item.apiType) {
      case 'trade': await deleteTrade(item.id); break
      case 'lostFound': await deleteLostFound(item.id); break
      case 'groupBuy': await deleteGroupBuy(item.id); break
      case 'errand': await deleteErrand(item.id); break
    }
    await loadAll()
  } catch {
    window.alert('删除失败')
  }
}

const myFavorites = computed(() => {
  const list: { time: string; title: string; description: string; tag: string; location: string }[] = []
  for (const item of trades.value) {
    if (favStore.isFav(item.id, 'trade')) {
      list.push({ time: item.publishTime, title: item.title, description: item.description, tag: '二手', location: item.location })
    }
  }
  for (const item of lostFounds.value) {
    if (favStore.isFav(item.id, 'lostFound')) {
      const tag = item.type === 'lost' ? '丢失' : '拾到'
      list.push({ time: item.eventTime, title: item.title, description: item.description, tag, location: item.location })
    }
  }
  for (const item of groupBuys.value) {
    if (favStore.isFav(item.id, 'groupBuy')) {
      list.push({ time: item.deadline, title: item.title, description: item.description, tag: '拼单', location: item.location })
    }
  }
  for (const item of errands.value) {
    if (favStore.isFav(item.id, 'errand')) {
      list.push({ time: item.deadline, title: item.title, description: item.description, tag: '跑腿', location: item.from + ' → ' + item.to })
    }
  }
  return list.sort((a, b) => b.time.localeCompare(a.time))
})

// Profile editing
const editingProfile = ref(false)
const profileForm = ref({ name: '', college: '', grade: '', bio: '' })
const profileSaving = ref(false)

function startEditProfile() {
  const u = userStore.currentUser
  if (!u) return
  profileForm.value = { name: u.name, college: u.college, grade: u.grade, bio: u.bio }
  editingProfile.value = true
}

async function saveProfile() {
  const u = userStore.currentUser
  if (!u || !u.id) return
  profileSaving.value = true
  try {
    const res = await updateUser(String(u.id), profileForm.value)
    userStore.currentUser = res.data
    localStorage.setItem('campus-market-current-user', JSON.stringify(res.data))
    editingProfile.value = false
    window.alert('资料更新成功')
  } catch {
    window.alert('更新失败')
  } finally {
    profileSaving.value = false
  }
}

function cancelEditProfile() {
  editingProfile.value = false
}
</script>

<template>
  <section class="page">
    <div v-if="!userStore.isLoggedIn" class="card" style="text-align:center;padding:60px 20px;">
      <h1>请先登录</h1>
      <p style="color:#6b7280;margin:12px 0 20px;">登录后可以查看个人资料、我的收藏和我的发布。</p>
      <router-link to="/login" class="go-login">去登录</router-link>
    </div>

    <template v-else>
      <div class="page-header">
        <h1>个人中心</h1>
      </div>

      <div class="user-card card">
        <div class="user-avatar">{{ userStore.currentUser?.avatar || '👤' }}</div>
        <div class="user-info">
          <template v-if="editingProfile">
            <FormField label="显示名称">
              <input v-model="profileForm.name" type="text" placeholder="显示名称" />
            </FormField>
            <FormField label="学院">
              <input v-model="profileForm.college" type="text" placeholder="学院" />
            </FormField>
            <FormField label="年级">
              <input v-model="profileForm.grade" type="text" placeholder="年级" />
            </FormField>
            <FormField label="个人简介">
              <textarea v-model="profileForm.bio" rows="2" placeholder="个人简介"></textarea>
            </FormField>
            <div class="profile-actions">
              <button class="primary" :disabled="profileSaving" @click="saveProfile">{{ profileSaving ? '保存中...' : '保存' }}</button>
              <button class="secondary" @click="cancelEditProfile">取消</button>
            </div>
          </template>
          <template v-else>
            <h2 class="user-name">{{ userStore.displayName }}</h2>
            <p class="user-meta">{{ userStore.userDescription }}</p>
            <p v-if="userStore.currentUser?.bio" class="user-bio">{{ userStore.currentUser.bio }}</p>
            <button class="edit-profile-btn" @click="startEditProfile">编辑资料</button>
          </template>
        </div>
      </div>

      <div class="card">
        <div class="stats-row">
          <div class="stat-box">
            <div class="stat-num">{{ myPublishes.length }}</div>
            <div class="stat-lbl">发布总数</div>
          </div>
          <div class="stat-box">
            <div class="stat-num">{{ favStore.favCount }}</div>
            <div class="stat-lbl">收藏</div>
          </div>
        </div>
      </div>

      <div class="card tabs">
        <button class="tab-btn" :class="{ active: tab === 'publish' }" @click="tab = 'publish'">我的发布</button>
        <button class="tab-btn" :class="{ active: tab === 'fav' }" @click="tab = 'fav'">我的收藏</button>
      </div>

      <template v-if="tab === 'publish'">
        <EmptyState v-if="myPublishes.length === 0" text="还没有发布过内容" />
        <div v-else class="list">
          <ItemCard
            v-for="(item, i) in myPublishes" :key="i"
            :title="item.title"
            :description="item.description"
            :tag="item.tag"
            :location="item.location"
            :time="item.time"
          >
            <template #footer>
              <button class="act-btn" @click="router.push('/publish?edit=' + item.apiType + '&id=' + item.id)">编辑</button>
              <button class="act-btn" @click="deletePublish(item)">删除</button>
            </template>
          </ItemCard>
        </div>
      </template>

      <template v-else>
        <EmptyState v-if="myFavorites.length === 0" text="还没有收藏过内容" />
        <div v-else class="list">
          <ItemCard
            v-for="(item, i) in myFavorites" :key="i"
            :title="item.title"
            :description="item.description"
            :tag="item.tag"
            :location="item.location"
            :time="item.time"
          />
        </div>
      </template>
    </template>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }
.page-header { padding: 24px; border-radius: var(--radius); background: #fff; border-left: 4px solid var(--primary); }
.page-header h1 { margin: 0; font-size: 22px; }
.user-card { display: flex; align-items: center; gap: 18px; padding: 24px; border-radius: var(--radius); background: #fff; box-shadow: var(--shadow); border: 1px solid var(--border); }
.user-avatar { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-light), #dbeafe); display: flex; align-items: center; justify-content: center; font-size: 30px; flex-shrink: 0; border: 3px solid var(--primary); }
.user-name { font-size: 20px; font-weight: 700; }
.user-meta { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }
.user-bio { font-size: 13px; color: var(--text-secondary); margin-top: 6px; font-style: italic; }
.stats-row { display: flex; gap: 24px; }
.stat-box { flex: 1; text-align: center; }
.stat-num { font-size: 28px; font-weight: 800; color: var(--primary); }
.stat-lbl { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }
.tabs { display: flex; gap: 8px; }
.tab-btn { padding: 9px 22px; border-radius: var(--radius-sm); border: none; background: #f1f5f9; color: var(--text-secondary); font-size: 14px; font-weight: 500; cursor: pointer; transition: all .2s; }
.tab-btn:hover { background: #e2e8f0; }
.tab-btn.active { background: var(--primary-gradient); color: #fff; box-shadow: 0 4px 12px rgba(79,140,247,0.3); }
.list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.go-login { display: inline-block; padding: 11px 28px; border-radius: var(--radius-sm); background: var(--primary-gradient); color: #fff; text-decoration: none; font-size: 15px; font-weight: 600; box-shadow: 0 4px 14px rgba(79,140,247,0.3); }
.edit-profile-btn { margin-top: 8px; border: none; background: none; padding: 0; font-family: inherit; font-size: 13px; color: var(--primary); cursor: pointer; font-weight: 600; }
.profile-actions { display: flex; gap: 8px; margin-top: 4px; }
.profile-actions .primary { border: none; border-radius: var(--radius-sm); padding: 9px 18px; cursor: pointer; background: var(--primary-gradient); color: #fff; font-size: 13px; font-weight: 600; }
.profile-actions .secondary { border: none; border-radius: var(--radius-sm); padding: 9px 18px; cursor: pointer; background: #f1f5f9; color: var(--text); font-size: 13px; border: 1px solid var(--border); }
.act-btn { cursor: pointer; border: none; background: none; padding: 0; font-family: inherit; font-size: 13px; color: var(--danger); font-weight: 600; transition: all .2s; }
.act-btn:hover { opacity: 0.7; }
</style>
