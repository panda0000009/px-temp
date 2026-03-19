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
                        添加用户组
                    </a-button>
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
            >
                <!-- 多选列 -->
                <vxe-column field="name" title="用户组" min-width="100" />
                <vxe-column title="权限" min-width="300">
                    <template #default="{ row }">
                        <a-tag v-for="m in getSortedMenus(row.menus)" :key="m.id" color="blue" class="permission-tag">
                            {{ m.name }}
                        </a-tag>
                        <span v-if="!row.menus || !row.menus.length">-</span>
                    </template>
                </vxe-column>
                <vxe-column field="desc" title="备注" min-width="300" />
                <vxe-column title="操作" fixed="right" min-width="200">
                    <template #default="{ row }">
                        <a-button @click="handlCustomEdit(row)" type="primary" class="btn" size="small">
                            编辑
                        </a-button>
                        <a-popconfirm
                            title="确定要删除该用户组吗？"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="handlDel(row)"
                        >
                            <a-button type="primary" danger size="small"> 删除 </a-button>
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
            :list="parentMenus"
            :openType="openType"
            :data="curRow"
            @onOk="reloadData"
            ref="AddModalRefs"
        />
    </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, onMounted } from 'vue'
import useTable from '@/hooks/useTable'
import { PlusOutlined } from '@ant-design/icons-vue'
import { roleListApi, roleDeleteApi, menuListApi } from '@/api/userApi.js'
import AddModal from './components/AddModal.vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { buildMenuTree } from '@/utils/menuTree'
const { proxy } = getCurrentInstance()
const { t } = useI18n()
const { loading, queryParams, tableData, pagerInfo, total, handleSearch, handleReset, reloadData } = useTable(
    (params) => roleListApi(params),
    {
        immediate: true
    }
)
// 菜单列表
const parentMenus = ref([])
// 传给弹窗组件数据
const curRow = ref({})
const columnConfig = reactive({
    resizable: true
})
const AddModalRefs = ref(null)
// 选中的数组
const openType = ref('add')
// 打开弹窗
const modalVisible = ref(false)
// 删除
const handlDel = async (id) => {
    try {
        await roleDeleteApi(id)
        message.success('删除成功')
        reloadData()
    } catch (error) {
        console.error(`批量删除失败:`, error)
    }
}
// 点击账号
const handlCustomEdit = async (row) => {
    openType.value = 'edit'
    curRow.value = row
    modalVisible.value = true
}
// 新增
const handlCustomAdd = async () => {
    openType.value = 'add'
    AddModalRefs.value?.resetForm()
    modalVisible.value = true
}
// 获取菜单数据
const getMenuData = async () => {
    const resp = await menuListApi({ page: 1, pageSize: 999 })
    parentMenus.value = buildMenuTree(resp.items).map((p) => ({
        key: p.id,
        title: p.name,
        children: p.children?.map((c) => ({
            key: c.id,
            title: c.name
        }))
    }))
}
const getSortedMenus = (menus = []) => {
    if (!Array.isArray(menus)) return []
    return [...menus].sort((a, b) => a.rank - b.rank)
}
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
.btn {
    margin-right: 10px;
}
.permission-tags {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    max-height: 72px; /* 最多显示两行 */
    overflow-y: auto;
    padding: 2px 0;
}

.permission-tag {
    font-size: 12px;
    line-height: 20px;
}
</style>
