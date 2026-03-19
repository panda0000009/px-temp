import request from '@/utils/request'

// 菜单管理-获取菜单列表
export function getMenuList(data) {
    return request.post('/v1/sysMenu/list',
        data
    )
}
// 菜单管理-菜单删除
export function deleteMenu(data) {
    return request.post('/v1/sysMenu/delete',
        data
    )
}
// 菜单管理-新增
export function createMenu(data) {
    return request.post('/v1/sysMenu/add', data)
}

// 菜单管理-获取菜单详情
export function getMenuDetail(data) {
    return request.post('/v1/sysMenu/query',
        data
    )
}

// 菜单管理-修改
export function updateMenu(data) {
    return request.post('/v1/sysMenu/edit', data)
}


// 角色管理-列表
export function getRoleList(data) {
    return request.post('/v1/sysRole/page', data)
}
// 角色管理-删除
export function roleDelete(data) {
    return request.post('/v1/sysRole/delete',data)
}
// 角色管理-创建
export function createRole(data) {
    return request.post('/v1/sysRole/add', data)
}

// 角色管理-详情
export function getRoleDetail(data) {
    return request.post(`/v1/sysRole/query`,data)
}

// 角色管理-修改
export function updateRole(params) {
    return request.post('/v1/sysRole/edit', params)
}

// 部门管理-列表
export function getorgList(data) {
    return request.post('/v1/sysDepartment/list',
        data
    )
}
// 部门管理-详情
export function getorgDetail(data) {
    return request.post('/v1/sysDepartment/query', data)
}
// 部门管理-创建
export function createOrg(data) {
    return request.post('/v1/sysDepartment/add', data)
}

// 部门管理-修改
export function updateOrg(data) {
    return request.post('/v1/sysDepartment/edit', data)
}

// 部门管理-删除

export function deleteOrg(data) {
    return request.post('/v1/sysDepartment/delete', data)
}

// 后台用户-列表
export function getadminUserList(data) {
    return request.post('/v1/adminUser/page', data)
}

// 后台用户-删除
export function deleteadminUser(data) {
    return request.post('/v1/adminUser/delete', data)
}
// 后台用户-创建
export function addadminUser(data) {
    return request.post('/v1/adminUser/add', data)
}
// 后台用户-创建
export function editadminUser(data) {
    return request.post('/v1/adminUser/edit', data)
}

// 后台用户-详情
export function queryadminUser(data) {
    return request.post('/v1/adminUser/query', data)
}




















// ------

// 系统用户-修改密码
export function updatePassword(data) {
    return request.post('/system/user/update-password', data)
}

