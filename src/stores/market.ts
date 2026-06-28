import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

export const useMarketStore = defineStore('market', () => {
  const goodsList = ref<Goods[]>([
    { id: 1, title: '二手高数课本', price: 12, category: '教材', type: 'trade', description: '九成新，有笔记标注', status: '在售', location: '东校区', image: 'https://picsum.photos/seed/book/400/300' },
    { id: 2, title: '校园电动车', price: 580, category: '出行', type: 'trade', description: '骑了半年，续航还不错', status: '在售', location: '西校区', image: 'https://picsum.photos/seed/bike/400/300' },
    { id: 3, title: '无线耳机', price: 75, category: '数码', type: 'trade', description: '音质良好，充电仓完好', status: '在售', location: '南校区', image: 'https://picsum.photos/seed/earphone/400/300' },
    { id: 4, title: '拾到校园卡一张', price: 0, type: 'lost', description: '在图书馆三楼拾到，请失主联系', status: '拾到', location: '图书馆', contact: '138****5678', time: '2026-06-27' },
    { id: 5, title: '丢失黑色耳机盒', price: 0, type: 'lost', description: '西门打印店附近丢失，内含耳机', status: '丢失', location: '西门打印店', time: '2026-06-26' },
    { id: 6, title: '东区食堂三楼拼奶茶', price: 15, type: 'group', description: '一点点奶茶，还差2人', status: '进行中', location: '东区食堂', people: 2, maxPeople: 4 },
    { id: 7, title: '周五晚拼车去高铁站', price: 20, type: 'group', description: '周五晚上7点出发，分摊车费', status: '进行中', location: '南大门', people: 1, maxPeople: 3 },
    { id: 8, title: '求帮取快递到6栋', price: 0, type: 'errand', description: '快递在菜鸟驿站，送到6栋宿舍', reward: 5, status: '进行中', location: '菜鸟驿站→6栋' },
    { id: 9, title: '代买午餐到实验室', price: 0, type: 'errand', description: '东二食堂打包一份红烧肉饭到计算机楼', reward: 3, status: '进行中', location: '东二食堂→计算机楼' },
  ])

  const favIds = ref<number[]>([])
  const cartIds = ref<number[]>([])

  const tradeList = computed(() => goodsList.value.filter(g => g.type === 'trade'))
  const lostList = computed(() => goodsList.value.filter(g => g.type === 'lost'))
  const groupList = computed(() => goodsList.value.filter(g => g.type === 'group'))
  const errandList = computed(() => goodsList.value.filter(g => g.type === 'errand'))
  const favList = computed(() => goodsList.value.filter(g => favIds.value.includes(g.id)))

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
    goodsList, favIds, cartIds,
    tradeList, lostList, groupList, errandList, favList,
    getGoodsById, toggleFav, isFav, addToCart, removeFromCart, isInCart,
  }
})
