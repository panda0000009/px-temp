import { ref, toValue } from 'vue'
import router from '@/router'
import usePageDataCache from './usePageDataCache'

const { getCacheData, saveCacheData } = usePageDataCache()
// 从缓存中获取查询参数、分页信息，有缓存则返回缓存，反之默认返回
const getCacheHandler = ({ key, routePath, session }) => {
    return getCacheData({ key, routePath, session })
}

// 获取当前路由路径
const getCurRoutePath = (linkPath) => {
    return linkPath ? router.currentRoute.value.fullPath : null
}

/**
 * @param {Object} api 请求接口函数
 * @param {Object} options 配置项
 * @param {Function} options.formatResult 格式化数据函数
 * @param {Function} options.onSuccess 请求成功回调函数
 * @param {String} options.cacheKey 缓存key
 * @param {Boolean} options.linkPath 是否使用当前路由路径作为缓存key
 * @param {Boolean} options.session 是否使用sessionStorage
 * @param {Boolean} options.immediate 是否立即请求数据
 * @param {Object} queryParams 查询参数
 * @param {Array} tableData 表格数据
 * @param {Object} pagerInfo 分页信息
 * @param {Number} total 表格数据总数
 */
export default function useTable(api, options) {
    const {
        formatResult,
        onSuccess,
        cacheKey: key,
        linkPath = true,
        session = true,
        immediate = false,
        pageSize = 20
    } = options || {}
    const loading = ref(false)
    const queryParams = ref({})
    const tableData = ref([])
    const pagerInfo = ref({
        page: 1,
        pageSize: pageSize
    })
    const total = ref(0)
    // 删除空值
    const delEmptyQueryNodes = (obj = {}) => {
        Object.keys(obj).forEach((key) => {
            let value = obj[key]
            value && typeof value === 'object' && delEmptyQueryNodes(value)
            ;(value === '' ||
                value === null ||
                value === undefined ||
                value.length === 0 ||
                Object.keys(value).length === 0) &&
                delete obj[key]
        })
        return obj
    }
    // 监听queryParams、pagerInfo变化，更新缓存
    const reloadData = () => {
        const routePath = getCurRoutePath(linkPath)
        saveCacheData({
            key,
            routePath,
            data: { query: toValue(queryParams), pagerInfo: toValue(pagerInfo) },
            session
        })

        loadData(routePath)
    }

    const loadData = async (routePath) => {
        loading.value = true
        try {
            let cacheData = { query: {}, pagerInfo: {} }
            if (key) {
                cacheData = getCacheHandler({
                    key,
                    routePath,
                    session
                })
            }
            queryParams.value = { ...cacheData.query, ...queryParams.value }
            pagerInfo.value = { ...cacheData.pagerInfo, ...pagerInfo.value }
            const res = await api({ ...queryParams.value, ...pagerInfo.value })
            // 原来的代码
            // const data = res?.list || res
            // 我改的代码
            const data = res?.list ?? res?.items ?? []
            tableData.value = formatResult ? formatResult(data) : data || []
            total.value = res?.total || tableData.value.length
            onSuccess && onSuccess()
        } catch (error) {
            console.error(`获取列表数据失败: ${error}`)
        } finally {
            loading.value = false
        }
    }

    if (immediate) {
        loadData(getCurRoutePath(linkPath))
    }

    const handleSearch = () => {
        // pagerInfo.value.pageNo = 1
        reloadData()
    }

    const handleReset = () => {
        queryParams.value = {}
        // pagerInfo.value.pageNo = 1
        pagerInfo.value.pageSize = pageSize
        reloadData()
    }

    return {
        loading,
        queryParams,
        tableData,
        pagerInfo,
        total,
        loadData,
        reloadData,
        handleSearch,
        handleReset
    }
}
