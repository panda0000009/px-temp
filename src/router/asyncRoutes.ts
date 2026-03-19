export const allAsyncRoutes = [
    {
        alwaysShow: null,
        component: 'dashboard',
        componentName: null,
        icon: 'DashboardOutlined',
        id: 1, // 修改为唯一值
        keepAlive: true,
        name: '活动管理中心',
        parentId: 0,
        path: '/',
        type: 2,
        visible: false,
        children: [
            {
                alwaysShow: null,
                component: 'dashboard/workbench/index',
                componentName: null,
                icon: null,
                id: 1,
                keepAlive: null,
                name: '运营商-工作台',
                parentId: 2,
                path: '/workbench',
                type: 2,
                visible: false,
                children: null
            },
            {
                alwaysShow: null,
                component: 'dashboard/vendor/index',
                componentName: null,
                icon: null,
                id: 1,
                keepAlive: null,
                name: '供应商-工作台',
                parentId: 2,
                path: '/vendor',
                type: 2,
                visible: false,
                children: null
            },
            {
                alwaysShow: null,
                component: 'dashboard/monitoring/index',
                componentName: null,
                icon: null,
                id: 1,
                keepAlive: null,
                name: '实时监控',
                parentId: null,
                path: '/monitoring',
                type: 2,
                visible: false,
                children: null
            }
        ]
    },
    {
        alwaysShow: null,
        component: 'user',
        componentName: null,
        icon: 'UserOutlined',
        id: 15, // 修改为唯一值
        keepAlive: true,
        name: '账号管理',
        parentId: 0,
        path: '/user',
        type: 2,
        visible: false,
        children: [
            {
                alwaysShow: null,
                component: 'user/userList/index',
                componentName: null,
                icon: null,
                id: 1,
                keepAlive: null,
                name: '用户管理',
                parentId: 2,
                path: '/userList',
                type: 2,
                visible: false,
                children: null
            },
            {
                alwaysShow: null,
                component: 'user/permissions/index',
                componentName: null,
                icon: null,
                id: 1,
                keepAlive: null,
                name: '权限管理',
                parentId: 2,
                path: '/permissions',
                type: 2,
                visible: false,
                children: null
            },
            {
                alwaysShow: null,
                component: 'user/permisettings/index',
                componentName: null,
                icon: null,
                id: 1,
                keepAlive: null,
                name: '权限设置',
                parentId: 2,
                path: '/permisettings',
                type: 2,
                visible: false,
                children: null
            },
            {
                alwaysShow: null,
                component: 'user/menuManagement/index',
                componentName: null,
                icon: null,
                id: 1,
                keepAlive: null,
                name: '菜单管理',
                parentId: 2,
                path: '/menuManagement',
                type: 2,
                visible: false,
                children: null
            }
        ]
    }
]
