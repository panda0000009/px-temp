<template>
    <div class="default-table">
        <vxe-table
            :id="tableId"
            :key="tableRenderKey"
            ref="tableRef"
            :data="tableDataShow"
            :loading="loading"
            :class="tableClassList"
            :column-config="{ resizable: true }"
            :max-height="maxHeight"
            :empty-text="emptyText"
            :stripe="stripe && !treeConfig"
            :row-config="rowConfig"
            :row-drag-config="rowDragConfig"
            :checkbox-config="checkboxConfig"
            :tree-config="treeConfig"
            :header-cell-style="headerCellStyleMethod"
            :row-class-name="getRowClassName"
            :span-method="spanMergeMethod"
            @checkbox-change="handleSelectionChange"
            @checkbox-all="handleSelectionChange"
            @sort-change="handleSortChange"
            @cell-click="handleCellClick"
            @toggle-tree-expand="handleTreeExpand"
            @row-dragend="handleRowDragEnd"
        >
            <!-- 拖拽排序句柄列 -->
            <vxe-column
                v-if="tableDraggable"
                width="38"
                align="center"
                :fixed="leftActionFixed"
                :drag-sort="true"
                class-name="default-table__drag-column"
            >
                <template #default>
                    <span class="default-table__drag-handle">::</span>
                </template>
            </vxe-column>

            <!-- 多选框列 -->
            <vxe-column
                v-if="tableSelectAbled"
                type="checkbox"
                title="选择"
                width="56"
                align="center"
                :fixed="leftActionFixed"
            />

            <!-- 固定序号列 -->
            <vxe-column
                v-if="showSerialNumber"
                type="seq"
                title="#"
                width="56"
                align="center"
                :fixed="leftActionFixed"
            />

            <!-- 自定义复选框列 -->
            <vxe-column
                v-if="showCustomCheckbox"
                title="选择"
                width="56"
                align="center"
                :fixed="leftActionFixed"
            >
                <template #header>
                    <input
                        type="checkbox"
                        :checked="customCheckbox.checkAllValue"
                        :disabled="customCheckbox.checkAllItem.disabled"
                    />
                </template>
                <template #default="{ row }">
                    <input
                        type="checkbox"
                        :checked="Boolean(row[customCheckbox.checkItem.field])"
                        :disabled="isCustomCheckboxDisabled(row)"
                        @change="handleCustomCheckboxChange(row, $event)"
                    />
                </template>
            </vxe-column>

            <!-- 左侧操作列 -->
            <vxe-column
                v-if="showLeftActionColumn"
                title="操作"
                :width="buttonColumnWidth"
                min-width="120"
                align="center"
                :fixed="leftActionFixed"
            >
                <template #default="{ row, rowIndex }">
                    <slot
                        name="action-left"
                        :row="row"
                        :row-index="rowIndex"
                        :buttons="normalizedButtonList"
                    >
                        <div class="default-table__actions">
                            <a-button
                                v-for="(button, index) in getVisibleButtons(row, rowIndex)"
                                :key="`${button.label || 'action'}-${index}`"
                                :type="button.type || 'link'"
                                :danger="Boolean(button.danger)"
                                :size="button.size || 'small'"
                                :disabled="isButtonDisabled(button, row, rowIndex)"
                                @click.stop="handleButtonClick(button, row, rowIndex)"
                            >
                                {{ button.label }}
                            </a-button>
                        </div>
                    </slot>
                </template>
            </vxe-column>

            <!-- 通过 tableItems 渲染的业务字段列 -->
            <template v-for="(item, key) in normalizedTableItems" :key="`${item.field || 'column'}-${key}`">
                <vxe-column
                    v-if="checkColumnShow(item)"
                    :field="item.field"
                    :title="item.label"
                    :width="item.width"
                    :min-width="item.minWidth"
                    :sortable="item.sortable"
                    :align="item.align"
                    :header-align="item.align"
                    :fixed="item.fixed"
                    :show-overflow="item.showOverflowTooltip === false ? false : true"
                >
                    <template #header>
                        <slot :name="`header-${item.field}`" :item="item">
                            <span v-html="item.label"></span>
                        </slot>
                    </template>
                    <template #default="{ row, rowIndex }">
                        <slot
                            :name="`cell-${item.field}`"
                            :item="item"
                            :row="row"
                            :row-index="rowIndex"
                            :value="row[item.field]"
                        >
                            <component
                                :is="resolveCellComponent(item, row)"
                                v-if="resolveCellComponent(item, row)"
                                :ref="(instance) => setCellComponentRef(item.field, rowIndex, instance)"
                                :model-value="row[item.field]"
                                :value="row[item.field]"
                                :data="item"
                                :row-data="row"
                                :validate="item.validate"
                                @update:modelValue="(value) => updateCellValue(row, item.field, value)"
                                @update:value="(value) => updateCellValue(row, item.field, value)"
                                @change="(value) => handleCompatibleChange(row, item.field, value)"
                            />
                            <template v-else-if="isImageType(item)">
                                <div class="default-table__images">
                                    <img
                                        v-for="(src, imageIndex) in getImageList(row[item.field])"
                                        :key="`${item.field || 'image'}-${imageIndex}`"
                                        :src="src"
                                        :alt="item.label || item.field"
                                        :width="item.imageWidth"
                                        :height="item.imageHeight"
                                    />
                                </div>
                            </template>
                            <span v-else>{{ formatCellValue(item, row) }}</span>
                        </slot>
                    </template>
                </vxe-column>
            </template>

            <!-- 预留给外部扩展的自定义列插槽 -->
            <slot name="table-content-column"></slot>

            <!-- 二级表头列 -->
            <template v-for="(group, groupIndex) in multiTableItems" :key="`group-${groupIndex}`">
                <vxe-colgroup
                    :title="group.label"
                    :width="group.width"
                    :min-width="group.minWidth"
                    :align="group.align"
                    :header-align="group.align"
                >
                    <template
                        v-for="(item, itemIndex) in group.tableItems || []"
                        :key="`${groupIndex}-${item.field || 'column'}-${itemIndex}`"
                    >
                        <vxe-column
                            v-if="checkColumnShow(item)"
                            :field="item.field"
                            :title="item.label"
                            :width="item.width"
                            :min-width="item.minWidth"
                            :sortable="item.sortable"
                            :align="item.align"
                            :header-align="item.align"
                            :fixed="item.fixed"
                            :show-overflow="item.showOverflowTooltip === false ? false : true"
                        >
                            <template #header>
                                <slot :name="`header-${item.field}`" :item="item">
                                    <span v-html="item.label"></span>
                                </slot>
                            </template>
                            <template #default="{ row, rowIndex }">
                                <slot
                                    :name="`cell-${item.field}`"
                                    :item="item"
                                    :row="row"
                                    :row-index="rowIndex"
                                    :value="row[item.field]"
                                >
                                    <component
                                        :is="resolveCellComponent(item, row)"
                                        v-if="resolveCellComponent(item, row)"
                                        :ref="(instance) => setCellComponentRef(item.field, rowIndex, instance)"
                                        :model-value="row[item.field]"
                                        :value="row[item.field]"
                                        :data="item"
                                        :row-data="row"
                                        :validate="item.validate"
                                        @update:modelValue="(value) => updateCellValue(row, item.field, value)"
                                        @update:value="(value) => updateCellValue(row, item.field, value)"
                                        @change="(value) => handleCompatibleChange(row, item.field, value)"
                                    />
                                    <template v-else-if="isImageType(item)">
                                        <div class="default-table__images">
                                            <img
                                                v-for="(src, imageIndex) in getImageList(row[item.field])"
                                                :key="`${item.field || 'image'}-${imageIndex}`"
                                                :src="src"
                                                :alt="item.label || item.field"
                                                :width="item.imageWidth"
                                                :height="item.imageHeight"
                                            />
                                        </div>
                                    </template>
                                    <span v-else>{{ formatCellValue(item, row) }}</span>
                                </slot>
                            </template>
                        </vxe-column>
                    </template>
                </vxe-colgroup>
            </template>

            <!-- 右侧操作列 -->
            <vxe-column
                v-if="showRightActionColumn"
                title="操作"
                :width="buttonColumnWidth"
                min-width="120"
                align="center"
                :fixed="rightActionFixed"
            >
                <template #default="{ row, rowIndex }">
                    <slot
                        name="action-right"
                        :row="row"
                        :row-index="rowIndex"
                        :buttons="normalizedButtonList"
                    >
                        <div class="default-table__actions">
                            <a-button
                                v-for="(button, index) in getVisibleButtons(row, rowIndex)"
                                :key="`${button.label || 'action'}-${index}`"
                                :type="button.type || 'link'"
                                :danger="Boolean(button.danger)"
                                :size="button.size || 'small'"
                                :disabled="isButtonDisabled(button, row, rowIndex)"
                                @click.stop="handleButtonClick(button, row, rowIndex)"
                            >
                                {{ button.label }}
                            </a-button>
                        </div>
                    </slot>
                </template>
            </vxe-column>

            <template #empty>
                <slot name="empty">
                    <span>{{ emptyText }}</span>
                </slot>
            </template>
        </vxe-table>

        <!-- 分页组件 -->
        <div v-if="showPagination" class="default-table__pagination">
            <Pager
                v-model:current="tablePageState.pageNumber"
                v-model:pageSize="tablePageState.pageSize"
                :page-sizes="tablePageState.sizes"
                :total="tablePageState.total"
                @onChange="handlePagerChange"
            />
        </div>
    </div>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'

