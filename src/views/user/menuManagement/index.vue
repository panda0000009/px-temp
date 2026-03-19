<template>
    <a-layout>
        <a-layout-content style="padding: 20px; background: #fff" class="menu-layout">
            <div class="menu-left">
                <a-card class="preview-card">
                    <template #title>
                        <div class="card-header">
                            <span>菜单</span>
                            <a-button type="primary" @click="addSubMenu">新增</a-button>
                        </div>
                    </template>
                    <a-table
                        :columns="parentMenuColumns"
                        :data-source="parentMenus"
                        :pagination="false"
                        row-key="id"
                        :children="(record) => record.children"
                    >
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.dataIndex === 'operation'">
                                <a-button type="link" @click="addChildrenMenu(record)" size="small"
                                    >新增子菜单</a-button
                                >
                                <a-button
                                    type="primary"
                                    @click="editSubMenu(record)"
                                    size="small"
                                    style="margin-right: 10px"
                                    >编辑</a-button
                                >
                                <a-popconfirm
                                    title="确定要删除该菜单吗？"
                                    ok-text="删除"
                                    cancel-text="取消"
                                    @confirm="delSubMenu(record)"
                                >
                                    <a-button type="primary" size="small" danger> 删除 </a-button>
                                </a-popconfirm>
                            </template>
                        </template>
                    </a-table>
                </a-card>
            </div>
            <!-- 右侧：预览 -->
            <div class="menu-right">
                <a-card title="预览" class="preview-card">
                    <a-tree :tree-data="previewTreeData" :field-names="treeFieldNames" :expanded-keys="expandedKeys" />
                </a-card>
            </div>
            <!-- 菜单编辑模态框 -->
        </a-layout-content>
        <add-modal
            v-model:value="modalVisible"
            :openType="openType"
            :data="curRow"
            :menu-tree="parentMenus"
            @on-ok="getMenuData"
        />
    </a-layout>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { menuListApi, menuDeleteApi } from '@/api/userApi.js'
import AddModal from './components/AddModal.vue'
import { message } from 'ant-design-vue'
import { buildMenuTree } from '@/utils/menuTree'
import * as Icons from '@ant-design/icons-vue'
// 上级菜单数据
const parentMenus = ref([])
const expandedKeys = ref([])
const openType = ref('add')
const curRow = ref({})
// 表格列定义
const parentMenuColumns = [
    {
        title: '序号',
        dataIndex: 'id',
        width: 100
    },
    {
        title: '图标',
        dataIndex: 'icon',
        width: 200,
        customRender: ({ text }) => {
            const IconComp = Icons[text]
            return IconComp ? h(IconComp) : '-'
        }
    },
    {
        title: '排名',
        dataIndex: 'rank'
    },
    {
        title: '菜单名',
        dataIndex: 'name'
    },
    {
        title: '操作',
        dataIndex: 'operation',
        width: 250
    }
]

const delSubMenu = async (id) => {
    await menuDeleteApi(id)
    message.success('删除成功')
    getMenuData()
}
// 预览树形数据
const previewTreeData = computed(() => {
    const build = (arr) => {
        return arr.map((item) => ({
            key: item.id,
            title: item.name,
            children: item.children && item.children.length ? build(item.children) : undefined
        }))
    }

    return build(parentMenus.value)
})
// 展开key
const buildExpandKeys = (arr, result = []) => {
    arr.forEach((item) => {
        result.push(item.id)
        if (item.children && item.children.length) {
            buildExpandKeys(item.children, result)
        }
    })
    return result
}
const treeFieldNames = {
    children: 'children',
    title: 'title',
    key: 'key'
}

// 模态框相关
const modalVisible = ref(false)
const editSubMenu = (record) => {
    curRow.value = record
    openType.value = 'edit'
    modalVisible.value = true
}
// 添加菜单
const addSubMenu = () => {
    openType.value = 'add'
    curRow.value = null
    modalVisible.value = true
}
// 添加子菜单
const addChildrenMenu = (row) => {
    curRow.value = row
    openType.value = 'children'
    modalVisible.value = true
}
// 获取菜单数据
const getMenuData = async () => {
    const resp = await menuListApi({ page: 1, pageSize: 999 })
    parentMenus.value = buildMenuTree(resp.items)
    expandedKeys.value = buildExpandKeys(parentMenus.value)
}
onMounted(() => {
    getMenuData()
})
</script>

<style scoped>
.ant-tree {
    background: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
}

.ant-tree-treenode {
    padding: 4px 0;
}

.ant-card {
    border-radius: 8px;
}

.ant-card-head {
    border-bottom: 1px solid #f0f0f0;
}

.ant-space-vertical {
    width: 100%;
}

.ant-btn-text {
    padding: 4px 8px;
}
.card-header {
    display: flex;
    justify-content: space-between;
}
.space {
    display: flex;
    justify-content: space-between;
}
.menu-layout {
    display: flex;
    height: calc(100vh - 140px); /* 根据你顶部高度调 */
}

.menu-left {
    flex: 2 !important; /* 左边占2份 */
    margin-right: 16px;
    overflow: auto;
}

.menu-right {
    flex: 1 !important; /* 右边占1份 = 自动自适应 */
    min-width: 320px; /* 防止太窄 */
}

.preview-card {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.preview-card .ant-card-body {
    flex: 1;
    overflow: auto;
}
</style>
