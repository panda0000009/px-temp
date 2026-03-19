<template>
    <vxe-modal :modelValue="props.value" :title="title" width="60%" @close="handleCancel">
        <template #default>
            <div class="page page--modal">
                <div class="page__header">
                    <search-bar bordered :action="false" @onSearch="handleSearch" @onReset="handleReset">
                        <template #right>
                            <search-bar-label label="状态">
                                <dict-select
                                    v-model:value="queryParams.status"
                                    dictCode="withdraw_status"
                                    placeholder="状态"
                                />
                            </search-bar-label>
                            <search-bar-label label="日期" width="360px">
                                <a-range-picker
                                    :value="[queryParams.withdrawDateBegin, queryParams.withdrawDateEnd]"
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
                        <vxe-column field="price" title="提现金额(元)"></vxe-column>
                        <vxe-column field="type" title="提现方式"></vxe-column>
                        <vxe-column field="userAccount" title="提现账户"></vxe-column>
                        <vxe-column field="createTime" title="提现时间"></vxe-column>
                        <vxe-column field="status" title="状态">
                            <template #default="{ row }">
                                <a-tag :color="row.status == 0 ? 'green' : 'red'">{{ row.statusText }}</a-tag>
                            </template>
                        </vxe-column>
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
import { queryMemberWithdrawPage } from '@/api/userApi'

const props = defineProps({
    value: Boolean,
    data: Object
})

const title = computed(() => {
    let text = '提现记录-'
    if (props?.data) {
        text += props.data.name ? props.data.name : props.data.nickname
    }
    return text
})

const { loading, queryParams, tableData, pagerInfo, total, handleSearch, handleReset, loadData, reloadData } = useTable(
    (params) => queryMemberWithdrawPage({ ...params, memberId: props.data.id })
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
    queryParams.value.withdrawDateBegin = dates ? dates[0] : undefined
    queryParams.value.withdrawDateEnd = dates ? dates[1] : undefined
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
