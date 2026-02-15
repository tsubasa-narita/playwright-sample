// ===== ダミーデータ定義 =====

const CUSTOMERS = [
  '株式会社山田製作所', '東京エレクトロニクス株式会社', 'グローバルテック株式会社',
  '日本精密工業株式会社', 'サクラ商事株式会社', '富士テクノロジー株式会社',
  'アジアパーツ株式会社', 'ミドリ電子工業株式会社', 'ニュースター金属株式会社',
  'プラネット物産株式会社', 'ブルーウェーブ株式会社', 'サンライズ工業株式会社',
];

const PRODUCTS = [
  { name: '精密ベアリング A-100', category: '機械部品', unitPrice: 3500 },
  { name: 'ステンレスボルト M8×30', category: '締結部品', unitPrice: 120 },
  { name: '電子基板 PCB-200X', category: '電子部品', unitPrice: 8500 },
  { name: 'ゴムパッキン GP-55', category: 'シール部品', unitPrice: 450 },
  { name: 'アルミ押出材 AL-6063', category: '素材', unitPrice: 12000 },
  { name: '樹脂コネクタ RC-12P', category: '電子部品', unitPrice: 2800 },
  { name: '銅パイプ CP-15A', category: '配管部品', unitPrice: 5600 },
  { name: 'フィルターエレメント FE-300', category: '消耗品', unitPrice: 1800 },
  { name: 'サーボモーター SM-750W', category: '駆動部品', unitPrice: 45000 },
  { name: 'タイミングベルト TB-200', category: '伝達部品', unitPrice: 7200 },
  { name: 'ステンレス板 SUS304 t2.0', category: '素材', unitPrice: 15000 },
  { name: 'LED基板ユニット LB-100', category: '電子部品', unitPrice: 6300 },
];

const CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))];

const ASSIGNEES = [
  '田中 太郎', '佐藤 花子', '鈴木 一郎', '高橋 美咲', '伊藤 大輔', '渡辺 さくら'
];

const STATUSES = ['新規', '処理中', '出荷準備中', '出荷済', '完了', 'キャンセル'];

const WAREHOUSES = ['東京本社倉庫', '大阪物流センター', '名古屋支社倉庫', '福岡配送センター'];

// ===== ダミー受注データ生成 =====

function generateOrderNo(index) {
  return `ORD-2026-${String(index + 1).padStart(4, '0')}`;
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatCurrency(n) {
  return '¥' + n.toLocaleString();
}

function generateOrders(count) {
  const orders = [];
  for (let i = 0; i < count; i++) {
    const product = randomItem(PRODUCTS);
    const quantity = randomInt(10, 500);
    const orderDate = new Date(2026, 1, randomInt(1, 15));
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + randomInt(7, 30));
    const status = randomItem(STATUSES);

    orders.push({
      orderNo: generateOrderNo(i),
      orderDate: formatDate(orderDate),
      customer: randomItem(CUSTOMERS),
      productName: product.name,
      category: product.category,
      quantity,
      unitPrice: product.unitPrice,
      amount: product.unitPrice * quantity,
      deliveryDate: formatDate(deliveryDate),
      status,
      assignee: randomItem(ASSIGNEES),
      warehouse: randomItem(WAREHOUSES),
      notes: status === 'キャンセル' ? '顧客都合によりキャンセル' : '',
    });
  }
  return orders;
}

// ===== App State =====

let allOrders = [];
let filteredOrders = [];
let currentPage = 1;
let pageSize = 25;
let sortKey = '';
let sortDir = 'asc';

// ===== 初期化 =====

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  showLoading();

  // ドロップダウンを初期化
  populateDropdown('filter-customer', CUSTOMERS);
  populateDropdown('filter-assignee', ASSIGNEES);
  populateDropdown('filter-category', CATEGORIES);

  // ダミーAPI呼び出し（遅延シミュレーション）
  allOrders = await fetchOrders();
  filteredOrders = [...allOrders];

  updateSummary();
  renderTable();
  hideLoading();
  showToast('受注データを読み込みました', 'success');
}

// ===== ダミーAPI =====

function fetchOrders() {
  console.log('[API] GET /api/v1/orders - Fetching orders...');
  return new Promise(resolve => {
    setTimeout(() => {
      const data = generateOrders(68);
      console.log(`[API] GET /api/v1/orders - 200 OK (${data.length} records)`);
      resolve(data);
    }, 800);
  });
}

function fetchOrderDetail(orderNo) {
  console.log(`[API] GET /api/v1/orders/${orderNo} - Fetching detail...`);
  return new Promise(resolve => {
    setTimeout(() => {
      const order = allOrders.find(o => o.orderNo === orderNo);
      console.log(`[API] GET /api/v1/orders/${orderNo} - 200 OK`);
      resolve(order);
    }, 400);
  });
}

// ===== UI ヘルパー =====

function populateDropdown(id, items) {
  const select = document.getElementById(id);
  items.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item;
    opt.textContent = item;
    select.appendChild(opt);
  });
}

