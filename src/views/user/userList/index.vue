<template>
    <div class="page">
        <div class="page__header">
            <search-bar bordered @onSearch="handleSearch" @onReset="handleReset" :action="false" customAdd>
                <template #right>
                    <search-bar-label label="用户名称" width="300px">
                        <a-input v-model:value.trim="queryParams.name" placeholder="请输入用户名称或账号" allowClear />
                    </search-bar-label>
                    <a-button @click="handlCustomAdd" type="primary">
                        <PlusOutlined />
                        添加用户
                    </a-button>
                    <a-button @click="handlTopDel" type="primary" danger>批量删除</a-button>
                    <a-button @click="handlBatchStatus(1)" type="primary" class="edit-btn"> 批量启用 </a-button>
                    <a-button @click="handlBatchStatus(0)" type="primary" class="enabled-btn"> 批量禁用 </a-button>
                </template>
            </search-bar>
        </div>
        <div class="page__container page__container--reserved">
            <vxe-table
                height="auto"
                :loading="loading"
                :column-config="columnConfig"
                :data="tableData"
                border
                header-align="center"
                align="center"
                :checkbox-config="{ range: true }"
                v-model:checkbox-row="selectedRows"
                @checkbox-change="handleCheckboxChange"
                @checkbox-all="handleCheckboxAll"
            >
                <!-- 多选列 -->
                <vxe-column type="checkbox" width="60"></vxe-column>
                <vxe-column title="账号" min-width="80">
                    <template #default="{ row }">
                        <a @click="tapAccount(row)">{{ row.account }}</a>
                    </template>
                </vxe-column>
                <vxe-column field="nickname" title="用户名称" min-width="100" />
                <vxe-column title="权限" min-width="200">
                    <template v-slot="{ row }">
                        <a-tag
                            v-for="(item, index) in row.roles"
                            :key="index"
                            :color="'blue'"
                            style="margin-right: 8px"
                        >
                            {{ item.name }}
                        </a-tag>
                    </template>
                </vxe-column>
                <vxe-column title="运营商权限" min-width="200">
                    <template v-slot="{ row }">
                        <a-tag
                            v-for="(item, index) in row.agents"
                            :key="index"
                            :color="'red'"
                            style="margin-right: 8px"
                        >
                            {{ item.agentName }}
                        </a-tag>
                    </template>
                </vxe-column>
                <vxe-column title="供应商权限" min-width="200">
                    <template v-slot="{ row }">
                        <a-tag
                            v-for="(item, index) in row.providers"
                            :key="index"
                            :color="'green'"
                            style="margin-right: 8px"
                        >
                            {{ item.providerName }}
                        </a-tag>
                    </template>
                </vxe-column>
                <vxe-column field="desc" title="备注" min-width="300" />
                <vxe-column field="enabled" title="用户状态" min-width="100" fixed="right">
                    <template #default="{ row }">
                        <a-tag :color="row.enabled ? 'green' : 'red'">
                            {{ row.enabled ? '启用' : '禁用' }}
                        </a-tag>
                    </template>
                </vxe-column>
                <vxe-column title="操作" fixed="right" min-width="200">
                    <!-- <template #default="{ row }">
                        <a-button @click="handlCustomEdit(row)" type="primary" class="btn" size="small">
                            编辑
                        </a-button>
                    </template> -->
                    <template #default="{ row }">
                        <a-popconfirm
                            :title="`${row.enabled ? '确定要禁用吗?' : '确定要启用吗?'}`"
                            :ok-text="row.enabled ? '确定禁用' : '确定启用'"
                            :cancel-text="'取消'"
                            @confirm="handelEnable(row)"
                        >
                            <a-button class="btn" :class="row.enabled ? 'btn-disable' : 'btn-enable'" size="small">
                                {{ row.enabled ? '禁用' : '启用' }}
                            </a-button>
                        </a-popconfirm>
                    </template>
                </vxe-column>
            </vxe-table>
        </div>
        <div class="page__footer">
            <pager
                v-model:current="pagerInfo.page"
                v-model:pageSize="pagerInfo.pageSize"
                :total="total"
                @onChange="reloadData"
            />
        </div>
        <add-modal
            v-model:value="modalVisible"
            :list="providerList"
            :openType="openType"
            :data="curRow"
            ref="AddMoadlRefs"
            @onOk="reloadData"
        />
    </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from 'vue'
