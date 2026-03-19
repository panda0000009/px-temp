import axios from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router'

// 创建实例
const service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept-Language': localStorage.getItem('LANG') === 'enUS' ? 'en-US' : 'zh-CN'
    }
})

const whiteList = ['']

// 退出登录注销动态路由，删除 path === '/' 的路由，只保留 /login 和 /:catchAll(.*) 两个路由
const removeRoute = () => {
    router.getRoutes().forEach((route) => {
        // 如果路由路径不是静态路由（包括 path === '/'），则移除
        if (route.path !== '/login' && route.path !== '/:catchAll(.*)') {
            try {
                // 优先通过 name 移除，如果没有 name 则通过 path 移除
                if (route.name) {
                    router.removeRoute(route.name)
                }
            } catch (error) {
                // 如果移除失败，忽略错误（可能路由已经被移除）
                console.warn(`Failed to remove route: ${route.path}`, error)
            }
        }
    })
}

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 添加取消请求控制器
        config.cancelToken = new axios.CancelToken((cancel) => {
            window.__axiosCancelList.push(cancel)
        })

        // 自动添加token
        const token = localStorage.getItem('token')
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use((response) => {
    const { data, config } = response
    if (config.responseType === 'blob') {
        return response
    } else {
        // 添加这个逻辑
        // 如果后端没有 code 字段
        if (data.code === undefined) return data
        if (data.code === 0) return data.data
        if (data.code === 1008) {
            localStorage.clear()
            sessionStorage.clear()
            removeRoute()
            router.replace({ path: '/login' })
            message.error(`你没有权限或账号在别处登录!`)
            return
        }
        if (data.code === 1009) {
            return message.error(`账号已被禁用!`)
        } else {
            // 处理业务错误
            const errorMsg = data.msg || '请求失败'
            return Promise.reject(new Error(errorMsg))
        }
    }
})

// 错误处理函数
function handleError(error) {
    let errorMessage = '请求失败'

    if (error.response) {
        switch (error.response.status) {
            case 401:
                errorMessage = '登录已过期，请重新登录'
                // 跳转登录页
                break
            case 403:
                errorMessage = '没有操作权限'
                break
            case 500:
                errorMessage = '服务器错误'
                break
        }
    } else if (error.message.includes('timeout')) {
        errorMessage = '请求超时'
    } else if (axios.isCancel(error)) {
        console.log('请求被取消')
        return
    }

    message.error(errorMessage)
}

// 初始化取消请求列表
window.__axiosCancelList = []

// 取消所有pending请求
export function cancelAllRequests() {
    window.__axiosCancelList.forEach((cancel) => cancel())
    window.__axiosCancelList = []
}

// 重试请求机制
export function createRetryWrapper(instance, options = {}) {
    const { retries = 3, retryDelay = 1000 } = options

    return async function retryRequest(config) {
        let retryCount = 0

        const tryRequest = async () => {
            try {
                return await instance(config)
            } catch (error) {
                if (retryCount < retries) {
                    retryCount++
                    await new Promise((resolve) => setTimeout(resolve, retryDelay))
                    return tryRequest()
                }
                throw error
            }
        }

        return tryRequest()
    }
}

// 使用示例
// const retryRequest = createRetryWrapper(service, { retries: 5 })

// 请求缓存
const cacheMap = new Map()
export function cachedRequest(config, cacheTime = 60000) {
    const cacheKey = JSON.stringify(config)

    if (cacheMap.has(cacheKey)) {
        const { expire, data } = cacheMap.get(cacheKey)
        if (Date.now() < expire) return Promise.resolve(data)
    }

    return service(config).then((data) => {
        cacheMap.set(cacheKey, {
            expire: Date.now() + cacheTime,
            data
        })
        return data
    })
}

/** @type {import('axios').AxiosInstance} */
export const request = service

export default service
