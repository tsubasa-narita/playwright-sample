<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api, CUSTOMERS, PRODUCTS, ASSIGNEES, WAREHOUSES } from '../services/api';
import type { Order } from '../types';
import { useToast } from '../composables/useToast';
import SummaryCards from '../components/scm/SummaryCards.vue';
import FilterPanel, { type FilterState } from '../components/scm/FilterPanel.vue';
import OrderTable from '../components/scm/OrderTable.vue';
import BaseModal from '../components/ui/BaseModal.vue';

const { show: showToast } = useToast();

const allOrders = ref<Order[]>([]);
const filteredOrders = ref<Order[]>([]);
const isLoading = ref(true);

const currentPage = ref(1);
const pageSize = ref(25);
const sortKey = ref<keyof Order>('orderNo');
const sortDir = ref<'asc' | 'desc'>('asc');

// モーダル状態
const showDetailModal = ref(false);
const showNewModal = ref(false);
const selectedOrder = ref<Order | null>(null);

function formatCurrency(n: number) {
  return '¥' + n.toLocaleString();
}

onMounted(async () => {
    try {
        allOrders.value = await api.fetchOrders();
        filteredOrders.value = [...allOrders.value];
        showToast('受注データを読み込みました', 'success');
    } finally {
        isLoading.value = false;
    }
});

function handleSearch(filters: FilterState) {
    isLoading.value = true;
    setTimeout(() => { // Mock delay
        filteredOrders.value = allOrders.value.filter(o => {
            if (filters.orderNo && !o.orderNo.includes(filters.orderNo)) return false;
            if (filters.customer && o.customer !== filters.customer) return false;
            if (filters.status && o.status !== filters.status) return false;
            if (filters.assignee && o.assignee !== filters.assignee) return false;
            if (filters.dateFrom && o.orderDate < filters.dateFrom) return false;
            if (filters.dateTo && o.orderDate > filters.dateTo) return false;
            if (filters.category && o.category !== filters.category) return false;
            return true;
        });
        currentPage.value = 1;
        isLoading.value = false;
        showToast(`${filteredOrders.value.length} 件の受注データが見つかりました`, 'success');
    }, 500);
}

function handleClearFilters() {
    filteredOrders.value = [...allOrders.value];
    currentPage.value = 1;
    showToast('フィルターをクリアしました');
}

function handleSort(key: keyof Order) {
    if (sortKey.value === key) {
        sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortDir.value = 'asc';
    }

    filteredOrders.value.sort((a, b) => {
        let va = a[key] as string | number;
        let vb = b[key] as string | number;
        if (typeof va === 'number' && typeof vb === 'number') {
            return sortDir.value === 'asc' ? va - vb : vb - va;
        }
        va = String(va);
        vb = String(vb);
        return sortDir.value === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
}

function exportCSV() {
    showToast('CSV出力を開始しました...', 'success');
    setTimeout(() => {
        showToast('CSVファイルのダウンロードが完了しました', 'success');
    }, 1500);
}

async function openDetail(orderNo: string) {
    isLoading.value = true;
    const order = await api.fetchOrderDetail(orderNo);
    isLoading.value = false;
    if (order) {
        selectedOrder.value = order;
        showDetailModal.value = true;
    } else {
        showToast('受注データが見つかりませんでした', 'error');
    }
}

// Pagination logic
const displayOrders = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredOrders.value.slice(start, start + pageSize.value);
});
</script>

