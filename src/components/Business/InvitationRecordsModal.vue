<template>
    <vxe-modal :modelValue="props.value" :title="title" width="60%" @close="handleCancel">
        <template #default>
            <div class="page page--modal">
                <div class="page__header">
                    <search-bar bordered :action="false" @onSearch="handleSearch" @onReset="handleReset">
                        <template #right>
                            <search-bar-label label="用户昵称">
                                <a-input
                                    v-model:value.trim="queryParams.nickname"
                                    placeholder="请输入用户昵称"
                                    allowClear
                                ></a-input>
                            </search-bar-label>
                            <search-bar-label label="手机号">
                                <a-input
                                    v-model:value.trim="queryParams.mobile"
                                    placeholder="请输入手机号"
                                    allowClear
                                ></a-input>
                            </search-bar-label>
                            <search-bar-label label="日期" width="360px">
                                <a-range-picker
                                    :value="[queryParams.recordTimeBegin, queryParams.recordTimeEnd]"
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
                        <vxe-column field="avatar" title="头像" width="100">
                            <template #default="{ row }">
                                <a-image :src="row.avata || default_avatarr" width="32px" />
                            </template>
                        </vxe-column>
                        <vxe-column field="nickname" title="用户昵称"></vxe-column>
                        <vxe-column field="mobile" title="手机号"></vxe-column>
                        <vxe-column field="registerTerminal" title="注册渠道"></vxe-column>
                        <vxe-column field="state" title="邀请进度"></vxe-column>
                        <vxe-column field="point" title="奖励积分" align="right"></vxe-column>
                        <vxe-column field="recordTime" title="创建时间"></vxe-column>
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
import default_avatar from '@/assets/default_avatar@2x.png'
import { computed, watch } from 'vue'
import Pager from '@/components/Pager/index.vue'
import { queryMemberInvitePage } from '@/api/userApi'
import useTable from '@/hooks/useTable'

const props = defineProps({
    value: Boolean,
    data: Object
})
watch(
    () => props.value,
    (value) => {
        console.log(value)
        if (value) {
            loadData()
        }
    }
)

const title = computed(() => {
    let text = '邀请记录-'
    if (props?.data) {
        text += props.data.name ? props.data.name : props.data.nickname
    }
    return text
})

const { loading, queryParams, tableData, pagerInfo, total, handleSearch, handleReset, loadData, reloadData } = useTable(
    (params) => queryMemberInvitePage({ ...params, memberId: props.data.id })
)

const handleTimeChange = (dates) => {
    queryParams.value.recordTimeBegin = dates ? dates[0] : undefined
    queryParams.value.recordTimeEnd = dates ? dates[1] : undefined
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
