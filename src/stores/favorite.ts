import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'campus-favorites'

export const useFavoriteStore = defineStore('favorite', () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  const favoriteIds = ref<string[]>(saved ? JSON.parse(saved) : [])

  const favCount = computed(() => favoriteIds.value.length)

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds.value))
  }

  function key(id: string | number, type: string) {
    return type + '-' + id
  }

  function isFav(id: string | number, type: string) {
    return favoriteIds.value.includes(key(id, type))
  }

  function toggleFav(id: string | number, type: string) {
    const k = key(id, type)
    const i = favoriteIds.value.indexOf(k)
    if (i === -1) {
      favoriteIds.value.push(k)
    } else {
      favoriteIds.value.splice(i, 1)
    }
    save()
  }

  function addFav(id: string | number, type: string) {
    const k = key(id, type)
    if (!favoriteIds.value.includes(k)) {
      favoriteIds.value.push(k)
      save()
    }
  }

  function removeFav(id: string | number, type: string) {
    const k = key(id, type)
    const i = favoriteIds.value.indexOf(k)
    if (i !== -1) {
      favoriteIds.value.splice(i, 1)
      save()
    }
  }

  return { favoriteIds, favCount, isFav, toggleFav, addFav, removeFav }
})
