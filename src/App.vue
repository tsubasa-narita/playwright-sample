<script setup lang="ts">
import { RouterView } from 'vue-router';
import TheHeader from './components/layout/TheHeader.vue';
import TheSidebar from './components/layout/TheSidebar.vue';
import ToastNotification from './components/ui/ToastNotification.vue';
</script>

<template>
  <TheHeader />
  <div class="main-wrapper">
    <TheSidebar />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
  <ToastNotification />
</template>
