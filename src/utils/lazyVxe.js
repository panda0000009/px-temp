// 导入组件
import { VxeUI, VxeIcon, VxeLoading, VxeModal, VxePager, VxeTooltip } from 'vxe-pc-ui'

import { VxeTable, VxeColumn, VxeColgroup, VxeGrid, VxeToolbar } from 'vxe-table'

// 导入主题变量，也可以重写主题变量
import 'vxe-table/styles/cssvar.scss'
import 'vxe-pc-ui/styles/all.scss'

// 导入默认的语言
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'

VxeUI.setI18n('zh-CN', zhCN)
VxeUI.setLanguage('zh-CN')

// 设置全局默认参数
VxeUI.setConfig({
    table: {
        border: true,
        showOverflow: true
    },
    modal: {
        mask: true,
        showFooter: true,
        lockView: true,
        transfer: true,
        escClosable: true,
        destroyOnClose: true
    }
})

// 可选组件
export function lazyVxeUI(app) {
    app.component('VxeIcon', VxeIcon)
    app.component('VxeLoading', VxeLoading)
    app.component('VxeModal', VxeModal)
    app.component('VxePager', VxePager)
    app.component('VxeTooltip', VxeTooltip)
}

export function lazyVxeTable(app) {
    app.component('VxeTable', VxeTable)
    app.component('VxeColumn', VxeColumn)
    app.component('VxeColgroup', VxeColgroup)
    app.component('VxeGrid', VxeGrid)
    app.component('VxeToolbar', VxeToolbar)
}
