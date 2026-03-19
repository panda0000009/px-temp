import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes } from './config'

const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes,
    scrollBehavior: () => ({ left: 0, top: 0, behavior: 'smooth' })
})

export default router
