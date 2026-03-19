import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
// import { getPermission, refreshtokenApi } from '@/api/userApi'
import { allAsyncRoutes } from '@/router/asyncRoutes'
import { buildRouteTree } from '@/utils/buildRouteTree'
const useUserStore = defineStore(
    'user',
    () => {
        // 路由状态
        const isRouteReady = ref(false)
        // 用户信息
        const userInfo = reactive({})
        const setRouteReady = (value) => {
            isRouteReady.value = value
        }
        const setUserInfo = (data) => {
            userInfo.value = data
        }

        const setMenuList = (data) => {
            userInfo.value.menus = data
        }
        const getUserPermission = async () => {
            // 如果是超管
            if (userInfo.value?.isSuper) {
                return allAsyncRoutes
            }
            // 普通用户，构建动态路由
            const menusStr = sessionStorage.getItem('menus')
            let res = []
            try {
                res = menusStr ? JSON.parse(menusStr) : []
                if (!Array.isArray(res)) res = []
            } catch (e) {
                res = []
            }
            const dynamicRoutes = buildRouteTree(res)
            return dynamicRoutes
        }

        const resetUserInfo = () => {
            userInfo.value = {}
        }

        const refreshToken = () => {
            // refreshtokenApi({ refreshToken: userInfo.value.refreshToken }).then((res) => {
            //     console.log(res)
            //     localStorage.setItem('token', res.accessToken)
            //     userInfo.value = { ...userInfo.value, ...res.user }
            // })
        }

        return {
            isRouteReady,
            userInfo,
            getUserPermission,
            setUserInfo,
            setMenuList,
            resetUserInfo,
            refreshToken,
            setRouteReady
        }
    },
    { persist: true }
)

export default useUserStore
