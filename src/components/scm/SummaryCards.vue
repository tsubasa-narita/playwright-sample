<script setup lang="ts">
import { computed } from 'vue';
import type { Order } from '../../types';

const props = defineProps<{
  orders: Order[];
}>();

const totalAmount = computed(() => {
  return props.orders.reduce((sum, o) => sum + o.amount, 0);
});

const pendingCount = computed(() => {
  return props.orders.filter(o => ['新規', '処理中'].includes(o.status)).length;
});

const delayedCount = computed(() => {
  const today = new Date();
  return props.orders.filter(o =>
    new Date(o.deliveryDate) < today && !['完了', 'キャンセル', '出荷済'].includes(o.status)
  ).length;
});

function formatCurrency(n: number) {
  return '¥' + n.toLocaleString();
}
</script>

<template>
  <div class="summary-cards">
    <div class="summary-card">
      <div class="summary-icon blue">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      </div>
      <div class="summary-info">
        <span class="summary-label">今月の受注件数</span>
        <span class="summary-value">{{ orders.length }}件</span>
      </div>
    </div>
    <div class="summary-card">
      <div class="summary-icon green">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>
      </div>
      <div class="summary-info">
        <span class="summary-label">今月の受注金額</span>
        <span class="summary-value">{{ formatCurrency(totalAmount) }}</span>
      </div>
    </div>
    <div class="summary-card">
      <div class="summary-icon orange">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
      </div>
      <div class="summary-info">
        <span class="summary-label">処理待ち</span>
        <span class="summary-value">{{ pendingCount }}件</span>
      </div>
    </div>
    <div class="summary-card">
      <div class="summary-icon red">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/>
        </svg>
      </div>
      <div class="summary-info">
        <span class="summary-label">納期遅延</span>
        <span class="summary-value">{{ delayedCount }}件</span>
      </div>
    </div>
  </div>
</template>
