import Layout from '@/layout/index.vue'
import useUserStore from '@/stores/modules/userStore'

const modules = import.meta.glob('/src/views/**/**.vue')

// 静态路由
const constantRoutes = [
    {
        path: '/noPermission',
        name: 'NoPermission',
        component: () => import('@/views/noPermission/index.vue'),
        hidden: true
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        hidden: true
    },
    { path: '/:catchAll(.*)', component: () => import('@/views/notFound/index.vue') }
]

const demoRoutes = [
    {
        path: '/demo/default-form',
        name: 'DefaultFormDemo',
        component: modules['/src/views/demo/default-form-demo.vue'],
        meta: {
            title: 'Default Form Demo',
            visible: false,
            keepAlive: false
        },
        hidden: true
    },
    {
        path: '/demo/page-box',
        name: 'PageBoxDemo',
        component: modules['/src/views/demo/page-box-demo.vue'],
        meta: {
            title: 'Page Box Demo',
            visible: false,
            keepAlive: false
        },
        hidden: true
    },
    {
        path: '/demo/mypage',
        name: 'MyPageDemo',
        component: modules['/src/views/demo/mypage.vue'],
        meta: {
            title: 'MyPage Demo',
            visible: false,
            keepAlive: false
        },
        hidden: true
    }
]
// 递归动态路由
const filterAsnycRoutes = (data, parentPath = null) => {
    const routes = data.reduce((acc, cur) => {
        const name = cur.name
        const component = cur.component === 'Layout' ? Layout : modules[`/src/views/${cur.component}.vue`]
        // const children = cur.children ? cur.children.filter((i) => i.type && i.type != 3) : []
        const children = cur.children ?? []
        let route = {
            path: cur.path,
            name,
            component,
            meta: {
                parentPath,
                title: cur.name,
                icon: cur.icon,
                leaf: cur.leaf,
                visible: cur.visible,
                keepAlive: cur.keepAlive
            },
            children
        }
        if (route.children && route.children.length > 0) {
            route.children = filterAsnycRoutes(route.children, route.path)
        }
        acc.push(route)
        return acc
    }, [])

    return routes
}
// 生成动态路由
const generateAsyncRoutes = async () => {
    const { setMenuList, getUserPermission, userInfo } = useUserStore()
    const menus = await getUserPermission()
    const routes = filterAsnycRoutes(menus)
    setMenuList(routes)
    // 找第一个可用的子路由 path
    const firstAvailablePath = routes[0]?.children[0]?.path || '/workbench'
    // const redirectPath = userInfo.value?.jwtToken ? import.meta.env.VITE_APP_INDEX_HOME_URL || '/workbench' : '/login'
    const redirectPath = userInfo.value?.jwtToken
        ? import.meta.env.VITE_APP_INDEX_HOME_URL || firstAvailablePath
        : '/login'
    return [
        {
            path: '/',
            component: Layout,
            redirect: redirectPath,
            children: [...routes, ...demoRoutes]
        }
    ]
}

export { constantRoutes, generateAsyncRoutes }
