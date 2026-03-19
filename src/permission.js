import router from './router'
import { generateAsyncRoutes } from './router/config'
import useUserStore from './stores/modules/userStore'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Layout from './layout/index.vue'
NProgress.configure({ showSpinner: false }) // NProgress 配置
const whiteList = ['/login'] // 白名单列表
// let isRouteReady = false
router.beforeEach(async (to, from) => {
    NProgress.start()
    // refreshToken
    const { userInfo } = useUserStore()
    if (whiteList.includes(to.path)) return true
    if (!userInfo.value?.jwtToken && to.page !== '/login') return { path: '/login' }
    
    if (router.getRoutes().length > 3 && userInfo.value.menus && userInfo.value.menus.length > 0) return true
    // 普通用户/超管，动态生成路由
    const routes = await generateAsyncRoutes()
    routes.forEach((r) => router.addRoute(r))
    return { ...to, replace: true }
})

router.afterEach(() => {
    NProgress.done()
})
