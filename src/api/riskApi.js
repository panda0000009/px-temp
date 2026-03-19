import request from '@/utils/request'
// 获取风控配置列表
export function getriskListApi(data) {
    return request.post('/agent-admin/risk/list', data)
}
// 创建/修改风控配置
export function createRiskListApi(data) {
    return request.post('/agent-admin/risk/create', data)
}
// 删除风控配置
export function deleteRiskListApi(data) {
    return request.post('/agent-admin/risk/delete', data)
}
// 启用/禁用风控配置
export function enabledRiskListApi(data) {
    return request.post('/agent-admin/risk/enabled', data)
}
// 获取风控告警邮箱列表
export function listMailApi(data) {
    return request.post('/agent-admin/risk/list-mail', data)
}
// 添加风控告警邮箱
export function addMailApi(data) {
    return request.post('/agent-admin/risk/add-mail', data)
}
// 删除风控告警邮箱
export function delMailApi(data) {
    return request.post('/agent-admin/risk/del-mail', data)
}
// 设置风控告警邮件每日次数上限
export function setMailLimitApi(data) {
    return request.post('/agent-admin/risk/set-mail-limit', data)
}
