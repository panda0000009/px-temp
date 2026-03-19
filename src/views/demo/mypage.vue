<template>
    <div class="mypage">
        <a-card title="MyPage 组合示例" class="mypage__card">
            <PageBox ref="searchBoxRef">
                <PageBoxTitle
                    title="查询条件"
                    subtitle="演示 default-form 与 page-box/page-box-title 的组合"
                    :is-foldable="true"
                    :page-box-ref="searchBoxRef"
                    :button-list="searchTitleButtonList"
                />

                <div class="mypage__box-content">
                    <DefaultForm
                        ref="formRef"
                        form-type="search"
                        :form-data="searchFormData"
                        :form-items="searchFormItems"
                        :form-style="{ itemSpan: 8, itemGutter: 20, labelWidth: 96 }"
                    />
                </div>
            </PageBox>

            <PageBox>
                <PageBoxTitle
                    title="数据列表"
                    subtitle="演示 default-table 与标题按钮联动"
                    :button-list="tableTitleButtonList"
                    :title-button-row-data="{ selectedCount }"
                    :is-strong-title="true"
                    :has-color="true"
                />
                <div class="mypage__box-content">
                    <DefaultTable
                        ref="tableRef"
                        :table-data="tableData"
                        :table-items="tableItems"
                        :table-button-list="tableButtonList"
                        :table-page="tablePage"
                        :table-select-abled="true"
                        :show-serial-number="true"
                        :frontend-pagination="true"
                        :reserve-selection="true"
                        row-key="uuid"
                        @line-select-change="handleSelectionChange"
                        @update:tablePage="handleTablePageChange"
                    />
                </div>
            </PageBox>

            <a-divider />

            <div class="mypage__state-grid">
                <div class="mypage__state-card">
                    <h4>当前表单值</h4>
                    <pre>{{ searchFormData }}</pre>
                </div>
                <div class="mypage__state-card">
                    <h4>最近一次保存条件</h4>
                    <pre>{{ savedSearchData }}</pre>
                </div>
                <div class="mypage__state-card">
                    <h4>当前选中信息</h4>
                    <pre>{{ { selectedCount, selectedIds } }}</pre>
                </div>
            </div>
        </a-card>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'

import DefaultForm from '@/components/common/default-form.vue'
import DefaultTable from '@/components/common/default-table.vue'
import PageBox from '@/components/common/page-box.vue'
import PageBoxTitle from '@/components/common/page-box-title.vue'

const formRef = ref(null)
const searchBoxRef = ref(null)
const tableRef = ref(null)
const savedSearchData = ref({})
const selectedRows = ref([])

const searchFormData = reactive({
    keyword: '',
    status: undefined,
    createdRange: [],
    enabledOnly: false,
    advancedRemark: ''
})

const tablePage = reactive({
    pageNumber: 1,
    pageSize: 5
})

const statusOptions = [
    { label: '启用', value: 'enabled' },
    { label: '停用', value: 'disabled' },
    { label: '草稿', value: 'draft' }
]

const sourceTableData = ref(createMockData())
const tableData = ref([...sourceTableData.value])

const searchFormItems = computed(() => [
    {
        label: '关键词',
        field: 'keyword',
        type: 'input',
        clearable: true,
        itemMsg: '支持按名称、负责人或备注做模糊筛选。'
    },
    {
        label: '状态',
        field: 'status',
        type: 'select',
        options: statusOptions,
        clearable: true
    },
    {
        label: '日期范围',
        field: 'createdRange',
        type: 'date-picker',
        isRange: true,
        valueFormat: 'YYYY-MM-DD',
        span: 12
    },
    {
        label: '仅看启用',
        field: 'enabledOnly',
        type: 'switch',
        span: 12,
        itemMsg: '开启后会显示高级备注筛选字段。'
    },
    {
        label: '高级备注',
        field: 'advancedRemark',
        type: 'input',
        clearable: true,
        span: 12,
        isShow: () => Boolean(searchFormData.enabledOnly)
    }
])

const tableItems = [
    {
        label: '名称',
        field: 'name',
        minWidth: 180
    },
    {
        label: '分类',
        field: 'category',
        width: 120
    },
    {
        label: '状态',
        field: 'status',
        width: 100,
        formatter: ({ value }) => formatStatus(value)
    },
    {
        label: '创建时间',
        field: 'createdAt',
        width: 140
    },
    {
        label: '负责人',
        field: 'owner',
        width: 120
    },
    {
        label: '备注',
        field: 'remark',
        minWidth: 220
    }
]

const tableButtonList = [
    {
        label: '查看',
        type: 'link',
        onClick: ({ row }) => {
            message.info(`查看记录：${row.name}`)
        }
    },
    {
        label: '切换状态',
        type: 'link',
        onClick: ({ row }) => {
            row.status = nextStatus(row.status)
            message.success(`${row.name} 已切换为${formatStatus(row.status)}`)
            tableRef.value?.refreshTable?.()
        }
    }
]

const selectedCount = computed(() => selectedRows.value.length)
const selectedIds = computed(() => selectedRows.value.map((item) => item.uuid))

const searchTitleButtonList = [
    {
        label: '查询',
        type: 'primary',
        function: async () => {
            await handleSearch()
        }
    },
    {
        label: '重置',
        function: () => {
            handleReset()
        }
    },
    {
        label: '读取已保存条件',
        function: () => {
            handleReadSavedSearch()
        }
    }
]

const tableTitleButtonList = [
    {
        label: '新增',
        type: 'primary',
        float: 'left',
        function: () => {
            handleAddRow()
        }
    },
    {
        label: '删除所选',
        danger: true,
        disabled: () => selectedCount.value === 0,
        function: () => {
            handleDeleteSelected()
        }
    },
    {
        label: '刷新 mock 数据',
        function: () => {
            handleRefreshMockData()
        }
    }
]

