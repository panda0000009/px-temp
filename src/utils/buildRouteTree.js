export function buildRouteTree(list, rootId = 0) {
    const map = {}
    const tree = []
    // 初始化 map
    list.forEach((item) => {
        map[item.id] = {
            id: item.id,
            parentId: item.parentId,
            path: item.route,
            name: item.name,
            icon: item.icon || null,
            rank: item.rank ?? 9999, // rank 越小越靠前
            component:
                item.parentId === 0
                    ? item.route.replace('/', '')
                    : list.find((p) => p.id === item.parentId)?.route.replace('/', '') + item.route + '/index',
            componentName: null,
            keepAlive: item.parentId === 0 ? true : null,
            visible: false,
            alwaysShow: null,
            children: []
        }
    })
    // 构建树结构
    list.forEach((item) => {
        const node = map[item.id]
        if (item.parentId === rootId) {
            tree.push(node)
        } else {
            const parent = map[item.parentId]
            if (parent) {
                parent.children.push(node)
            }
        }
    })
    // 排序（递归）
    const sortByRank = (arr) => {
        arr.sort((a, b) => a.rank - b.rank)
        arr.forEach((item) => {
            if (item.children && item.children.length) {
                sortByRank(item.children)
            }
        })
    }
    sortByRank(tree)
    return tree
}