import Pager from '@/components/Pager/index.vue'

const DEFAULT_PAGE = {
    layout: 'total, prev, pager, next, sizes, jumper',
    sizes: [10, 20, 50],
    pageSize: 10,
    pageNumber: 1,
    total: 0
}

const SMALL_TABLE_HEIGHT = {
    headHeight: 40,
    lineHeight: 40
}

const DEFAULT_TABLE_HEIGHT = {
    headHeight: 45,
    lineHeight: 45
}

const isSet = (value) => value !== undefined && value !== null && value !== ''

const isFunction = (value) => typeof value === 'function'

const isString = (value) => typeof value === 'string'

const jsonClone = (value) => JSON.parse(JSON.stringify(value))

const paginateTableData = (tableData, frontendPagination, tablePage = {}) => {
    if (!frontendPagination) {
        return tableData
    }

    const pageSize = Number(tablePage.pageSize || DEFAULT_PAGE.pageSize)
    const pageNumber = Number(tablePage.pageNumber || DEFAULT_PAGE.pageNumber)
    const start = Math.max(pageNumber - 1, 0) * pageSize

    return tableData.slice(start, start + pageSize)
}

const normalizeTableStyle = (tableStyle = {}) => {
    const tableSize = tableStyle.tableSize || 'size-default'
    const sizeMeta = tableSize === 'size-small' ? SMALL_TABLE_HEIGHT : DEFAULT_TABLE_HEIGHT

    return {
        style: {
            maxLine: tableStyle.maxLine ? Number.parseInt(tableStyle.maxLine, 10) : 0,
            tableSize,
            buttonPlace: tableStyle.buttonPlace || 'left',
            buttonWrapWidth: Number.parseInt(tableStyle.buttonWrapWidth, 10) || 0,
            fixedHeight: Boolean(tableStyle.fixedHeight),
            showVerticalBorder: Boolean(tableStyle.showVerticalBorder)
        },
        headHeight: sizeMeta.headHeight,
        lineHeight: sizeMeta.lineHeight
    }
}

