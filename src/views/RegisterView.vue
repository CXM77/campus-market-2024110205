<template>
  <section class="auth-page">
    <div class="auth-card">
      <h1>注册</h1>

      <form class="auth-form" @submit.prevent="handleRegister">
        <FormField label="用户名" required :error="errors.username">
          <input v-model.trim="form.username" type="text" placeholder="请输入用户名" />
        </FormField>

        <FormField label="密码" required :error="errors.password">
          <input v-model.trim="form.password" type="password" placeholder="请输入密码" />
        </FormField>

        <FormField label="姓名" required :error="errors.name">
          <input v-model.trim="form.name" type="text" placeholder="请输入显示名称" />
        </FormField>

        <FormField label="学院" required :error="errors.college">
          <input v-model.trim="form.college" type="text" placeholder="例如：计算机学院" />
        </FormField>

        <FormField label="年级" required :error="errors.grade">
          <input v-model.trim="form.grade" type="text" placeholder="例如：2023级" />
        </FormField>

        <button class="primary" type="submit" :disabled="submitting">
          {{ submitting ? '注册中...' : '注册' }}
        </button>
      </form>

      <p class="switch">
        已有账号？
        <RouterLink to="/login">去登录</RouterLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import { createUser, getUsers } from '@/api/user'

const router = useRouter()
const submitting = ref(false)

const form = reactive({
  username: '',
  password: '',
  name: '',
  college: '',
  grade: '',
})

const errors = reactive<Record<string, string>>({})

function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

function validateForm() {
  clearErrors()
  if (!form.username) errors.username = '请输入用户名'
  if (!form.password) errors.password = '请输入密码'
  else if (form.password.length < 6) errors.password = '密码长度不能少于 6 位'
  if (!form.name) errors.name = '请输入姓名'
  if (!form.college) errors.college = '请输入学院'
  if (!form.grade) errors.grade = '请输入年级'
  return Object.values(errors).every((message) => !message)
}

async function handleRegister() {
  if (!validateForm()) return
  submitting.value = true
  try {
    const res = await getUsers()
    if (res.data.some((user) => user.username === form.username)) {
      errors.username = '用户名已存在'
      return
    }
    await createUser({
      username: form.username,
      password: form.password,
      name: form.name,
      college: form.college,
      grade: form.grade,
      avatar: '',
      bio: '这个同学还没有填写个人简介。',
    })
    window.alert('注册成功，请登录')
    router.push('/login')
  } catch {
    window.alert('注册失败，请检查 Mock 服务是否正常运行')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.auth-page { min-height: calc(100vh - 64px); display: grid; place-items: center; background: linear-gradient(135deg, #eff6ff 0%, #f5f7fa 100%); }
.auth-card { width: 400px; padding: 36px 32px 32px; border-radius: var(--radius); background: #fff; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border-top: 4px solid var(--primary); }
.auth-card h1 { margin: 0 0 24px; text-align: center; font-size: 24px; color: var(--text); }
.auth-form { display: grid; gap: 16px; }
input { width: 100%; box-sizing: border-box; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 11px 14px; font-size: 14px; outline: none; transition: all .25s ease; }
input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(79,140,247,0.15); }
.primary { border: none; border-radius: var(--radius-sm); padding: 12px 16px; cursor: pointer; background: var(--primary-gradient); color: #fff; font-size: 15px; font-weight: 600; box-shadow: 0 4px 14px rgba(79,140,247,0.3); transition: all .25s ease; }
.primary:hover { box-shadow: 0 6px 20px rgba(79,140,247,0.4); transform: translateY(-1px); }
.primary:disabled { cursor: not-allowed; opacity: 0.7; transform: none; }
.switch { margin: 20px 0 0; text-align: center; color: var(--text-secondary); font-size: 14px; }
.switch a { color: var(--primary); text-decoration: none; font-weight: 600; }
</style>
