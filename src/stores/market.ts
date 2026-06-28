import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Goods {
  id: number
  title: string
  price: number
  description?: string
  category?: string
}

export interface Order {
  id: number
  goodsId: number
  status: 'pending' | 'done'
  createdAt: string
}

export interface Message {
  id: number
  text: string
  from: string
  time: string
  read: boolean
}

export const useMarketStore = defineStore('market', () => {
  const goodsList = ref<Goods[]>([
    { id: 1, title: '二手高数课本', price: 12, category: '教材', description: '九成新，有笔记标注' },
    { id: 2, title: '校园电动车', price: 580, category: '出行', description: '骑了半年，续航还不错' },
    { id: 3, title: '无线耳机', price: 75, category: '数码', description: '音质良好，充电仓完好' },
  ])

  const categories = ['教材', '出行', '数码'] as const
  const favIds = ref<number[]>([])
  const cartIds = ref<number[]>([])
  const orders = ref<Order[]>([])
  const messages = ref<Message[]>([
    { id: 1, text: '你好，请问高数课本还在吗？', from: '张三', time: '10:30', read: false },
    { id: 2, text: '电动车可以小刀吗？', from: '李四', time: '昨天', read: false },
    { id: 3, text: '耳机已出，勿念', from: '系统', time: '前天', read: true },
  ])
  const nextGoodsId = ref(4)
  const nextOrderId = ref(1)
  const nextMsgId = ref(4)

  const favList = computed(() => goodsList.value.filter(g => favIds.value.includes(g.id)))
  const cartList = computed(() => goodsList.value.filter(g => cartIds.value.includes(g.id)))
  const orderList = computed(() =>
    orders.value.map(o => ({ ...o, goods: getGoodsById(o.goodsId) }))
  )
  const unreadCount = computed(() => messages.value.filter(m => !m.read).length)

  const boardStats = computed(() => ({
    total: goodsList.value.length,
    fav: favIds.value.length,
    cart: cartIds.value.length,
    order: orders.value.length,
    unread: unreadCount.value,
  }))

  function getGoodsById(id: number) { return goodsList.value.find(g => g.id === id) }

  function toggleFav(id: number) {
    const i = favIds.value.indexOf(id)
    if (i === -1) {
      favIds.value.push(id)
    } else {
      favIds.value.splice(i, 1)
    }
  }
  function isFav(id: number) { return favIds.value.includes(id) }

  function addToCart(id: number) { if (!cartIds.value.includes(id)) cartIds.value.push(id) }
  function removeFromCart(id: number) {
    const i = cartIds.value.indexOf(id); if (i !== -1) cartIds.value.splice(i, 1)
  }
  function isInCart(id: number) { return cartIds.value.includes(id) }

  function publishGoods(g: Omit<Goods, 'id'>) {
    const id = nextGoodsId.value++; goodsList.value.push({ ...g, id }); return id
  }

  function createOrder(goodsId: number) {
    const id = nextOrderId.value++
    orders.value.push({ id, goodsId, status: 'pending', createdAt: new Date().toLocaleDateString() })
    removeFromCart(goodsId)
    return id
  }
  function doneOrder(orderId: number) {
    const o = orders.value.find(x => x.id === orderId); if (o) o.status = 'done'
  }

  function searchGoods(keyword: string) {
    if (!keyword.trim()) return goodsList.value
    const kw = keyword.toLowerCase()
    return goodsList.value.filter(
      g => g.title.toLowerCase().includes(kw) || (g.category?.toLowerCase().includes(kw))
    )
  }

  function addMessage(text: string, from: string) {
    const id = nextMsgId.value++
    messages.value.unshift({ id, text, from, time: '刚刚', read: false })
  }
  function markRead(id: number) {
    const m = messages.value.find(x => x.id === id); if (m) m.read = true
  }

  return {
    goodsList, categories, favIds, cartIds, orders, messages,
    favList, cartList, orderList, unreadCount, boardStats,
    getGoodsById, toggleFav, isFav,
    addToCart, removeFromCart, isInCart,
    publishGoods, createOrder, doneOrder, searchGoods,
    addMessage, markRead,
  }
})
