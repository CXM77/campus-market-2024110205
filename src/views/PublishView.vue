<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMarketStore } from '@/stores/market'

const store = useMarketStore()
const router = useRouter()
const title = ref('')
const price = ref(0)
const category = ref(store.categories[0])
const description = ref('')

function submit() {
  if (!title.value || price.value <= 0) return alert('请填写完整信息')
  store.publishGoods({ title: title.value, price: price.value, category: category.value, description: description.value })
  alert('发布成功')
  router.push('/list')
}
</script>

<template>
  <div>
    <h1>发布页</h1>
    <form @submit.prevent="submit" class="form">
      <label>标题 <input v-model="title" /></label>
      <label>价格 <input v-model.number="price" type="number" min="0" /></label>
      <label>分类
        <select v-model="category">
          <option v-for="c in store.categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>
      <label>描述 <textarea v-model="description" rows="3"></textarea></label>
      <button type="submit">发布</button>
    </form>
  </div>
</template>

<style scoped>
.form { display: flex; flex-direction: column; gap: 14px; max-width: 400px; margin-top: 16px; }
.form label { display: flex; flex-direction: column; gap: 4px; font-size: 14px; }
.form input, .form select, .form textarea { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.form button { padding: 10px; background: #333; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
</style>
