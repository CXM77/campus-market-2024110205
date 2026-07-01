import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const username = ref('校园用户')
  const studentId = ref('2024001')
  const college = ref('计算机学院')
  const grade = ref('2024级')
  const avatar = ref('👤')
  const isLoggedIn = ref(true)

  const displayName = computed(() => `${college.value} ${username.value}`)

  function setUser(u: { username: string; college: string; grade: string }) {
    username.value = u.username
    college.value = u.college
    grade.value = u.grade
  }

  function logout() {
    isLoggedIn.value = false
  }

  return {
    username, studentId, college, grade, avatar, isLoggedIn,
    displayName, setUser, logout,
  }
})
