import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "../views/Dashboard.vue";
import Product from '../views/Product.vue'
import Order from '../views/OrderList.vue'
import Tracking from '../views/Tracking.vue'
import Material from '../views/Material.vue'
import Quality from '../views/Quality.vue'

const routes = [
    {
        path: "/",
        name: 'Dashboard',
        component: Dashboard,
    },
    {
        path: "/material",
        name: 'Material',
        component: Material,
    },
    {
        path: "/product",
        name: 'Product',
        component: Product,
    },
    {
        path: "/order",
        name: 'Order',
        component: Order,
        // children: [
        //     {
        //         path: ':id',
        //         name: 'production-detail',
        //         component: ProductionDetail,
        //         meta: { title: 'Production Detail' }
        //     }
        // ]
    },
    {
        path: "/tracking",
        name: 'Tracking',
        component: Tracking,
    },
    {
        path: '/quality',
        name: 'Quality',
        component: Quality,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