<template>
  <div class="order-list-view">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p class="loading-text">データを読み込み中...</p>
    </div>

    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">受注一覧</h1>
        <p class="page-subtitle">全ての受注情報を確認・管理できます</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" @click="exportCSV">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2 11v2.5A1.5 1.5 0 003.5 15h9a1.5 1.5 0 001.5-1.5V11M8 1v9M5 7l3 3 3-3"/>
          </svg>
          CSV出力
        </button>
        <button class="btn btn-primary" @click="showNewModal = true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3v10M3 8h10"/>
          </svg>
          新規受注
        </button>
      </div>
    </div>

    <!-- Summary -->
    <SummaryCards :orders="allOrders" />

    <!-- Filters -->
    <FilterPanel @search="handleSearch" @clear="handleClearFilters" />

    <!-- Table -->
    <OrderTable 
        :orders="displayOrders" 
        :totalCount="filteredOrders.length" 
        v-model:pageSize="pageSize" 
        v-model:currentPage="currentPage"
        @sort="handleSort"
        @viewDetail="openDetail"
    />
  </div>

  <!-- Detail Modal -->
  <BaseModal title="受注詳細" :isOpen="showDetailModal" @close="showDetailModal = false">
    <div v-if="selectedOrder" class="detail-grid">
      <span class="detail-label">受注番号</span>
      <span class="detail-value">{{ selectedOrder.orderNo }}</span>
      <span class="detail-label">受注日</span>
      <span class="detail-value">{{ selectedOrder.orderDate }}</span>
      <span class="detail-label">取引先</span>
      <span class="detail-value">{{ selectedOrder.customer }}</span>
      <span class="detail-label">商品名</span>
      <span class="detail-value">{{ selectedOrder.productName }}</span>
      <span class="detail-label">カテゴリ</span>
      <span class="detail-value">{{ selectedOrder.category }}</span>
      <span class="detail-label">数量</span>
      <span class="detail-value">{{ selectedOrder.quantity.toLocaleString() }}</span>
      <span class="detail-label">単価</span>
      <span class="detail-value">{{ formatCurrency(selectedOrder.unitPrice) }}</span>
      <span class="detail-label">金額</span>
      <span class="detail-value" style="font-weight:700;color:var(--primary);">{{ formatCurrency(selectedOrder.amount) }}</span>
      <span class="detail-label">納期</span>
      <span class="detail-value">{{ selectedOrder.deliveryDate }}</span>
      <span class="detail-label">ステータス</span>
      <span class="detail-value"><span :class="['status-badge', selectedOrder.status]">{{ selectedOrder.status }}</span></span>
      <span class="detail-label">担当者</span>
      <span class="detail-value">{{ selectedOrder.assignee }}</span>
      <span class="detail-label">出荷倉庫</span>
      <span class="detail-value">{{ selectedOrder.warehouse }}</span>
      <span class="detail-label">備考</span>
      <span class="detail-value">{{ selectedOrder.notes || '—' }}</span>
    </div>
  </BaseModal>

  <!-- New Order Modal -->
  <BaseModal title="新規受注登録" :isOpen="showNewModal" @close="showNewModal = false">
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div>
        <label class="filter-label">取引先 <span style="color:var(--red);">*</span></label>
        <select class="filter-select" style="width:100%;">
          <option value="">選択してください</option>
          <option v-for="c in CUSTOMERS" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div>
        <label class="filter-label">商品 <span style="color:var(--red);">*</span></label>
        <select class="filter-select" style="width:100%;">
          <option value="">選択してください</option>
          <option v-for="p in PRODUCTS" :key="p.name" :value="p.name">{{ p.name }}（{{ formatCurrency(p.unitPrice) }}）</option>
        </select>
      </div>
      <div style="display:flex;gap:14px;">
        <div style="flex:1;">
          <label class="filter-label">数量 <span style="color:var(--red);">*</span></label>
          <input type="number" class="filter-input" style="width:100%;" value="100" min="1">
        </div>
        <div style="flex:1;">
          <label class="filter-label">納期 <span style="color:var(--red);">*</span></label>
          <input type="date" class="filter-input" style="width:100%;" value="2026-03-15">
        </div>
      </div>
      <div>
        <label class="filter-label">担当者</label>
        <select class="filter-select" style="width:100%;">
          <option v-for="a in ASSIGNEES" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>
      <div>
        <label class="filter-label">出荷倉庫</label>
        <select class="filter-select" style="width:100%;">
          <option v-for="w in WAREHOUSES" :key="w" :value="w">{{ w }}</option>
        </select>
      </div>
      <div>
        <label class="filter-label">備考</label>
        <textarea class="filter-input" style="width:100%;height:60px;padding:8px 10px;resize:vertical;" placeholder="特記事項があれば入力してください"></textarea>
      </div>
    </div>
  </BaseModal>
</template>
