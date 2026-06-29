import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getTrades } from '@/api/trade'
import { getLostFounds } from '@/api/lostFound'
import { getGroupBuys } from '@/api/groupBuy'
import { getErrands } from '@/api/errand'
import type { TradeItem } from '@/api/trade'
import type { LostFoundItem } from '@/api/lostFound'
import type { GroupBuyItem } from '@/api/groupBuy'
import type { ErrandItem } from '@/api/errand'

export interface Goods {
  id: number
  title: string
  price: number
  description?: string
  category?: string
  type: 'trade' | 'lost' | 'group' | 'errand'
  status?: string
  location?: string
  contact?: string
  time?: string
  reward?: number
  people?: number
  maxPeople?: number
  image?: string
}

function toGoods(trade: TradeItem): Goods {
  return {
    id: trade.id, title: trade.title, price: trade.price,
    description: trade.description, category: trade.category,
    type: 'trade',
    status: trade.status === 'open' ? '在售' : trade.status === 'closed' ? '已下架' : '已售出',
    location: trade.location, contact: trade.publisher,
    time: trade.publishTime, image: trade.image || undefined,
  }
}

function toGoodsFromLost(item: LostFoundItem): Goods {
  return {
    id: item.id, title: item.title, price: 0,
    description: item.description, category: item.itemName,
    type: 'lost', status: item.type === 'lost' ? '丢失' : '拾到',
    location: item.location, contact: item.contact, time: item.eventTime,
  }
}

function toGoodsFromGroup(item: GroupBuyItem): Goods {
  return {
    id: item.id, title: item.title, price: 0,
    description: item.description, category: item.type,
    type: 'group',
    status: item.status === 'open' ? '进行中' : item.status === 'closed' ? '已截止' : '已完成',
    location: item.location, contact: item.publisher,
    people: item.currentCount, maxPeople: item.targetCount,
  }
}

function toGoodsFromErrand(item: ErrandItem): Goods {
  return {
    id: item.id, title: item.title, price: 0,
    description: item.description, category: item.taskType,
    type: 'errand',
    status: item.status === 'open' ? '进行中' : item.status === 'closed' ? '已截止' : '已完成',
    location: `${item.from} → ${item.to}`, contact: item.publisher,
    reward: item.reward,
  }
}

export const useMarketStore = defineStore('market', () => {
  const goodsList = ref<Goods[]>([])
  const loading = ref(false)

  const favIds = ref<number[]>([])
  const cartIds = ref<number[]>([])

  const tradeList = computed(() => goodsList.value.filter(g => g.type === 'trade'))
  const lostList = computed(() => goodsList.value.filter(g => g.type === 'lost'))
  const groupList = computed(() => goodsList.value.filter(g => g.type === 'group'))
  const errandList = computed(() => goodsList.value.filter(g => g.type === 'errand'))
  const favList = computed(() => goodsList.value.filter(g => favIds.value.includes(g.id)))

  async function loadAll() {
    loading.value = true
    try {
      const { data: trades } = await getTrades()
      const { data: lostFounds } = await getLostFounds()
      const { data: groupBuys } = await getGroupBuys()
      const { data: errands } = await getErrands()
      goodsList.value = [
        ...trades.map(toGoods),
        ...lostFounds.map(toGoodsFromLost),
        ...groupBuys.map(toGoodsFromGroup),
        ...errands.map(toGoodsFromErrand),
      ]
    } catch (e) {
      console.error('Failed to load data:', e)
    } finally {
      loading.value = false
    }
  }

  function getGoodsById(id: number) { return goodsList.value.find(g => g.id === id) }
  function toggleFav(id: number) {
    const i = favIds.value.indexOf(id)
    if (i === -1) { favIds.value.push(id) } else { favIds.value.splice(i, 1) }
  }
  function isFav(id: number) { return favIds.value.includes(id) }
  function addToCart(id: number) { if (!cartIds.value.includes(id)) cartIds.value.push(id) }
  function removeFromCart(id: number) { const i = cartIds.value.indexOf(id); if (i !== -1) cartIds.value.splice(i, 1) }
  function isInCart(id: number) { return cartIds.value.includes(id) }

  return {
    goodsList, loading, favIds, cartIds,
    tradeList, lostList, groupList, errandList, favList,
    loadAll, getGoodsById, toggleFav, isFav, addToCart, removeFromCart, isInCart,
  }
})
