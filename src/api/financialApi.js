import request from '@/utils/request'

// 首页-获取统计汇总数据
export function singleMerchantApi(data) {
    return request.post('/agent-admin/reconciliation/singleMerchant', data)
}

// 导出对账报表
export const exportReconciliationApi = (data) => {
    return request({
        url: '/agent-admin/reconciliation/singleExport',
        method: 'POST',
        data,
        responseType: 'blob'
    })
}
// 数据查询
export const queryDataApi = (data) => {
    return request({
        url: '/agent-admin/report/query-data',
        method: 'POST',
        data
    })
}
// 获取可访问的数据表信息
export function tableListApi(data) {
    return request.post('/agent-admin/report/table-list', data)
}
// 导出数据表
export function exportTableApi(data) {
    return request({
        url: '/agent-admin/report/export-data',
        method: 'POST',
        data,
        responseType: 'blob'
    })
}