const normalizeTablePage = (tablePage = {}, frontendPagination = false, tableDataLength = 0) => {
    const nextPage = Object.assign({}, DEFAULT_PAGE, tablePage)

    if (frontendPagination) {
        nextPage.total = tableDataLength
    }

    if (nextPage.total > 0) {
        const maxPage = Math.floor((nextPage.total - 1) / nextPage.pageSize) + 1
        nextPage.pageNumber = Math.min(nextPage.pageNumber, maxPage)
    }

    return nextPage
}

const buildAutoMergeMatrix = (tableData = [], tableItems = [], hasStandardMergeField = false) => {
    const autoMergeItemList = tableItems.reduce((list, item, index) => {
        if (!item?.autoMerge) {
            return list
        }

        const prevMergeItem = [...tableItems]
            .slice(0, index)
            .reverse()
            .find((current) => current?.autoMerge)

        list.push({
            field: item.field,
            lastMergeField: prevMergeItem?.field || '',
            isMergeStandardField: Boolean(item.isMergeStandardField)
        })
        return list
    }, [])

    if (!autoMergeItemList.length || !tableData.length) {
        return []
    }

    const currentFieldCache = {}
    const mergeMatrix = tableData.map((row) => {
        const rowMergeMeta = []

        autoMergeItemList.forEach((item) => {
            const value = row[item.field]
            const currentMeta = {
                value,
                field: item.field,
                rowspan: 1,
                colspan: 1,
                isMergeStandardField: item.isMergeStandardField
            }
            const previousMeta = currentFieldCache[item.field]

            if (previousMeta && previousMeta.value === value) {
                if (item.lastMergeField) {
                    const parentMeta = rowMergeMeta.find((meta) => meta.field === item.lastMergeField)
                    if (parentMeta?.rowspan === 0) {
                        previousMeta.rowspan += 1
                        currentMeta.rowspan = 0
                    } else {
                        currentFieldCache[item.field] = currentMeta
                    }
                } else {
                    previousMeta.rowspan += 1
                    currentMeta.rowspan = 0
                }
            } else {
                currentFieldCache[item.field] = currentMeta
            }

            rowMergeMeta.push(currentMeta)
        })

        return rowMergeMeta
    })

    if (hasStandardMergeField) {
        mergeMatrix.forEach((rowMergeMeta) => {
            const standardMeta = rowMergeMeta.find((item) => item.isMergeStandardField)
            if (!standardMeta) {
                return
            }

            rowMergeMeta.forEach((item) => {
                item.rowspan = standardMeta.rowspan
            })
        })
    }

    return mergeMatrix
}

