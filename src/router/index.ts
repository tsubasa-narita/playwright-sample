import { createRouter, createWebHistory } from 'vue-router';
import OrderListView from '../views/OrderListView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: OrderListView
        }
    ]
});

export default router;
