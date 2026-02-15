export type OrderStatus = '新規' | '処理中' | '出荷準備中' | '出荷済' | '完了' | 'キャンセル';

export interface Product {
    name: string;
    category: string;
    unitPrice: number;
}

export interface Order {
    orderNo: string;
    orderDate: string;
    customer: string;
    productName: string;
    category: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    deliveryDate: string;
    status: OrderStatus;
    assignee: string;
    warehouse: string;
    notes: string;
}
