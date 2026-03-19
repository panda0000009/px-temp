import request from '@/utils/request'

// 首页-获取统计汇总数据
export function aggregateData(data) {
    return request.post('/agent-admin/report/dashboard', data)
}
// 获取数值统计报告
export function statisticsData(data) {
    return request.post('/agent-admin/report/statistics', data)
}
// 导出
export const exportReportApi = (data) => {
    return request({
        url: '/agent-admin/report/export',
        method: 'POST',
        data,
        responseType: 'blob'
    })
}
// 转换中台玩家 ID 为运营商玩家 ID
export function convertPlayeridApi(data) {
    return request.post('/agent-admin/report/convert-playerid', data)
}
// 转换运营商玩家 ID 为中台玩家 ID
export function convertUidApi(data) {
    return request.post('/agent-admin/report/convert-uid', data)
}
// 下注统计
export function betInfoApi(data) {
    return request.post('/agent-admin/report/bet-info', data)
}
// Rtp下注统计
export function gameRtpApi(data) {
    return request.post('/agent-admin/report/game-rtp', data)
}
