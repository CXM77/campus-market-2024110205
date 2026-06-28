<script setup lang="ts">
import AppHeader from './AppHeader.vue'
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-layout { min-height: 100vh; display: flex; flex-direction: column; }
.main-content { max-width: 1200px; margin: 24px auto; padding: 0 24px 60px; width: 100%; }
</style>
