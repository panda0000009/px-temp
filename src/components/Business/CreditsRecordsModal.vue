<template>
    <vxe-modal :modelValue="props.value" :title="title" width="60%" @close="handleCancel">
        <template #default>
            <div class="page page--modal">
                <div class="page__header">
                    <search-bar bordered :action="false" @onSearch="handleSearch" @onReset="handleReset">
                        <template #right>
                            <search-bar-label label="交易类型">
                                <dict-select
                                    v-model:value="queryParams.tradeType"
                                    dictCode="point_trade_type"
                                    placeholder="请选择交易类型"
                                    allowClear
                                />
                            </search-bar-label>
                            <search-bar-label label="日期" width="360px">
                                <a-range-picker
                                    :value="[queryParams.pointDateBegin, queryParams.pointDateEnd]"
                                    :placeholder="['请选择开始日期', '请选择结束日期']"
                                    format="YYYY-MM-DD"
                                    value-format="YYYY-MM-DD"
                                    allowClear
                                    @change="handleTimeChange"
                                />
                            </search-bar-label>
                        </template>
                    </search-bar>
                </div>
                <div class="page__container">
                    <vxe-table height="auto" :loading="loading" :data="tableData" header-align="center" align="center">
                        <vxe-column type="seq" width="60"></vxe-column>
                        <vxe-column field="point" title="变动积分">
                            <!-- <template #default="{ row }">
                                <span :style="{ color: row.status == 0 ? '#52c43c' : '#ff4d4f' }">
                                    {{ row.status == 0 ? `+${row.point}` : `-${row.point}` }}
                                </span>
                            </template> -->
                        </vxe-column>
                        <vxe-column field="beforePoint" title="变动前积分"></vxe-column>
                        <vxe-column field="afterPoint" title="变动后积分"></vxe-column>
                        <vxe-column field="tradeType" title="交易类型"></vxe-column>
                        <vxe-column field="description" title="描述"></vxe-column>
                        <vxe-column field="pointTime" title="创建时间"></vxe-column>
                    </vxe-table>
                </div>
                <div class="page__footer">
                    <pager
                        v-model:current="pagerInfo.current"
                        v-model:pageSize="pagerInfo.pageSize"
                        :total="total"
                        @onChange="reloadData"
                    />
                </div>
            </div>
        </template>
        <template #footer>
            <a-button @click="handleCancel">关闭</a-button>
        </template>
    </vxe-modal>
</template>

<script setup>
import { computed, watch } from 'vue'
import DictSelect from '@/components/DictSelect/index.vue'
import Pager from '@/components/Pager/index.vue'
import useTable from '@/hooks/useTable'
import { queryMemberPointPage } from '@/api/userApi'

const props = defineProps({
    value: Boolean,
    data: Object
})

const title = computed(() => {
    console.log(props.data.name)
    let text = '积分记录-'
    if (props?.data) {
        text += props.data.name ? props.data.name : props.data.nickname
    }
    return text
})

const { loading, queryParams, tableData, pagerInfo, total, handleSearch, handleReset, loadData, reloadData } = useTable(
    (params) => queryMemberPointPage({ ...params, memberId: props.data.id })
)

watch(
    () => props.value,
    (value) => {
        console.log(value)
        if (value) {
            loadData()
        }
    }
)

const handleTimeChange = (dates) => {
    queryParams.value.pointDateBegin = dates ? dates[0] : undefined
    queryParams.value.pointDateEnd = dates ? dates[1] : undefined
    handleSearch()
}

const emit = defineEmits(['update:value'])
const handleCancel = () => {
    emit('update:value', false)
}
</script>

<style land="scss" scoped>
.page {
    padding: 0 10px;
}
</style>
