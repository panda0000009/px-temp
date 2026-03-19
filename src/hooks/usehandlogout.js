import { useRouter } from 'vue-router'
import { commonStore } from '@/stores/modules/commonStore'
import useUserStore from '@/stores/modules/userStore'
import { logout } from '@/api/userApi'
import { getCurrentInstance } from 'vue'

export function useLogout() {
    const router = useRouter()
    const common = commonStore()
    const { resetUserInfo } = useUserStore()
    const { proxy } = getCurrentInstance()

    /** 清空动态路由，只保留登录页和兜底页 */
    const removeDynamicRoutes = () => {
        router.getRoutes().forEach((route) => {
            if (route.path !== '/login' && route.path !== '/:catchAll(.*)') {
                if (route.name) {
                    router.removeRoute(route.name)
                }
            }
        })
    }

    /** 统一退出方法 */
    const handleLogout = async (msg) => {
        try {
            await logout()
            // 清业务状态
            common.clearTab()
            resetUserInfo()
            // 清 token
            localStorage.clear()
            sessionStorage.clear()
            // 清路由
            removeDynamicRoutes()
            proxy?.$message.success(msg)
            // 跳登录页
            router.push('/login')
        } catch (e) {
            console.error(e)
        }
    }

    return { handleLogout }
}