function showLoading() {
  document.getElementById('loading-overlay').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loading-overlay').classList.add('hidden');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== サマリー更新 =====

function updateSummary() {
  document.getElementById('total-orders').textContent = allOrders.length + '件';
  const totalAmount = allOrders.reduce((sum, o) => sum + o.amount, 0);
  document.getElementById('total-amount').textContent = formatCurrency(totalAmount);
  const pending = allOrders.filter(o => ['新規', '処理中'].includes(o.status)).length;
  document.getElementById('pending-orders').textContent = pending + '件';
  // 納期遅延：過去の納期でステータスが完了/キャンセルでないもの
  const today = new Date();
  const delayed = allOrders.filter(o =>
    new Date(o.deliveryDate) < today && !['完了', 'キャンセル', '出荷済'].includes(o.status)
  ).length;
  document.getElementById('delayed-orders').textContent = delayed + '件';
}

// ===== テーブル描画 =====

function renderTable() {
  const tbody = document.getElementById('order-table-body');
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageData = filteredOrders.slice(start, end);

  document.getElementById('result-count').textContent = filteredOrders.length + ' 件';

  if (pageData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" style="text-align:center;padding:40px;color:var(--text-light);">該当するデータがありません</td></tr>`;
    renderPagination();
    return;
  }

  tbody.innerHTML = pageData.map(order => `
    <tr>
      <td class="center"><input type="checkbox" data-id="${order.orderNo}"></td>
      <td><a href="#" onclick="showDetail('${order.orderNo}'); return false;" style="color:var(--primary);text-decoration:none;font-weight:500;">${order.orderNo}</a></td>
      <td>${order.orderDate}</td>
      <td>${order.customer}</td>
      <td>${order.productName}</td>
      <td class="num">${order.quantity.toLocaleString()}</td>
      <td class="num">${formatCurrency(order.amount)}</td>
      <td>${order.deliveryDate}</td>
      <td><span class="status-badge ${order.status}">${order.status}</span></td>
      <td>${order.assignee}</td>
      <td class="center">
        <div class="action-group">
          <button class="btn-icon" title="詳細" onclick="showDetail('${order.orderNo}')">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="7" cy="7" r="6"/><path d="M7 5v4M7 3.5h.01"/>
            </svg>
          </button>
          <button class="btn-icon" title="編集" onclick="showToast('編集画面は開発中です', 'warning')">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M10 2l2 2-7 7H3v-2l7-7z"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  renderPagination();
}

// ===== ページネーション =====

function renderPagination() {
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const container = document.getElementById('page-numbers');
  container.innerHTML = '';

  document.getElementById('prev-page').disabled = currentPage <= 1;
  document.getElementById('next-page').disabled = currentPage >= totalPages;

  const range = getPageRange(currentPage, totalPages);

  range.forEach(p => {
    if (p === '...') {
      const dot = document.createElement('span');
      dot.textContent = '...';
      dot.style.cssText = 'padding: 0 4px; color: var(--text-light); font-size:0.84rem;';
      container.appendChild(dot);
    } else {
      const btn = document.createElement('button');
      btn.className = `page-num${p === currentPage ? ' active' : ''}`;
      btn.textContent = p;
      btn.onclick = () => goToPage(p);
      container.appendChild(btn);
    }
  });
}

function getPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const range = [];
  range.push(1);
  if (current > 3) range.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    range.push(i);
  }
  if (current < total - 2) range.push('...');
  range.push(total);
  return range;
}

function changePage(delta) {
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const newPage = currentPage + delta;
  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    renderTable();
    scrollToTable();
  }
}

function goToPage(page) {
  currentPage = page;
  renderTable();
  scrollToTable();
}

function scrollToTable() {
  document.querySelector('.table-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function changePageSize() {
  pageSize = parseInt(document.getElementById('page-size').value);
  currentPage = 1;
  renderTable();
}

// ===== ソート =====

function sortTable(key) {
  if (sortKey === key) {
    sortDir = sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey = key;
    sortDir = 'asc';
  }

  filteredOrders.sort((a, b) => {
    let va = a[key];
    let vb = b[key];
    if (typeof va === 'number') {
      return sortDir === 'asc' ? va - vb : vb - va;
    }
    va = String(va);
    vb = String(vb);
    return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  currentPage = 1;
  renderTable();
}

// ===== 検索 =====

async function searchOrders() {
  showLoading();
  console.log('[API] POST /api/v1/orders/search - Searching...');

  // ダミー API 遅延
  await new Promise(r => setTimeout(r, 500));

  const orderNo = document.getElementById('filter-order-no').value.trim();
  const customer = document.getElementById('filter-customer').value;
  const status = document.getElementById('filter-status').value;
  const assignee = document.getElementById('filter-assignee').value;
  const dateFrom = document.getElementById('filter-date-from').value;
  const dateTo = document.getElementById('filter-date-to').value;
  const category = document.getElementById('filter-category').value;

  filteredOrders = allOrders.filter(o => {
    if (orderNo && !o.orderNo.includes(orderNo)) return false;
    if (customer && o.customer !== customer) return false;
    if (status && o.status !== status) return false;
    if (assignee && o.assignee !== assignee) return false;
    if (dateFrom && o.orderDate < dateFrom) return false;
    if (dateTo && o.orderDate > dateTo) return false;
    if (category && o.category !== category) return false;
    return true;
  });

  console.log(`[API] POST /api/v1/orders/search - 200 OK (${filteredOrders.length} records)`);

  currentPage = 1;
  renderTable();
  hideLoading();
  showToast(`${filteredOrders.length} 件の受注データが見つかりました`, 'success');
}

function clearFilters() {
  document.getElementById('filter-order-no').value = '';
  document.getElementById('filter-customer').value = '';
  document.getElementById('filter-status').value = '';
  document.getElementById('filter-assignee').value = '';
  document.getElementById('filter-date-from').value = '2026-02-01';
  document.getElementById('filter-date-to').value = '2026-02-15';
  document.getElementById('filter-category').value = '';
  filteredOrders = [...allOrders];
  currentPage = 1;
  renderTable();
  showToast('フィルターをクリアしました');
}

// ===== 全選択 =====

function toggleSelectAll() {
  const checked = document.getElementById('select-all').checked;
  document.querySelectorAll('#order-table-body input[type="checkbox"]').forEach(cb => {
    cb.checked = checked;
  });
}

// ===== 詳細モーダル =====

async function showDetail(orderNo) {
  showLoading();
  const order = await fetchOrderDetail(orderNo);
  hideLoading();

  if (!order) {
    showToast('受注データが見つかりませんでした', 'error');
    return;
  }

  document.getElementById('modal-title').textContent = `受注詳細 - ${order.orderNo}`;
  document.getElementById('modal-body').innerHTML = `
    <div class="detail-grid">
      <span class="detail-label">受注番号</span>
      <span class="detail-value">${order.orderNo}</span>
      <span class="detail-label">受注日</span>
      <span class="detail-value">${order.orderDate}</span>
      <span class="detail-label">取引先</span>
      <span class="detail-value">${order.customer}</span>
      <span class="detail-label">商品名</span>
      <span class="detail-value">${order.productName}</span>
      <span class="detail-label">カテゴリ</span>
      <span class="detail-value">${order.category}</span>
      <span class="detail-label">数量</span>
      <span class="detail-value">${order.quantity.toLocaleString()}</span>
      <span class="detail-label">単価</span>
      <span class="detail-value">${formatCurrency(order.unitPrice)}</span>
      <span class="detail-label">金額</span>
      <span class="detail-value" style="font-weight:700;color:var(--primary);">${formatCurrency(order.amount)}</span>
      <span class="detail-label">納期</span>
      <span class="detail-value">${order.deliveryDate}</span>
      <span class="detail-label">ステータス</span>
      <span class="detail-value"><span class="status-badge ${order.status}">${order.status}</span></span>
      <span class="detail-label">担当者</span>
      <span class="detail-value">${order.assignee}</span>
      <span class="detail-label">出荷倉庫</span>
      <span class="detail-value">${order.warehouse}</span>
      <span class="detail-label">備考</span>
      <span class="detail-value">${order.notes || '—'}</span>
    </div>
  `;

  document.getElementById('detail-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('detail-modal').classList.add('hidden');
}

// ESCでモーダルを閉じる
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ===== CSV出力（ダミー） =====

function exportCSV() {
  console.log('[API] GET /api/v1/orders/export?format=csv - Exporting...');
  showToast('CSV出力を開始しました...', 'success');
  setTimeout(() => {
    console.log('[API] GET /api/v1/orders/export - 200 OK (file generated)');
    showToast('CSVファイルのダウンロードが完了しました', 'success');
  }, 1500);
}

// ===== 新規受注モーダル（ダミー） =====

function showNewOrderModal() {
  document.getElementById('modal-title').textContent = '新規受注登録';
  document.getElementById('modal-body').innerHTML = `
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div>
        <label class="filter-label">取引先 <span style="color:var(--red);">*</span></label>
        <select class="filter-select" style="width:100%;">
          <option value="">選択してください</option>
          ${CUSTOMERS.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="filter-label">商品 <span style="color:var(--red);">*</span></label>
        <select class="filter-select" style="width:100%;">
          <option value="">選択してください</option>
          ${PRODUCTS.map(p => `<option value="${p.name}">${p.name}（${formatCurrency(p.unitPrice)}）</option>`).join('')}
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
          ${ASSIGNEES.map(a => `<option value="${a}">${a}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="filter-label">出荷倉庫</label>
        <select class="filter-select" style="width:100%;">
          ${WAREHOUSES.map(w => `<option value="${w}">${w}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="filter-label">備考</label>
        <textarea class="filter-input" style="width:100%;height:60px;padding:8px 10px;resize:vertical;" placeholder="特記事項があれば入力してください"></textarea>
      </div>
    </div>
  `;
  document.getElementById('detail-modal').classList.remove('hidden');
}
