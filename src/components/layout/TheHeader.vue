<script setup lang="ts">
// Header Logic
</script>

<template>
  <header class="header">
    <div class="header-left">
      <div class="logo">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="6" fill="#4F8CFF"/>
          <path d="M7 14h4l3-6 4 12 3-6h4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="logo-text">SCM Manager</span>
      </div>
    </div>
    <nav class="header-nav">
      <a href="#" class="nav-link">ダッシュボード</a>
      <router-link to="/" class="nav-link active">受注管理</router-link>
      <a href="#" class="nav-link">在庫管理</a>
      <a href="#" class="nav-link">出荷管理</a>
      <a href="#" class="nav-link">マスタ管理</a>
    </nav>
    <div class="header-right">
      <button class="icon-btn" title="通知">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M10 17.5c.83 0 1.5-.67 1.5-1.5h-3c0 .83.67 1.5 1.5 1.5zm5-4.5V9c0-2.76-1.86-5.07-4.5-5.73V2.5a.5.5 0 00-1 0v.77C6.86 3.93 5 6.24 5 9v4l-1.5 1.5v.5h13v-.5L15 13z"/>
        </svg>
        <span class="notification-badge">3</span>
      </button>
      <div class="user-info">
        <div class="avatar">TY</div>
        <span class="user-name">田中 太郎</span>
      </div>
    </div>
  </header>
</template>
