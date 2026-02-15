import type { Order, Product, OrderStatus } from '../types';

const CUSTOMERS = [
    '株式会社山田製作所', '東京エレクトロニクス株式会社', 'グローバルテック株式会社',
    '日本精密工業株式会社', 'サクラ商事株式会社', '富士テクノロジー株式会社',
    'アジアパーツ株式会社', 'ミドリ電子工業株式会社', 'ニュースター金属株式会社',
    'プラネット物産株式会社', 'ブルーウェーブ株式会社', 'サンライズ工業株式会社',
];

const PRODUCTS: Product[] = [
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

export const CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))];

export const ASSIGNEES = [
    '田中 太郎', '佐藤 花子', '鈴木 一郎', '高橋 美咲', '伊藤 大輔', '渡辺 さくら'
];

export const STATUSES: OrderStatus[] = ['新規', '処理中', '出荷準備中', '出荷済', '完了', 'キャンセル'];

export const WAREHOUSES = ['東京本社倉庫', '大阪物流センター', '名古屋支社倉庫', '福岡配送センター'];

function generateOrderNo(index: number): string {
    return `ORD-2026-${String(index + 1).padStart(4, '0')}`;
}

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function generateOrders(count: number): Order[] {
    const orders: Order[] = [];
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

// Mock API
let mockOrders: Order[] = [];

export const api = {
    fetchOrders(): Promise<Order[]> {
        console.log('[API] GET /api/v1/orders - Fetching orders...');
        return new Promise(resolve => {
            setTimeout(() => {
                if (mockOrders.length === 0) {
                    mockOrders = generateOrders(68);
                }
                console.log(`[API] GET /api/v1/orders - 200 OK (${mockOrders.length} records)`);
                resolve([...mockOrders]);
            }, 800);
        });
    },

    fetchOrderDetail(orderNo: string): Promise<Order | undefined> {
        console.log(`[API] GET /api/v1/orders/${orderNo} - Fetching detail...`);
        return new Promise(resolve => {
            setTimeout(() => {
                const order = mockOrders.find(o => o.orderNo === orderNo);
                console.log(`[API] GET /api/v1/orders/${orderNo} - 200 OK`);
                resolve(order ? { ...order } : undefined);
            }, 400);
        });
    }
};

export { CUSTOMERS, PRODUCTS };
