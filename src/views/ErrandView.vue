<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import LoadingState from '@/components/LoadingState.vue'
import SearchBar from '@/components/SearchBar.vue'
import { getErrands, deleteErrand, type ErrandItem } from '@/api/errand'
import { useFavoriteStore } from '@/stores/favorite'
import { useUserStore } from '@/stores/user'

const favStore = useFavoriteStore()
const userStore = useUserStore()

const items = ref<ErrandItem[]>([])
const loading = ref(false)
const error = ref(false)
const keyword = ref('')

const filteredItems = computed(() => {
  const value = keyword.value.trim()
  if (!value) return items.value
  return items.value.filter((item) =>
    item.title.includes(value) ||
    item.taskType.includes(value) ||
    item.from.includes(value) ||
    item.to.includes(value) ||
    item.description.includes(value)
  )
})

async function loadItems() {
  loading.value = true
  error.value = false
  try {
    const res = await getErrands()
    items.value = res.data
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

async function deleteItem(id: number | string) {
  if (!confirm('确定删除该跑腿委托吗？')) return
  try {
    await deleteErrand(id)
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
      <h1>跑腿委托</h1>
      <p>发布或接取跑腿任务，互帮互助让校园生活更便利。</p>
    </div>

    <SearchBar v-model="keyword" placeholder="搜索标题、任务类型、地点或描述" />

    <LoadingState v-if="loading" text="正在加载跑腿任务..." />

    <ErrorState v-else-if="error" message="跑腿数据加载失败，请检查 Mock 服务是否正常运行。" show-retry @retry="loadItems" />

    <EmptyState v-else-if="filteredItems.length === 0" :text="keyword ? '暂无符合条件的搜索结果' : '暂无跑腿任务'" />

    <div v-else class="list">
      <ItemCard
        v-for="item in filteredItems"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.taskType"
        :location="`${item.from} → ${item.to}`"
        :time="item.deadline"
      >
        <template #footer>
          <strong>￥{{ item.reward }}</strong>
          <span class="publisher">{{ item.publisher }}</span>
          <template v-if="item.publisher === userStore.displayName">
            <button class="act-btn" @click="$router.push('/publish?edit=errand&id=' + item.id)">编辑</button>
            <button class="act-btn" @click="deleteItem(item.id)">删除</button>
          </template>
          <button class="fav-btn" @click="favStore.toggleFav(item.id, 'errand')">收藏：{{ favStore.isFav(item.id, 'errand') ? '★' : '☆' }}</button>
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
.publisher { color: var(--text-secondary); font-size: 13px; }
.fav-btn { cursor: pointer; font-size: 13px; margin-left: auto; user-select: none; border: none; background: none; padding: 0; font-family: inherit; color: var(--primary); transition: all .2s; }
.fav-btn:hover { opacity: 0.7; }
.act-btn { cursor: pointer; border: none; background: none; padding: 0; font-family: inherit; font-size: 13px; color: var(--danger); transition: all .2s; }
.act-btn:hover { opacity: 0.7; }
</style>