const computeUpdatedRows = (tableData = [], tableDataBackup = [], tableItems = [], fieldList) => {
    if (!tableData.length || !tableDataBackup.length) {
        return []
    }

    const targetFields = isString(fieldList) ? [fieldList] : fieldList
    const changedRows = []

    tableData.forEach((row, index) => {
        const backupRow = tableDataBackup[index]
        if (!backupRow) {
            changedRows.push(row)
            return
        }

        const hasChanged = tableItems.some((item) => {
            if (!item?.field) {
                return false
            }

            if (targetFields?.length && !targetFields.includes(item.field)) {
                return false
            }

            return row[item.field] !== backupRow[item.field]
        })

        if (hasChanged) {
            changedRows.push(row)
        }
    })

    return changedRows
}

defineOptions({
    name: 'default-table'
})

// 组件入参，尽量兼容旧版 default-table 的配置方式
const props = defineProps({
    loading: { type: Boolean, default: false },
    tableType: { type: String, default: 'default' },
    tableData: { type: Array, default: () => [] },
    tableItems: { type: Array, default: () => [] },
    tableStyle: { type: Object, default: () => ({}) },
    tableButtonList: { type: Array, default: () => [] },
    tablePage: { type: Object, default: () => ({}) },
    tableSelectAbled: { type: Boolean, default: false },
    lineSelectAbled: { type: Function, default: null },
    lineClassName: { type: Function, default: null },
    showCustomCheckbox: { type: Boolean, default: false },
    showButtonColumn: { type: Boolean, default: true },
    showSerialNumber: { type: Boolean, default: false },
    showPagination: { type: Boolean, default: true },
    frontendPagination: { type: Boolean, default: false },
    emptyText: { type: String, default: '暂无数据' },
    itemEmptyText: { type: String, default: '-' },
    tableDraggable: { type: Boolean, default: false },
    rowKey: { type: String, default: '' },
    doSpanMerge: { type: Function, default: null },
    doHeaderCellMerge: { type: Function, default: null },
    children: { type: String, default: '' },
    hasChildren: { type: String, default: '' },
    onDraggableEnd: { type: Function, default: null },
    load: { type: Function, default: null },
    lazy: { type: Boolean, default: false },
    expandChange: { type: Function, default: () => {} },
    multiTableItems: { type: Array, default: () => [] },
    useMaxHeight: { type: Boolean, default: true },
    onRowClick: { type: Function, default: () => {} },
    stripe: { type: Boolean, default: true },
    reserveSelection: { type: Boolean, default: false },
    functionBarFixed: { type: Boolean, default: false },
    hasStandardMergeField: { type: Boolean, default: false }
})

const emit = defineEmits([
    'action-click',
    'custom-checkbox-select',
    'draggable-end',
    'expand-change',
    'get-data-list',
    'line-select-change',
    'row-click',
    'sort-change',
    'update:tablePage'
])

// table 基础引用与局部状态
const tableId = `table_${Math.random().toString(36).slice(2, 10)}`
const tableRef = ref(null)
const tableRenderKey = ref(0)
const tableDataBackup = ref([])
const selectionList = ref([])
const componentRefMap = reactive({})
const headHeight = ref(45)
const lineHeight = ref(45)
const styleState = reactive({
    maxLine: 0,
    tableSize: 'size-default',
    buttonPlace: 'left',
    buttonWrapWidth: 0,
    fixedHeight: false,
    showVerticalBorder: false
})
const tablePageState = reactive({
    layout: 'total, prev, pager, next, sizes, jumper',
    sizes: [10, 20, 50],
    pageSize: 10,
    pageNumber: 1,
    total: 0
})
const customCheckbox = reactive({
    checkAllValue: false,
    checkAllItem: {
        disabled: true
    },
    checkItem: {
        field: '_isChecked'
    }
})

