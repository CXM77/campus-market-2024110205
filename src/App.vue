<script setup lang="ts">
import { onMounted } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  userStore.restoreLogin()
})
</script>

<template>
  <AppLayout>
    <router-view />
  </AppLayout>
</template>

<style>
:root {
  --primary: #416db9;
  --primary-light: #eff6ff;
  --primary-dark: #4978df;
  --primary-gradient: linear-gradient(135deg, #4f8cf7, #667eea);
  --danger: #ef4444;
  --success: #10b981;
  --warning: #f59e0b;
  --bg: #f7f7f1;
  --card-bg: #fff;
  --text: #1e293b;
  --text-secondary: #64748b;
  --border: #e2e8f0;
  --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-hover: 0 10px 25px rgba(79,140,247,0.12), 0 4px 10px rgba(0,0,0,0.06);
  --radius: 12px;
  --radius-sm: 8px;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  background: var(--bg); color: var(--text); min-height: 100vh;
  line-height: 1.6;
}
.card {
  background: var(--card-bg); border-radius: var(--radius);
  box-shadow: var(--shadow); padding: 20px; border: 1px solid var(--border);
}
.card-hover { cursor: pointer; transition: all .25s ease; }
.card-hover:hover { box-shadow: var(--shadow-hover); transform: translateY(-3px); }
.tag {
  display: inline-block; padding: 3px 12px; border-radius: 999px;
  font-size: 12px; font-weight: 600; letter-spacing: 0.3px;
}
.tag-blue { background: var(--primary-light); color: var(--primary); }
.tag-green { background: #ecfdf5; color: var(--success); }
.tag-yellow { background: #fffbeb; color: var(--warning); }
.tag-red { background: #fef2f2; color: var(--danger); }
.tag-gray { background: #f1f5f9; color: var(--text-secondary); }
.btn {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 9px 22px; border-radius: var(--radius-sm); border: none;
  font-size: 14px; font-weight: 600; cursor: pointer;
  transition: all .25s ease; text-decoration: none;
}
.btn-primary { background: var(--primary-gradient); color: #fff; box-shadow: 0 4px 14px rgba(79,140,247,0.3); }
.btn-primary:hover { box-shadow: 0 6px 20px rgba(79,140,247,0.4); transform: translateY(-1px); }
.btn-outline { background: transparent; color: var(--primary); border: 2px solid var(--primary); }
.btn-outline:hover { background: var(--primary-light); border-color: var(--primary-dark); }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 768px) {
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
}
.flex { display: flex; }
.flex-center { align-items: center; }
.gap-8 { gap: 8px; }
.gap-12 { gap: 12px; }
.gap-16 { gap: 16px; }
.mt-16 { margin-top: 16px; }
.mt-24 { margin-top: 24px; }
.mb-16 { margin-bottom: 16px; }
.text-secondary { color: var(--text-secondary); font-size: 13px; }
.price { color: var(--danger); font-weight: 700; font-size: 18px; }
.page-title { font-size: 22px; font-weight: 700; margin-bottom: 20px; }
</style>
