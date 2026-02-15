<script setup lang="ts">
// Sidebar Logic
</script>

<template>
  <aside class="sidebar">
      <div class="sidebar-section">
        <h3 class="sidebar-title">受注管理</h3>
        <ul class="sidebar-menu">
          <li><router-link to="/" class="sidebar-link active">受注一覧</router-link></li>
          <li><a href="#" class="sidebar-link">新規受注登録</a></li>
          <li><a href="#" class="sidebar-link">受注承認</a></li>
          <li><a href="#" class="sidebar-link">納品予定</a></li>
        </ul>
      </div>
      <div class="sidebar-section">
        <h3 class="sidebar-title">レポート</h3>
        <ul class="sidebar-menu">
          <li><a href="#" class="sidebar-link">売上レポート</a></li>
          <li><a href="#" class="sidebar-link">在庫回転率</a></li>
          <li><a href="#" class="sidebar-link">納期遵守率</a></li>
        </ul>
      </div>
      <div class="sidebar-section">
        <h3 class="sidebar-title">設定</h3>
        <ul class="sidebar-menu">
          <li><a href="#" class="sidebar-link">通知設定</a></li>
          <li><a href="#" class="sidebar-link">アカウント</a></li>
        </ul>
      </div>
    </aside>
</template>
