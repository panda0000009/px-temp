/**
 * 从原始菜单数据中根据 path 查找对应的菜单项
 * @param {Array} menus - 原始菜单数据
 * @param {String} path - 路由路径
 * @returns {Object|null} 找到的菜单项，如果没找到返回 null
 */
const findMenuByPath = (menus, path) => {
    if (!menus || !Array.isArray(menus)) return null
    
    for (const menu of menus) {
        if (menu.path === path) {
            return menu
        }
        // 如果有 children，递归查找
        if (menu.children && Array.isArray(menu.children) && menu.children.length > 0) {
            const found = findMenuByPath(menu.children, path)
            if (found) return found
        }
    }
    return null
}

/**
 * 获取当前路由对应的菜单项中，menuType 为 3（按钮）的子元素
 * @param {String} currentPath - 当前路由路径
 * @returns {Array} 按钮列表
 */
export const getCurrentRouteButtons = (currentPath) => {
    try {
        // 从 localStorage 获取原始菜单数据（包含 menuType 为 3 的按钮）
        const menus = JSON.parse(localStorage.getItem('menus')) || []
        
        // 根据当前 path 查找对应的菜单项
        const currentMenu = findMenuByPath(menus, currentPath)
        
        if (!currentMenu || !currentMenu.children || !Array.isArray(currentMenu.children)) {
            return []
        }
        
        // 找出 menuType 为 3 的按钮
        const buttons = currentMenu.children.filter(item => item.menuType === 3)
        
        return buttons
    } catch (error) {
        console.error('获取按钮列表失败：', error)
        return []
    }
}

/**
 * 检查按钮权限标识是否存在
 * @param {String} currentPath - 当前路由路径
 * @param {String} buttonPermission - 按钮权限标识（如 'sysDepartment.add'）
 * @returns {Boolean} 如果存在返回 true，否则返回 false
 */
export const checkButtonPermission = (currentPath, buttonPermission) => {
    if (!buttonPermission) return false
    
    const buttons = getCurrentRouteButtons(currentPath)
    
    // 检查按钮权限标识是否存在于按钮列表中
    // 按钮的权限标识可能存储在 path（当 menuType 为 3 时，path 存储的是按钮标识）或 permission 字段中
    return buttons.some(button => {
        // 优先检查 path 字段（按钮标识），然后检查 permission 字段
        return button.path === buttonPermission || 
               button.permission === buttonPermission
    })
}

