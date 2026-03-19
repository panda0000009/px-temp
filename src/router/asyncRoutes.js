export const allAsyncRoutes = [
    {
        alwaysShow: null,
        children: null,
        component: 'dashboard',
        componentName: null,
        icon: 'DashboardOutlined',
        id: 1, // 修改为唯一值
        keepAlive: true,
        name: '首页',
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
        component: '',
        componentName: null,
        icon: 'WalletOutlined',
        id: 10, // 修改为唯一值
        keepAlive: null,
        name: '商户管理',
        parentId: 0,
        path: '/merchant',
        type: 2,
        visible: false,
        children: [
            {
                alwaysShow: null,
                component: 'merchant/list/index',
                componentName: null,
                icon: null,
                id: 3, // 修改为唯一值
                keepAlive: null,
                name: '商户列表',
                parentId: 2,
                path: '/list',
                type: 2,
                visible: false,
                children: null
            },
            {
                alwaysShow: null,
                component: 'merchant/game/index',
                componentName: null,
                icon: null,
                id: 4, // 修改为唯一值
                keepAlive: null,
                name: '游戏列表',
                parentId: 2,
                path: '/game',
                type: 2,
                visible: false,
                children: null
            },
            {
                alwaysShow: null,
                component: 'merchant/operations/index',
                componentName: null,
                icon: null,
                id: 5, // 修改为唯一值
                keepAlive: null,
                name: '供应商管理',
                parentId: 2,
                path: '/operations',
                type: 2,
                visible: false,
                children: null
            }
        ]
    },
    {
        alwaysShow: null,
        children: null,
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
    },
    {
        alwaysShow: null,
        children: null,
        component: 'datacenter',
        componentName: null,
        icon: 'LaptopOutlined',
        id: 13, // 修改为唯一值
        keepAlive: true,
        name: '数据中心',
        parentId: 0,
        path: '/datacenter',
        type: 2,
        visible: false,
        children: [
            {
                alwaysShow: null,
                component: 'datacenter/monthlyreport/index',
                componentName: null,
                icon: null,
                id: 1,
                keepAlive: null,
                name: '运营商-月报',
                parentId: 2,
                path: '/monthlyreport',
                type: 2,
                visible: false,
                children: null
            },
            {
                alwaysShow: null,
                component: 'datacenter/weekly/index',
                componentName: null,
                icon: null,
                id: 1,
                keepAlive: null,
                name: '运营商-周报',
                parentId: 2,
                path: '/weekly',
                type: 2,
                visible: false,
                children: null
            },
            {
                alwaysShow: null,
                component: 'datacenter/vendor-monthly/index',
                componentName: null,
                icon: null,
                id: 1,
                keepAlive: null,
                name: '供应商-月报',
                parentId: 2,
                path: '/vendor-monthly',
                type: 2,
                visible: false,
                children: null
            },
            {
                alwaysShow: null,
                component: 'datacenter/vendor-weekly/index',
                componentName: null,
                icon: null,
                id: 1,
                keepAlive: null,
                name: '供应商-周报',
                parentId: 2,
                path: '/vendor-weekly',
                type: 2,
                visible: false,
                children: null
            },
            {
                alwaysShow: null,
                component: 'datacenter/dataquery/index',
                componentName: null,
                icon: null,
                id: 3, // 修改为唯一值
                keepAlive: null,
                name: '数据查询',
                parentId: 2,
                path: '/dataquery',
                type: 2,
                visible: false,
                children: null
            },
            {
                alwaysShow: null,
                component: 'datacenter/gm-order/index',
                componentName: null,
                icon: null,
                id: 3, // 修改为唯一值
                keepAlive: null,
                name: 'GM命令',
                parentId: 2,
                path: '/gm-order',
                type: 2,
                visible: false,
                children: null
            }
        ]
    },
    {
        alwaysShow: null,
        children: null,
        component: 'financial',
        componentName: null,
        icon: 'MoneyCollectOutlined',
        id: 1, // 修改为唯一值
        keepAlive: true,
        name: '财务对账',
        parentId: 0,
        path: '/financial',
        type: 2,
        visible: false,
        children: [
            {
                alwaysShow: null,
                component: 'financial/reconciliation/index',
                componentName: null,
                icon: null,
                id: 3, // 修改为唯一值
                keepAlive: null,
                name: '对账',
                parentId: 2,
                path: '/reconciliation',
                type: 2,
                visible: false,
                children: null
            },
            {
                alwaysShow: null,
                component: 'financial/rate/index',
                componentName: null,
                icon: null,
                id: 6, // 修改为唯一值
                keepAlive: null,
                name: '汇率列表',
                parentId: null,
                path: '/rate',
                type: 2,
                visible: false,
                children: null
            }
        ]
    },
    {
        alwaysShow: null,
        component: '',
        componentName: null,
        icon: 'SettingOutlined',
        id: 10, // 修改为唯一值
        keepAlive: null,
        name: '风控设置',
        parentId: 0,
        path: '/riskControl',
        type: 2,
        visible: false,
        children: [
            {
                alwaysShow: null,
                component: 'riskControl/earlyWarning/index',
                componentName: null,
                icon: null,
                id: 3, // 修改为唯一值
                keepAlive: null,
                name: '预警设置',
                parentId: 2,
                path: '/earlyWarning',
                type: 2,
                visible: false,
                children: null
            }
        ]
    }
]
