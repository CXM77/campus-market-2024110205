<template>
  <section class="auth-page">
    <div class="auth-card">
      <h1>登录</h1>

      <form class="auth-form" @submit.prevent="handleLogin">
        <FormField label="用户名" required :error="errors.username">
          <input v-model.trim="form.username" type="text" placeholder="请输入用户名" />
        </FormField>

        <FormField label="密码" required :error="errors.password">
          <input v-model.trim="form.password" type="password" placeholder="请输入密码" />
        </FormField>

        <p v-if="loginError" class="login-error">{{ loginError }}</p>

        <button class="primary" type="submit" :disabled="submitting">
          {{ submitting ? '登录中...' : '登录' }}
        </button>
      </form>

      <p class="switch">
        还没有账号？
        <RouterLink to="/register">去注册</RouterLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormField from '@/components/FormField.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const submitting = ref(false)
const loginError = ref('')

const form = reactive({
  username: '',
  password: '',
})

const errors = reactive<Record<string, string>>({})

function clearErrors() {
  Object.keys(errors).forEach((key) => { errors[key] = '' })
  loginError.value = ''
}

function validateForm() {
  clearErrors()
  if (!form.username) errors.username = '请输入用户名'
  if (!form.password) errors.password = '请输入密码'
  return Object.values(errors).every((message) => !message)
}

async function handleLogin() {
  if (!validateForm()) return
  submitting.value = true
  try {
    await userStore.login(form.username, form.password)
    window.alert('登录成功')
    router.push('/user')
  } catch {
    loginError.value = '账号或密码错误'
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
.login-error { margin: 0; color: var(--danger); font-size: 14px; font-weight: 500; }
.primary { border: none; border-radius: var(--radius-sm); padding: 12px 16px; cursor: pointer; background: var(--primary-gradient); color: #fff; font-size: 15px; font-weight: 600; box-shadow: 0 4px 14px rgba(79,140,247,0.3); transition: all .25s ease; }
.primary:hover { box-shadow: 0 6px 20px rgba(79,140,247,0.4); transform: translateY(-1px); }
.primary:disabled { cursor: not-allowed; opacity: 0.7; transform: none; }
.switch { margin: 20px 0 0; text-align: center; color: var(--text-secondary); font-size: 14px; }
.switch a { color: var(--primary); text-decoration: none; font-weight: 600; }
</style>
