<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import LoadingState from '@/components/LoadingState.vue'
import SearchBar from '@/components/SearchBar.vue'
import { getGroupBuys, deleteGroupBuy, type GroupBuyItem } from '@/api/groupBuy'
import { useFavoriteStore } from '@/stores/favorite'
import { useUserStore } from '@/stores/user'

const favStore = useFavoriteStore()
const userStore = useUserStore()

const items = ref<GroupBuyItem[]>([])
const loading = ref(false)
const error = ref(false)
const keyword = ref('')

const filteredItems = computed(() => {
  const value = keyword.value.trim()
  if (!value) return items.value
  return items.value.filter((item) =>
    item.title.includes(value) ||
    item.type.includes(value) ||
    item.location.includes(value) ||
    item.description.includes(value) ||
    item.contact.includes(value)
  )
})

function formatContact(contact: string): string {
  const prefixes = ['手机:', '手机：', '微信:', '微信：', 'QQ:', 'QQ：', '站内消息', '站外消息']
  if (prefixes.some(p => contact.startsWith(p))) return contact
  if (/^\d{7,15}$/.test(contact)) return '手机: ' + contact
  return contact
}

async function loadItems() {
  loading.value = true
  error.value = false
  try {
    const res = await getGroupBuys()
    items.value = res.data
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

async function deleteItem(id: number | string) {
  if (!confirm('确定删除该拼单吗？')) return
  try {
    await deleteGroupBuy(id)
    await loadItems()
  } catch {
    window.alert('删除失败')
  }
}

onMounted(() => {
  loadItems()
})
</script>

<template>
  <section class="page">
    <div class="page-header">
      <h1>拼单搭子</h1>
      <p>寻找志同道合的伙伴，一起拼单省钱、共享快乐。</p>
    </div>

    <SearchBar v-model="keyword" placeholder="搜索标题、类型、地点或描述" />

    <LoadingState v-if="loading" text="正在加载拼单信息..." />

    <ErrorState v-else-if="error" message="拼单数据加载失败，请检查 Mock 服务是否正常运行。" show-retry @retry="loadItems" />

    <EmptyState v-else-if="filteredItems.length === 0" :text="keyword ? '暂无符合条件的搜索结果' : '暂无拼单信息'" />

    <div v-else class="list">
      <ItemCard
        v-for="item in filteredItems"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.type"
        :location="item.location"
        :time="item.deadline"
      >
        <template #footer>
          <span>已报 {{ item.currentCount }} / {{ item.targetCount }} 人</span>
          <span :class="item.status === 'open' ? 'status-open' : 'status-done'">
            {{ item.status === 'open' ? '进行中' : item.status === 'closed' ? '已截止' : '已完成' }}
          </span>
          <span class="contact">{{ formatContact(item.contact) }}</span>
          <template v-if="item.publisher === userStore.displayName">
            <button class="act-btn" @click="$router.push('/publish?edit=groupBuy&id=' + item.id)">编辑</button>
            <button class="act-btn" @click="deleteItem(item.id)">删除</button>
          </template>
          <button class="fav-btn" @click="favStore.toggleFav(item.id, 'groupBuy')">收藏：{{ favStore.isFav(item.id, 'groupBuy') ? '★' : '☆' }}</button>
        </template>
      </ItemCard>
    </div>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 20px; }
.page-header { padding: 24px; border-radius: var(--radius); background: #fff; border-left: 4px solid var(--primary); }
.page-header h1 { margin: 0 0 8px; font-size: 22px; }
.page-header p { margin: 0; color: var(--text-secondary); font-size: 14px; }
.list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.status-open { color: var(--success); font-weight: 600; }
.status-done { color: var(--text-secondary); }
.contact { color: var(--primary); font-size: 13px; }
.fav-btn { cursor: pointer; font-size: 13px; margin-left: auto; user-select: none; border: none; background: none; padding: 0; font-family: inherit; color: var(--primary); transition: all .2s; }
.fav-btn:hover { opacity: 0.7; }
.act-btn { cursor: pointer; border: none; background: none; padding: 0; font-family: inherit; font-size: 13px; color: var(--danger); transition: all .2s; }
.act-btn:hover { opacity: 0.7; }
</style>