import useTable from '@/hooks/useTable'
import useUserStore from '@/stores/modules/userStore'
import { PlusOutlined } from '@ant-design/icons-vue'
import { accountListApi, accountEnabledApi, accountDeleteApi } from '@/api/userApi.js'
import AddModal from './components/AddModal.vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
const { proxy } = getCurrentInstance()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const { t } = useI18n()
const { loading, queryParams, tableData, pagerInfo, total, handleSearch, handleReset, reloadData } = useTable(
    (params) => accountListApi(params),
    {
        immediate: true
    }
)
const providerList = ref([])
// 传给弹窗组件数据
const curRow = ref({})
const columnConfig = reactive({
    resizable: true
})
const AddMoadlRefs = ref(null)
// 选中的数组
const selectedRows = ref([])
const openType = ref('add')
// 打开弹窗
const modalVisible = ref(false)
// 单选
const handleCheckboxChange = ({ records }) => {
    selectedRows.value = records
}
// 全选
const handleCheckboxAll = ({ records }) => {
    selectedRows.value = records
}
// 批量删除
const handlTopDel = async () => {
    if (!selectedRows.value || selectedRows.value.length === 0) {
        proxy.$message.warning('请先选择要操作的数据')
        return
    }
    // 提取 id 数组
    const ids = selectedRows.value.map((item) => item.id)
    proxy.$modal.confirm({
        title: `批量删除确认`,
        content: `确定要删除选中的 ${ids.length} 条记录吗？`,
        okText: `确定`,
        okType: 'primary',
        cancelText: '取消',
        async onOk() {
            try {
                await accountDeleteApi({ accountIds: ids })
                message.success('删除成功')
                selectedRows.value = []
                reloadData()
            } catch (error) {
                console.error(`批量删除失败:`, error)
            }
        }
    })
}
// 统一的批量状态设置方法
const handlBatchStatus = (enabled) => {
    if (!selectedRows.value || selectedRows.value.length === 0) {
        proxy.$message.warning('请先选择要操作的数据')
        return
    }
    const idList = selectedRows.value.map((row) => row.id)
    const actionText = enabled === 1 ? '启用' : '禁用'
    proxy.$modal.confirm({
        title: `批量${actionText}确认`,
        content: `确定要${actionText}选中的 ${idList.length} 条记录吗？`,
        okText: `确定${actionText}`,
        okType: enabled === 0 ? 'danger' : 'primary',
        cancelText: '取消',
        async onOk() {
            try {
                await accountEnabledApi({
                    accountIds: idList,
                    enabled: enabled === 0 ? false : true
                })
                proxy.$message.success(`已成功${actionText} ${idList.length} 条记录`)
                selectedRows.value = []
                reloadData()
            } catch (error) {
                console.error(`批量${actionText}失败:`, error)
            }
        }
    })
}
// 点击账号
const tapAccount = (row) => {
    openType.value = 'edit'
    if (userInfo.value?.value?.isSuper) {
        curRow.value = { ...row }
        modalVisible.value = true
    }
}
// 新增
const handlCustomAdd = () => {
    openType.value = 'add'
    // AddMoadlRefs.value?.resetForm()
    // AddMoadlRefs.value?.resetForgetForm()
    modalVisible.value = true
}
// 启用禁用
const handelEnable = (row) => {
    console.log(row)
    accountEnabledApi({ accountIds: [row.id], enabled: row.enabled ? false : true }).then(() => {
        proxy.$message.success('操作成功')
        reloadData()
    })
}
</script>

<style lang="scss" scoped>
.page__container__main {
    display: flex;
    height: 100%;

    &__left {
        padding: 20px 10px;
        margin-right: 10px;
        min-width: 200px;
        border: 1px solid #f1f1f1;
        border-radius: 10px;
    }

    &__flex {
        flex: 1;
        height: 100%;
    }
}
.edit-btn {
    background-color: #52c41a; /* 绿色 */
    border-color: #52c41a;
}
.edit-btn:hover {
    background-color: #73d13d;
    border-color: #73d13d;
}
.enabled-btn {
    background-color: #f59a23; /* 绿色 */
    border-color: #f59a23;
}
.enabled-btn:hover {
    background-color: #f59a23;
    border-color: #f59a23;
}
.btn {
    margin-right: 10px;
}
:deep(.search-bar__space) {
    justify-content: unset !important;
}
/* 启用状态 - 绿色按钮 */
.btn-enable {
    background-color: #52c41a !important;
    border-color: #52c41a !important;
    color: white !important;
}

.btn-enable:hover {
    background-color: #73d13d !important;
    border-color: #73d13d !important;
}

.btn-enable:focus {
    background-color: #389e0d !important;
    border-color: #389e0d !important;
}

/* 禁用状态 - 红色按钮 */
.btn-disable {
    background-color: #ff4d4f !important;
    border-color: #ff4d4f !important;
    color: white !important;
}

.btn-disable:hover {
    background-color: #ff7875 !important;
    border-color: #ff7875 !important;
}

.btn-disable:focus {
    background-color: #d9363e !important;
    border-color: #d9363e !important;
}
.custom-upload-container {
    position: relative;
    display: inline-block;
}

.upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    // gap: 8px;
}

.upload-button {
    width: 140px; /* 固定按钮宽度，使文案对齐 */
}

.upload-tip {
    position: absolute;
    font-size: 12px;
    color: #999;
    line-height: 1.4;
    text-align: center;
    cursor: pointer;
    transition: color 0.3s;
    bottom: -20px;
}

.upload-tip:hover {
    color: #1890ff;
}

/* 如果提示文本需要点击下载功能 */
.upload-tip a {
    color: #999;
    text-decoration: none;
}

.upload-tip a:hover {
    color: #1890ff;
    text-decoration: underline;
}
</style>
