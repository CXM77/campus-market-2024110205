<template>
  <div>
    <nav>
      <router-link to="/home">首页</router-link>
      <router-link to="/list">列表页</router-link>
      <router-link to="/publish">发布页</router-link>
      <router-link to="/message">消息页</router-link>
      <router-link to="/profile">个人中心</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, "Microsoft YaHei", sans-serif; color: #333; padding: 20px; }
nav { display: flex; gap: 12px; margin-bottom: 24px; }
nav a { text-decoration: none; color: #333; padding: 6px 14px; border-radius: 6px; }
nav a:hover { background: #f0f0f0; }
nav a.router-link-active { background: #333; color: #fff; }
</style>
