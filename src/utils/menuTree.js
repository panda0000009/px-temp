/**
 * 根据 parentId 构建排序好的菜单树
 * @param {Array} list 后端返回的一维菜单数组
 * @param {Number} rootId 根节点 id（默认 0）
 */
export function buildMenuTree(list = [], rootId = 0) {
    const map = {}
    list.forEach((i) => (map[i.id] = { ...i }))
    const tree = []
    list.forEach((i) => {
        if (i.parentId === 0) {
            tree.push(map[i.id])
        } else if (map[i.parentId]) {
            if (!map[i.parentId].children) map[i.parentId].children = []
            map[i.parentId].children.push(map[i.id])
        }
    })
    // 排序
    const sortTree = (arr) => {
        arr.sort((a, b) => a.rank - b.rank)
        arr.forEach((i) => i.children && sortTree(i.children))
    }
    sortTree(tree)
    return tree
}
