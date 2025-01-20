import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Production from '../views/Production.vue'

const routes = [
    {
        path: "/",
        name: 'Dashboard',
        component: Dashboard,
    },
    {
        path: "/production",
        name: 'Production',
        component: Production,
        // children: [
        //     {
        //         path: ':id',
        //         name: 'production-detail',
        //         component: ProductionDetail,
        //         meta: { title: '生产详情' }
        //     }
        // ]
    },
    // {
    //     path: "/quality",
    //     component: Quality,
    // },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