function createMockData() {
    return [
        createRow(1, '活动报名配置', '活动', 'enabled', '2026-03-01', '张琳', '春季活动首发'),
        createRow(2, '首页频道推荐', '内容', 'disabled', '2026-03-04', '王敏', '首页运营位下线'),
        createRow(3, '会员权益升级', '会员', 'draft', '2026-03-07', '刘洋', '待确认权益文案'),
        createRow(4, '门店海报投放', '营销', 'enabled', '2026-03-10', '赵宁', '线下渠道同步投放'),
        createRow(5, '积分商城改版', '会员', 'enabled', '2026-03-12', '陈可', '改版灰度中'),
        createRow(6, '内容专题页', '内容', 'draft', '2026-03-14', '高远', '专题头图待替换'),
        createRow(7, '秒杀场次配置', '活动', 'disabled', '2026-03-16', '韩旭', '依赖库存校验'),
        createRow(8, '商户权益展示', '营销', 'enabled', '2026-03-18', '周璇', '支持多端同步')
    ]
}

function createRow(index, name, category, status, createdAt, owner, remark) {
    return {
        uuid: `mock-row-${index}`,
        name,
        category,
        status,
        createdAt,
        owner,
        remark
    }
}

function formatStatus(status) {
    if (status === 'enabled') {
        return '启用'
    }
    if (status === 'disabled') {
        return '停用'
    }
    if (status === 'draft') {
        return '草稿'
    }
    return '-'
}

function nextStatus(status) {
    if (status === 'enabled') {
        return 'disabled'
    }
    if (status === 'disabled') {
        return 'draft'
    }
    return 'enabled'
}

function applyFilters(filters = searchFormData) {
    const keyword = String(filters.keyword || '')
        .trim()
        .toLowerCase()
    const remarkKeyword = String(filters.advancedRemark || '')
        .trim()
        .toLowerCase()
    const [startDate, endDate] = Array.isArray(filters.createdRange) ? filters.createdRange : []

    tableData.value = sourceTableData.value.filter((row) => {
        const matchesKeyword =
            !keyword ||
            [row.name, row.owner, row.remark]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(keyword))

        const matchesStatus = !filters.status || row.status === filters.status
        const matchesEnabled = !filters.enabledOnly || row.status === 'enabled'
        const matchesRemark = !remarkKeyword || String(row.remark || '').toLowerCase().includes(remarkKeyword)
        const matchesDate =
            !startDate ||
            !endDate ||
            (!dayjs(row.createdAt).isBefore(dayjs(startDate), 'day') &&
                !dayjs(row.createdAt).isAfter(dayjs(endDate), 'day'))

        return matchesKeyword && matchesStatus && matchesEnabled && matchesRemark && matchesDate
    })

    selectedRows.value = []
    tablePage.pageNumber = 1
    tableRef.value?.clearSelection?.()
    tableRef.value?.refreshTable?.()
}

async function handleSearch() {
    const valid = await formRef.value?.validateForm?.()

    if (!valid) {
        message.error('查询条件校验未通过')
        return
    }

    formRef.value?.saveSearchData?.(searchFormData)
    savedSearchData.value = formRef.value?.getSearchData?.() || {}
    applyFilters(searchFormData)
    message.success(`查询完成，共匹配 ${tableData.value.length} 条数据`)
}

function handleReset() {
    formRef.value?.resetForm?.()
    applyFilters(searchFormData)
    message.info('查询条件已重置')
}

function handleReadSavedSearch() {
    savedSearchData.value = formRef.value?.getSearchData?.() || {}
    message.info(`最近一次保存条件包含 ${Object.keys(savedSearchData.value).length} 个字段`)
}

function handleAddRow() {
    const nextIndex = sourceTableData.value.length + 1
    const today = dayjs().format('YYYY-MM-DD')
    const nextRow = createRow(nextIndex, `新增示例-${nextIndex}`, '活动', 'draft', today, '系统演示', '由标题栏按钮新增')

    sourceTableData.value = [nextRow, ...sourceTableData.value]
    applyFilters(searchFormData)
    message.success('已新增一条 mock 数据')
}

function handleDeleteSelected() {
    const selection = tableRef.value?.getSelection?.() || selectedRows.value

    if (!selection.length) {
        message.warning('请先勾选要删除的记录')
        return
    }

    const selectedUuidSet = new Set(selection.map((item) => item.uuid))
    sourceTableData.value = sourceTableData.value.filter((item) => !selectedUuidSet.has(item.uuid))
    applyFilters(searchFormData)
    message.success(`已删除 ${selection.length} 条记录`)
}

function handleRefreshMockData() {
    sourceTableData.value = createMockData()
    applyFilters(searchFormData)
    message.success('mock 数据已刷新')
}

function handleSelectionChange(list) {
    selectedRows.value = Array.isArray(list) ? list : []
}

function handleTablePageChange(nextPage) {
    Object.assign(tablePage, nextPage)
}
</script>

<style lang="scss" scoped>
.mypage {
    &__card {
        border-radius: 12px;
    }

    &__box-content {
        padding: 16px 18px 20px;
    }

    &__state-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
    }

    &__state-card {
        padding: 16px;
        border-radius: 12px;
        background: linear-gradient(180deg, #fafcff 0%, #f5f8ff 100%);
        border: 1px solid #e6ebf5;

        h4 {
            margin: 0 0 12px;
            font-size: 15px;
            color: #1f1f1f;
        }

        pre {
            margin: 0;
            white-space: pre-wrap;
            word-break: break-word;
            color: #445;
            font-size: 13px;
            line-height: 1.7;
        }
    }
}
</style>