// 同步并标准化 table 样式配置
const syncTableStyleState = () => {
    const nextStyle = normalizeTableStyle(props.tableStyle)
    Object.assign(styleState, nextStyle.style)
    headHeight.value = nextStyle.headHeight
    lineHeight.value = nextStyle.lineHeight
}

// 同步并标准化分页配置
const syncTablePageState = () => {
    const nextPage = normalizeTablePage(props.tablePage, props.frontendPagination, props.tableData.length)
    Object.assign(tablePageState, nextPage)
}

// 将内部分页状态回写给父级传入对象，同时发出更新事件
const syncPageToParent = () => {
    if (props.tablePage && typeof props.tablePage === 'object') {
        props.tablePage.layout = tablePageState.layout
        props.tablePage.sizes = tablePageState.sizes
        props.tablePage.pageSize = tablePageState.pageSize
        props.tablePage.pageNumber = tablePageState.pageNumber
        props.tablePage.total = tablePageState.total
    }
    emit('update:tablePage', { ...tablePageState })
}

// 初始化自定义复选框字段，避免行数据缺少选中标记
const syncCustomCheckboxRows = (rows = []) => {
    if (!props.showCustomCheckbox) {
        return
    }

    rows.forEach((row) => {
        if (!isSet(row[customCheckbox.checkItem.field])) {
            row[customCheckbox.checkItem.field] = false
        }
    })

    customCheckbox.checkAllValue = rows.length > 0 && rows.every((row) => Boolean(row[customCheckbox.checkItem.field]))
}

// 监听样式配置变化
watch(
    () => props.tableStyle,
    () => {
        syncTableStyleState()
    },
    { immediate: true, deep: true }
)

// 监听分页与数据总数变化
watch(
    [() => props.tablePage, () => props.frontendPagination, () => props.tableData.length],
    () => {
        syncTablePageState()
    },
    { immediate: true, deep: true }
)

// 监听表格数据变化，保持自定义勾选状态和分页总数同步
watch(
    () => props.tableData,
    (rows) => {
        syncCustomCheckboxRows(rows)
        syncTablePageState()
    },
    { immediate: true, deep: true }
)

// 对按钮配置补充默认宽度和内边距
const normalizedButtonList = computed(() =>
    props.tableButtonList.map((button) => ({
        minWidth: 30,
        btnPadding: 10,
        ...button
    }))
)

// 对字段配置补充默认值，兼容旧版 tableItems 写法
const normalizedTableItems = computed(() =>
    props.tableItems.map((item) => {
        const nextItem = {
            ...item
        }

        if (!nextItem.type) {
            nextItem.type = 'text'
        }

        if (nextItem.type === 'image' || nextItem.type === 'image-list') {
            if (!nextItem.imageHeight) {
                nextItem.imageHeight = 36
            }
            if (!nextItem.imageWidth) {
                nextItem.imageWidth = 36
            }
        }

        if (!nextItem.emptyText) {
            nextItem.emptyText = props.itemEmptyText
        }

        if (nextItem.isRequired) {
            nextItem.validate = {
                ...(nextItem.validate || {}),
                isRequired: nextItem.isRequired
            }
        }

        return nextItem
    })
)

// reserveSelection 开启时要求存在稳定 rowKey
const resolvedRowKey = computed(() => props.rowKey || (props.reserveSelection ? 'uuid' : ''))
// 前端分页场景下只展示当前页数据
const tableDataShow = computed(() => paginateTableData(props.tableData, props.frontendPagination, tablePageState))
const tableClassList = computed(() =>
    [styleState.tableSize, styleState.showVerticalBorder ? 'default-table--vertical-border' : ''].filter(Boolean)
)

// 根据配置计算表格最大高度
const maxHeight = computed(() => {
    if (!props.useMaxHeight) {
        return undefined
    }

    if (styleState.maxLine) {
        return styleState.maxLine * lineHeight.value + headHeight.value + 12
    }

    return 578
})

// 只要存在固定字段列，就一并固定功能列
const itemHasFixed = computed(() => normalizedTableItems.value.some((item) => Boolean(item.fixed)))
const leftActionFixed = computed(() => (itemHasFixed.value || props.functionBarFixed ? 'left' : undefined))
const rightActionFixed = computed(() => (itemHasFixed.value || props.functionBarFixed ? 'right' : undefined))

