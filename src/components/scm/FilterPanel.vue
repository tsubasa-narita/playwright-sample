<script setup lang="ts">
import { ref } from 'vue';
import { CUSTOMERS, ASSIGNEES, CATEGORIES, STATUSES } from '../../services/api';

export interface FilterState {
  orderNo: string;
  customer: string;
  status: string;
  assignee: string;
  dateFrom: string;
  dateTo: string;
  category: string;
}

const emit = defineEmits<{
  (e: 'search', filters: FilterState): void;
  (e: 'clear'): void;
}>();

const filters = ref<FilterState>({
  orderNo: '',
  customer: '',
  status: '',
  assignee: '',
  dateFrom: '2026-02-01',
  dateTo: '2026-02-15',
  category: ''
});

function onSearch() {
  emit('search', { ...filters.value });
}

function onClear() {
  filters.value = {
    orderNo: '',
    customer: '',
    status: '',
    assignee: '',
    dateFrom: '2026-02-01',
    dateTo: '2026-02-15',
    category: ''
  };
  emit('clear');
}
</script>

<template>
  <div class="filter-panel">
    <div class="filter-row">
      <div class="filter-group">
        <label class="filter-label">受注番号</label>
        <input type="text" class="filter-input" v-model="filters.orderNo" placeholder="例: ORD-2026-0001">
      </div>
      <div class="filter-group">
        <label class="filter-label">取引先</label>
        <select class="filter-select" v-model="filters.customer">
          <option value="">すべて</option>
          <option v-for="c in CUSTOMERS" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">ステータス</label>
        <select class="filter-select" v-model="filters.status">
          <option value="">すべて</option>
          <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">担当者</label>
        <select class="filter-select" v-model="filters.assignee">
          <option value="">すべて</option>
          <option v-for="a in ASSIGNEES" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>
    </div>
    <div class="filter-row">
      <div class="filter-group">
        <label class="filter-label">受注日（開始）</label>
        <input type="date" class="filter-input" v-model="filters.dateFrom">
      </div>
      <div class="filter-group">
        <label class="filter-label">受注日（終了）</label>
        <input type="date" class="filter-input" v-model="filters.dateTo">
      </div>
      <div class="filter-group">
        <label class="filter-label">商品カテゴリ</label>
        <select class="filter-select" v-model="filters.category">
          <option value="">すべて</option>
          <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="filter-group filter-actions">
        <button class="btn btn-primary btn-sm" @click="onSearch">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="6" cy="6" r="4.5"/><path d="M13 13l-3.5-3.5"/>
          </svg>
          検索
        </button>
        <button class="btn btn-ghost btn-sm" @click="onClear">クリア</button>
      </div>
    </div>
  </div>
</template>
