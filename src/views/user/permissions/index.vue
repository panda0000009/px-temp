<template>
    <div class="page">
        <div class="page__header">
            <search-bar bordered @onSearch="handleSearch" @onReset="handleReset" :action="false" customAdd>
                <template #right>
                    <search-bar-label label="用户名称" width="300px">
                        <a-input v-model:value.trim="queryParams.name" placeholder="请输入用户名称或账号" allowClear />
                    </search-bar-label>
                    <a-button @click="handlCustomAdd" type="primary"> 权限设置 </a-button>
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
                <vxe-column title="账号" field="account" min-width="80" />
                <vxe-column field="nickname" title="用户名称" min-width="200" />
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
            :list="parentMenus"
            :openType="openType"
            :data="curRow"
            :selectedUsers="selectedRows"
            @onOk="handleModalOk"
        />
    </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, onMounted, onActivated } from 'vue'
import useTable from '@/hooks/useTable'
import { accountListApi, menuListApi } from '@/api/userApi.js'
import AddModal from './components/AddModal.vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { buildMenuTree } from '@/utils/menuTree'
const { proxy } = getCurrentInstance()
const { t } = useI18n()
const { loading, queryParams, tableData, pagerInfo, total, handleSearch, handleReset, reloadData } = useTable(
    (params) => accountListApi(params),
    {
        immediate: false
    }
)
const providerList = ref([])
const permissionModalRef = ref()
// 菜单列表
const parentMenus = ref([])
// 传给弹窗组件数据
const curRow = ref({})
const columnConfig = reactive({
    resizable: true
})
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
// 新增
const handlCustomAdd = () => {
    // 检查是否选中了用户
    if (!selectedRows.value || selectedRows.value.length === 0) {
        message.warning('请先选择要设置权限的用户')
        return
    }
    openType.value = 'add'
    // 传递选中的用户数据
    curRow.value = {
        selectedUsers: selectedRows.value
    }
    modalVisible.value = true
}
// 获取菜单数据
const getMenuData = async () => {
    try {
        const resp = await menuListApi({ page: 1, pageSize: 999 })
        parentMenus.value = buildMenuTree(resp.items || []).map((p) => ({
            key: p.id,
            title: p.name,
            children: p.children?.map((c) => ({
                key: c.id,
                title: c.name
            }))
        }))
    } catch (err) {
        console.error('获取菜单数据失败:', err)
    }
}
// 弹窗确定后的回调
const handleModalOk = () => {
    reloadData()
    // 清空选中的用户
    selectedRows.value = []
}
onActivated(() => {
    reloadData() 
})
onMounted(() => {
    getMenuData()
})
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