const showLeftActionColumn = computed(
    () => normalizedButtonList.value.length > 0 && styleState.buttonPlace === 'left' && props.showButtonColumn
)
const showRightActionColumn = computed(
    () => normalizedButtonList.value.length > 0 && styleState.buttonPlace === 'right' && props.showButtonColumn
)

// 根据按钮数量和文案长度推导操作列宽度
const buttonColumnWidth = computed(() => {
    if (styleState.buttonWrapWidth) {
        return styleState.buttonWrapWidth
    }

    if (!normalizedButtonList.value.length) {
        return 0
    }

    const labelWidth = normalizedButtonList.value
        .map((button) => button.labelLength || button.label?.length || 0)
        .reduce((total, size) => total + size, 0)

    return 24 + normalizedButtonList.value.length * 20 + labelWidth * 12
})

// 行配置：兼容行主键、hover 和拖拽
const rowConfig = computed(() => ({
    keyField: resolvedRowKey.value || undefined,
    useKey: Boolean(resolvedRowKey.value),
    isHover: true,
    drag: props.tableDraggable
}))

// 拖拽配置：使用 vxe-table 的 cell 拖拽能力替代旧版 Sortable
const rowDragConfig = computed(() => {
    if (!props.tableDraggable) {
        return undefined
    }

    return {
        trigger: 'cell',
        showIcon: false,
        animation: true
    }
})

// 多选框配置：支持禁用某些行、保留勾选状态
const checkboxConfig = computed(() => {
    if (!props.tableSelectAbled) {
        return undefined
    }

    return {
        reserve: props.reserveSelection,
        highlight: true,
        checkMethod: props.lineSelectAbled ? ({ row }) => props.lineSelectAbled(row) : undefined
    }
})

// 树表配置：兼容 children / hasChildren / lazy / load 等旧参数
const treeConfig = computed(() => {
    if (!props.children && !props.lazy) {
        return undefined
    }

    return {
        children: props.children || 'children',
        hasChild: props.hasChildren || 'hasChildren',
        lazy: props.lazy,
        loadMethod: props.load || undefined,
        reserve: props.reserveSelection
    }
})

// 预计算自动合并单元格矩阵
const autoMergeMatrix = computed(() =>
    buildAutoMergeMatrix(props.tableData, normalizedTableItems.value, props.hasStandardMergeField)
)

// 判断字段列是否显示，兼容布尔值和函数两种写法
const checkColumnShow = (item) => {
    if (isSet(item.isShow)) {
        return isFunction(item.isShow) ? item.isShow() : item.isShow
    }

    return true
}

// 合并单元格逻辑：优先走外部自定义方法，否则走内置 autoMerge 规则
const spanMergeMethod = ({ row, column, rowIndex, columnIndex }) => {
    if (isFunction(props.doSpanMerge)) {
        return props.doSpanMerge({ row, column, rowIndex, columnIndex })
    }

    if (!autoMergeMatrix.value.length) {
        return { rowspan: 1, colspan: 1 }
    }

    const field = column.field || column.property
    const lineMergeMeta = autoMergeMatrix.value[rowIndex]
    const mergeMeta = lineMergeMeta?.find((item) => item.field === field)

    if (!mergeMeta) {
        return { rowspan: 1, colspan: 1 }
    }

    return {
        rowspan: mergeMeta.rowspan,
        colspan: mergeMeta.colspan
    }
}

// 表头样式或表头合并逻辑
const headerCellStyleMethod = ({ row, column, rowIndex, columnIndex }) => {
    if (isFunction(props.doHeaderCellMerge)) {
        return props.doHeaderCellMerge({ row, column, rowIndex, columnIndex })
    }

    return undefined
}

// 动态设置行 className，支持风险色、提示色等场景
const getRowClassName = ({ row, rowIndex }) => {
    if (props.lineClassName) {
        return props.lineClassName({ row, rowIndex })
    }

    return ''
}

// 解析当前字段所对应的渲染组件
const resolveCellComponent = (item, row) => {
    if (isFunction(item.component)) {
        return item.component(row, item)
    }

    if (isFunction(item.componentName)) {
        return item.componentName(row, item)
    }

    return item.component || item.componentName || null
}

// 更新当前单元格绑定值
const updateCellValue = (row, field, value) => {
    row[field] = value
}

// 兼容老组件 change 事件可能传原始 event 或直接传值
const handleCompatibleChange = (row, field, payload) => {
    if (payload?.target && Object.prototype.hasOwnProperty.call(payload.target, 'value')) {
        row[field] = payload.target.value
        return
    }

    row[field] = payload
}

