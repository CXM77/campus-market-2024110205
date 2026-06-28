<template>
  <div>
    <h1>看板页</h1>
    <div class="grid">
      <div class="card"><span>商品总数</span><strong>12</strong></div>
      <div class="card"><span>今日访客</span><strong>86</strong></div>
      <div class="card"><span>成交订单</span><strong>7</strong></div>
      <div class="card"><span>待回复消息</span><strong class="warn">3</strong></div>
    </div>
  </div>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; margin-top: 16px; max-width: 500px; }
.card { background: #fafafa; border: 1px solid #eee; border-radius: 8px; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.card span { font-size: 14px; color: #666; }
.card strong { font-size: 28px; }
.warn { color: #f43f5e; }
</style>
