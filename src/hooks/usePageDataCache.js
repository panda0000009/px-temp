export default function usePageDataCache() {
    // 生成key, storage
    const generate = ({ key, routePath, session = true }) => {
        const keyName = routePath && routePath !== '/' ? `${key}@${routePath}` : key
        const storage = session ? sessionStorage : localStorage
        return { keyName, storage }
    }

    // 判断是否是json字符串
    const isJsonString = (str) => {
        try {
            JSON.parse(str)
            return true
        } catch (e) {
            return false
        }
    }

    // 判断是否是对象
    const isObject = (value) => {
        return value !== null && typeof value === 'object' && !Array.isArray(value)
    }

    // 获取数据
    const getCacheData = ({ key, routePath, session = true }) => {
        const { keyName, storage } = generate({ key, routePath, session })
        if (!key) {
            console.warn('请传入 key')
            return
        }

        try {
            const data = storage.getItem(keyName)
            const result = isJsonString(data) ? JSON.parse(data) : data
            return result || {}
        } catch (error) {
            console.error('数据解析错误:', error)
            return null
        }
    }

    // 保存数据
    const saveCacheData = ({ key, routePath, data, session = true }) => {
        const { keyName, storage } = generate({ key, routePath, session })
        if (!key) {
            console.warn('请传入 key')
            return
        }

        if (!data) {
            console.warn('请传入 data')
            return
        }

        try {
            const result = isObject(data) ? JSON.stringify(data) : data
            storage.setItem(keyName, result)
        } catch (error) {
            console.error('数据保存失败:', error)
        }
    }

    // 删除数据
    const removeCacheData = ({ key, routePath, session = true }) => {
        const { keyName, storage } = generate({ key, routePath, session })
        if (!key) {
            console.warn('请传入 key')
            return
        }
        storage.removeItem(keyName)
    }

    return { getCacheData, saveCacheData, removeCacheData }
}