// 文本列的默认格式化输出
const formatCellValue = (item, row) => {
    const value = row?.[item.field]

    if (isFunction(item.formatter)) {
        const formattedValue = item.formatter({
            item,
            row,
            value
        })
        return isSet(formattedValue) ? formattedValue : item.emptyText || props.itemEmptyText
    }

    if (Array.isArray(value)) {
        return value.length ? value.join(', ') : item.emptyText || props.itemEmptyText
    }

    return isSet(value) ? value : item.emptyText || props.itemEmptyText
}

// 图片列类型判断
const isImageType = (item) => item.type === 'image' || item.type === 'image-list'

// 统一把字符串/数组图片源转成数组
const getImageList = (value) => {
    if (Array.isArray(value)) {
        return value.filter(Boolean)
    }

    if (!value) {
        return []
    }

    return String(value)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
}

// 缓存每个字段在每一行上的组件实例，供外部校验调用
const setCellComponentRef = (field, rowIndex, instance) => {
    if (!field) {
        return
    }

    if (!componentRefMap[field]) {
        componentRefMap[field] = []
    }

    if (instance) {
        componentRefMap[field][rowIndex] = instance
    } else {
        delete componentRefMap[field][rowIndex]
    }
}

// 获取某一列对应的所有组件实例
const getItemComponentCloumn = (field) => {
    if (!field || !componentRefMap[field]) {
        return null
    }

    return componentRefMap[field].filter(Boolean)
}

// 获取当前表格中所有可校验的组件实例
const getItemComponentList = () =>
    normalizedTableItems.value
        .map((item) => (item.field ? getItemComponentCloumn(item.field) : null))
        .filter(Boolean)
        .flat()

// 获取当前勾选数据
const getSelection = () => tableRef.value?.getCheckboxRecords?.() || selectionList.value

// 勾选变化时，同步内部缓存并向外派发事件
const handleSelectionChange = () => {
    selectionList.value = getSelection()
    emit('line-select-change', selectionList.value)
}

// 排序变化事件
const handleSortChange = ({ column, field, order }) => {
    emit('sort-change', {
        column,
        prop: field,
        order
    })
}

// 单元格点击时，兼容旧版 row-click 用法
const handleCellClick = (params) => {
    props.onRowClick(params.row, params.column, params.$event)
    emit('row-click', params.row, params.column, params.$event)
}

// 树节点展开收起事件
const handleTreeExpand = (params) => {
    props.expandChange(params.row, params)
    emit('expand-change', params)
}

// 行拖拽结束事件，返回新旧索引
const handleRowDragEnd = (params) => {
    const { newIndex, oldIndex } = params?._index || {}

    if (isFunction(props.onDraggableEnd)) {
        props.onDraggableEnd(newIndex, oldIndex, params)
    }

    emit('draggable-end', {
        newIndex,
        oldIndex,
        params
    })
}

// 每页条数变化
const pageSizeChange = (size) => {
    tablePageState.pageNumber = 1
    tablePageState.pageSize = size
    syncPageToParent()
    emit('get-data-list')
}

// 当前页变化
const pageIndexChange = (index) => {
    tablePageState.pageNumber = index
    syncPageToParent()

    if (props.frontendPagination) {
        refreshTable()
    }

    emit('get-data-list')
}

// vxe-pager 的统一分页事件入口
const handlePagerChange = ({ currentPage, pageSize }) => {
    const sizeChanged = tablePageState.pageSize !== pageSize

    tablePageState.pageNumber = sizeChanged ? 1 : currentPage
    tablePageState.pageSize = pageSize
    syncPageToParent()

    if (props.frontendPagination) {
        refreshTable()
    }

    emit('get-data-list')
}

// 判断某个操作按钮是否显示
const isButtonVisible = (button, row, rowIndex) => {
    const visibleHandler = button.isShow ?? button.visible
    if (isFunction(visibleHandler)) {
        return visibleHandler({ row, rowIndex, button }, row, rowIndex)
    }

    if (typeof visibleHandler === 'boolean') {
        return visibleHandler
    }

    return true
}

// 获取当前行真正需要展示的按钮列表
const getVisibleButtons = (row, rowIndex) =>
    normalizedButtonList.value.filter((button) => isButtonVisible(button, row, rowIndex))

