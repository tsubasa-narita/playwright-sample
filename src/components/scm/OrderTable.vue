<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Order } from '../../types';
import { useToast } from '../../composables/useToast';

const props = defineProps<{
  orders: Order[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
}>();

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void;
  (e: 'update:pageSize', size: number): void;
  (e: 'sort', key: keyof Order): void;
  (e: 'viewDetail', orderNo: string): void;
}>();

const { show: showToast } = useToast();

const selectedOrders = ref<Set<string>>(new Set());
const selectAll = ref(false);

watch(() => props.orders, () => {
    selectedOrders.value.clear();
    selectAll.value = false;
});

function toggleSelectAll() {
  if (selectAll.value) {
    props.orders.forEach(o => selectedOrders.value.add(o.orderNo));
  } else {
    selectedOrders.value.clear();
  }
}

function formatCurrency(n: number) {
  return '¥' + n.toLocaleString();
}

// Pagination logic
const totalPages = computed(() => Math.ceil(props.totalCount / props.pageSize));

const pageRange = computed(() => {
  const current = props.currentPage;
  const total = totalPages.value;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const range: (number | string)[] = [];
  range.push(1);
  if (current > 3) range.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    range.push(i);
  }
  if (current < total - 2) range.push('...');
  range.push(total);
  return range;
});

function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page);
  }
}

function onEdit() {
    showToast('編集画面は開発中です', 'warning');
}
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <div class="table-info">
        <span>{{ totalCount }} 件</span>の結果を表示
      </div>
      <div class="table-controls">
        <select class="table-select" :value="pageSize" @change="emit('update:pageSize', Number(($event.target as HTMLSelectElement).value))">
          <option value="10">10件</option>
          <option value="25">25件</option>
          <option value="50">50件</option>
          <option value="100">100件</option>
        </select>
      </div>
    </div>
    <div class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th class="th-checkbox"><input type="checkbox" v-model="selectAll" @change="toggleSelectAll"></th>
            <th class="sortable" @click="emit('sort', 'orderNo')">受注番号 <span class="sort-icon">↕</span></th>
            <th class="sortable" @click="emit('sort', 'orderDate')">受注日 <span class="sort-icon">↕</span></th>
            <th class="sortable" @click="emit('sort', 'customer')">取引先 <span class="sort-icon">↕</span></th>
            <th>商品名</th>
            <th class="sortable num" @click="emit('sort', 'quantity')">数量 <span class="sort-icon">↕</span></th>
            <th class="sortable num" @click="emit('sort', 'amount')">金額 <span class="sort-icon">↕</span></th>
            <th class="sortable" @click="emit('sort', 'deliveryDate')">納期 <span class="sort-icon">↕</span></th>
            <th>ステータス</th>
            <th>担当者</th>
            <th class="th-actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="orders.length === 0">
            <td colspan="11" style="text-align:center;padding:40px;color:var(--text-light);">該当するデータがありません</td>
          </tr>
          <tr v-for="order in orders" :key="order.orderNo">
            <td class="center"><input type="checkbox" :value="order.orderNo" v-model="selectedOrders"></td>
            <td><a href="#" @click.prevent="emit('viewDetail', order.orderNo)" style="color:var(--primary);text-decoration:none;font-weight:500;">{{ order.orderNo }}</a></td>
            <td>{{ order.orderDate }}</td>
            <td>{{ order.customer }}</td>
            <td>{{ order.productName }}</td>
            <td class="num">{{ order.quantity.toLocaleString() }}</td>
            <td class="num">{{ formatCurrency(order.amount) }}</td>
            <td>{{ order.deliveryDate }}</td>
            <td><span :class="['status-badge', order.status]">{{ order.status }}</span></td>
            <td>{{ order.assignee }}</td>
            <td class="center">
              <div class="action-group">
                <button class="btn-icon" title="詳細" @click="emit('viewDetail', order.orderNo)">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="7" cy="7" r="6"/><path d="M7 5v4M7 3.5h.01"/>
                  </svg>
                </button>
                <button class="btn-icon" title="編集" @click="onEdit">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M10 2l2 2-7 7H3v-2l7-7z"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button class="page-btn" :disabled="currentPage <= 1" @click="changePage(currentPage - 1)">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 2L4 7l5 5"/>
        </svg>
        前へ
      </button>
      <div class="page-numbers">
        <template v-for="p in pageRange" :key="p">
            <span v-if="p === '...'" style="padding: 0 4px; color: var(--text-light); font-size:0.84rem;">...</span>
            <button v-else :class="['page-num', { active: p === currentPage }]" @click="changePage(Number(p))">{{ p }}</button>
        </template>
      </div>
      <button class="page-btn" :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)">
        次へ
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 2l5 5-5 5"/>
        </svg>
      </button>
    </div>
  </div>
</template>
