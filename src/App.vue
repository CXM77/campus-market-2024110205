<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <router-view />
  </AppLayout>
</template>

<style>
:root {
  --primary: #4a90d9;
  --primary-light: #ebf5ff;
  --primary-dark: #3570b0;
  --bg: #f0f2f5;
  --card-bg: #fff;
  --text: #1a1a2e;
  --text-secondary: #6b7280;
  --border: #e5e7eb;
  --shadow: 0 2px 8px rgba(0,0,0,0.06);
  --radius: 10px;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  background: var(--bg); color: var(--text); min-height: 100vh;
}
.card {
  background: var(--card-bg); border-radius: var(--radius);
  box-shadow: var(--shadow); padding: 20px; border: 1px solid var(--border);
}
.card-hover { cursor: pointer; transition: all .2s; }
.card-hover:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); transform: translateY(-2px); }
.tag {
  display: inline-block; padding: 2px 10px; border-radius: 4px;
  font-size: 12px; font-weight: 500;
}
.tag-blue { background: var(--primary-light); color: var(--primary); }
.tag-green { background: #ecfdf5; color: #059669; }
.tag-yellow { background: #fffbeb; color: #d97706; }
.tag-red { background: #fef2f2; color: #dc2626; }
.tag-gray { background: #f3f4f6; color: #6b7280; }
.btn {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 8px 20px; border-radius: 8px; border: none;
  font-size: 14px; cursor: pointer; transition: all .2s; text-decoration: none;
}
.btn-primary { background: var(--primary); color: #fff; }
.btn-primary:hover { background: var(--primary-dark); }
.btn-outline { background: transparent; color: var(--primary); border: 1px solid var(--primary); }
.btn-outline:hover { background: var(--primary-light); }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.flex { display: flex; }
.flex-center { align-items: center; }
.gap-8 { gap: 8px; }
.gap-12 { gap: 12px; }
.gap-16 { gap: 16px; }
.mt-16 { margin-top: 16px; }
.mt-24 { margin-top: 24px; }
.mb-16 { margin-bottom: 16px; }
.text-secondary { color: var(--text-secondary); font-size: 13px; }
.price { color: #e74c3c; font-weight: 700; font-size: 18px; }
.page-title { font-size: 22px; font-weight: 700; margin-bottom: 20px; }
</style>
