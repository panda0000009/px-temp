import request from '@/utils/request'

// 登陆
export function login(data) {
    return request({
        url: '/agent-admin/login',
        method: 'post',
        data
    })
}
// 登出
export function logout(data) {
    return request.post('/agent-admin/logout', data)
}
// 获取用户组
export function rolelist(data) {
    return request({
        url: '/agent-admin/role/list',
        method: 'post',
        data
    })
}
// 获取运营商管理员账号列表
export function accountListApi(data) {
    return request.post('/agent-admin/account/list', data)
}
// 启用/禁用管理员账号
export function accountEnabledApi(data) {
    return request.post('/agent-admin/account/enabled', data)
}
// 注册/修改管理员账号
export function accountCreateApi(data) {
    return request.post('/agent-admin/account/create', data)
}
// 删除管理员账号
export function accountDeleteApi(data) {
    return request.post('/agent-admin/account/delete', data)
}
// 重置密码
export function resetPasswordApi(data) {
    return request.post('/agent-admin/account/reset-password', data)
}
// 获取用户组列表
export function roleListApi(data) {
    return request.post('/agent-admin/role/list', data)
}
// 创建/修改用户组
export function roleCreateApi(data) {
    return request.post('/agent-admin/role/create', data)
}
// 删除用户组
export function roleDeleteApi(data) {
    return request.post('/agent-admin/role/delete', data)
}
// 获取菜单列表
export function menuListApi(data) {
    return request.post('/agent-admin/menu/list', data)
}
// 创建/修改菜单
export function menuCreateApi(data) {
    return request.post('/agent-admin/menu/create', data)
}
// 删除菜单
export function menuDeleteApi(data) {
    return request.post('/agent-admin/menu/delete', data)
}
// 获取邮箱验证码
export function sendSmsApi(data) {
    return request.post('/agent-admin/account/send-code', data)
}
// 校验绑定验证码/校验并修改密码
export function verifyCode(data) {
    return request.post('/agent-admin/account/verify-code', data)
}
