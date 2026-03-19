import request from '@/utils/request'

// 商户管理 // 管理列表
export function getMerchant(data) {
    return request.post('/agent-admin/agent/list', data)
}
// 禁用启用商户
export function merchantEnabled(data) {
    return request.post('/agent-admin/agent/enabled', data)
}
// 获取商户key
export function getQueryKey(data) {
    return request.post('/agent-admin/agent/query/key', data)
}
// 新增/修改商户列表
export function createMerchant(data) {
    return request.post('/agent-admin/agent/create', data)
}
// 获取当前账号授权访问的运营商列表
export function agentListAuth() {
    return request.post('/agent-admin/agent/list-auth')
}
// 获取游戏应用列表
export function getGameList(data) {
    return request.post('/agent-admin/game/list', data)
}
// 启用禁用应用列表
export function gameEnabled(data) {
    return request.post('/agent-admin/game/enabled', data)
}
// 创建/修改游戏应用
export function createGame(data) {
    return request.post('/agent-admin/game/create', data)
}
// 获取当前账号授权访问的游戏列表
export function gamelistAuth(data) {
    return request.post('/agent-admin/game/list-auth', data)
}
// 删除菜单
export function delGame(data) {
    return request.post('/agent-admin/game/delete', data)
}
// 批量导入游戏列表接口
export function gameUpload(data) {
    return request({
        url: '/agent-admin/game/upload',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}
// 获取供应商列表
export function getProvider(data) {
    return request.post('/agent-admin/provider/list', data)
}
// 新增/修改供应商
export function createProvider(data) {
    return request.post('/agent-admin/provider/create', data)
}
// 启用/禁用供应商
export function enabledProvider(data) {
    return request.post('/agent-admin/provider/enabled', data)
}
// 获取供应商密钥
export function queryKeyProvider(data) {
    return request.post('/agent-admin/provider/query/key', data)
}
// 获取当前账号授权访问的供应商列表
export function listAuthProvider() {
    return request.post('/agent-admin/provider/list-auth')
}
// 设置权限
export function setAuthorityApi(data) {
    return request.post('/agent-admin/account/setAuthority', data)
}
// 获取汇率列表
export function rateListApi(data) {
    return request.post('/agent-admin/rate/list', data)
}
// 修改汇率
export function updateRateApi(data) {
    return request.post('/agent-admin/rate/create', data)
}
// 修改玩家余额
export function modifyBalanceApi(data) {
    return request.post('/agent-admin/game/modify-balance', data)
}
// 增加/减少 Jackpot 数值
export function addSubJackpotApi(data) {
    return request.post('/agent-admin/game/add-sub-jackpot', data)
}
// 设置下次开奖必定触发 Jackpot
export function triggerJackpotApi(data) {
    return request.post('/agent-admin/game/trigger-jackpot', data)
}
// 获取游戏服初始化配置
export function getInitConfigApi(data) {
    return request.post('/agent-admin/game/get-init-config', data)
}
// 修改游戏服初始化配置
export function setInitConfigApi(data) {
    return request.post('/agent-admin/game/set-init-config', data)
}
// 修改游戏基础 RTP
export function setBaseRtpApi(data) {
    return request.post('/agent-admin/game/set-base-rtp', data)
}