// 判断按钮是否禁用
const isButtonDisabled = (button, row, rowIndex) => {
    if (isFunction(button.disabled)) {
        return button.disabled({ row, rowIndex, button }, row, rowIndex)
    }

    return Boolean(button.disabled)
}

// 操作按钮点击事件，兼容 onClick / click / handler 三种写法
const handleButtonClick = (button, row, rowIndex) => {
    const handler = button.onClick || button.click || button.handler

    if (isFunction(handler)) {
        handler({ row, rowIndex, button }, row, rowIndex)
    }

    emit('action-click', {
        button,
        row,
        rowIndex
    })
}

// 自定义复选框禁用逻辑
const isCustomCheckboxDisabled = (row) =>
    props.lineSelectAbled ? !props.lineSelectAbled(row) : Boolean(customCheckbox.checkItem.disabled)

// 自定义复选框变化事件
const handleCustomCheckboxChange = (row, event) => {
    row[customCheckbox.checkItem.field] = event.target.checked
    syncCustomCheckboxRows(props.tableData)
    emit('custom-checkbox-select', row)
}

// 批量设置勾选行
const setSelectionList = (list, key = '', selected = true) => {
    if (!key || !Array.isArray(list) || !tableRef.value?.setCheckboxRow) {
        return
    }

    const rows = props.tableData.filter((row) => list.some((item) => row[key] === item[key]))
    if (!rows.length) {
        return
    }

    tableRef.value.setCheckboxRow(rows, selected)
    handleSelectionChange()
}

// 清空勾选
const clearSelection = () => {
    tableRef.value?.clearCheckboxRow?.()
    handleSelectionChange()
}

// 切换单行勾选
const setRowSelect = (row) => {
    tableRef.value?.toggleCheckboxRow?.(row)
    handleSelectionChange()
}

// 设置全选或取消全选
const setRowAllSelect = (selected = true) => {
    tableRef.value?.setAllCheckboxRow?.(selected)
    handleSelectionChange()
}

// 调用所有子组件的 doValidate，完成整表校验
const validateTable = async () => {
    let isValidate = true
    const itemComponentList = getItemComponentList()

    for (const component of itemComponentList) {
        if (!isFunction(component?.doValidate)) {
            continue
        }

        const { isSuccess } = await component.doValidate()
        if (isSuccess === false) {
            isValidate = false
        }
    }

    return isValidate
}

// 清除整表校验状态
const resetValidate = () => {
    getItemComponentList().forEach((component) => {
        if (isFunction(component?.clearValidateData)) {
            component.clearValidateData()
        }
    })
}

// 备份当前 tableData，供后续 diff 使用
const saveDataBackup = () => {
    tableDataBackup.value = jsonClone(props.tableData)
}

// 获取有修改的数据行
const getDataUpdate = (fieldList) =>
    computeUpdatedRows(props.tableData, tableDataBackup.value, normalizedTableItems.value, fieldList)

// 强制刷新表格渲染
const refreshTable = () => {
    tableRenderKey.value += 1
    nextTick(() => {
        tableRef.value?.recalculate?.()
    })
}

defineExpose({
    clearSelection,
    getDataUpdate,
    getItemComponentCloumn,
    getItemComponentList,
    getSelection,
    pageIndexChange,
    pageSizeChange,
    refreshTable,
    resetValidate,
    saveDataBackup,
    setRowAllSelect,
    setRowSelect,
    setSelectionList,
    validateTable
})
</script>

<style lang="scss" scoped>
$bg-red: #fff3f0;
$bg-org: #fdf5e6;
$bg-green: #f0f9eb;
$font-red: #f5222d;
$font-org: #fa8c16;
$font-green: #52c41a;

.default-table {
    width: 100%;

    &__drag-handle {
        cursor: move;
        user-select: none;
        font-size: 14px;
        line-height: 1;
        letter-spacing: 1px;
        color: #8c8c8c;
    }

    &__actions {
        display: inline-flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
    }

    &__images {
        display: inline-flex;
        align-items: center;
        gap: 8px;

        img {
            display: block;
            border-radius: 4px;
            object-fit: cover;
        }
    }

    &__pagination {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
    }

    :deep(.bg-red td) {
        background-color: $bg-red;
    }

    :deep(.bg-org td) {
        background-color: $bg-org;
    }

    :deep(.bg-green td) {
        background-color: $bg-green;
    }

    :deep(.font-red td) {
        color: $font-red;
    }

    :deep(.font-org td) {
        color: $font-org;
    }

    :deep(.font-green td) {
        color: $font-green;
    }
}
</style>
