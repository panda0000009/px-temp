<template>
    <vxe-modal :modelValue="props.value" :title="title" width="30%" @close="handleCancel">
        <template #default>
            <a-form
                ref="formRef"
                :model="formState"
                :rules="rules"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 16 }"
            >
                <a-form-item label="用户组名" name="name">
                    <a-input
                        v-model:value.trim="formState.name"
                        :maxLength="20"
                        placeholder="请输入用户组名"
                        allowClear
                    />
                </a-form-item>
                <a-form-item label="备注" name="desc">
                    <a-textarea
                        v-model:value.trim="formState.desc"
                        :maxlength="30"
                        placeholder="请输入备注"
                        :rows="3"
                    />
                </a-form-item>
                <a-form-item label="权限设置" name="menuIds">
                    <div class="permission-tree-wrapper">
                        <a-tree
                            v-model:expandedKeys="expandedKeys"
                            v-model:checkedKeys="checkedKeys"
                            checkable
                            :tree-data="list"
                            @check="handleTreeCheck"
                            default-expand-all
                        />
                    </div>
                </a-form-item>
            </a-form>
        </template>
        <template #footer>
            <a-space>
                <a-button :loading="loading" @click="handleCancel">取消</a-button>
                <a-button type="primary" :loading="loading" @click="handleConfirm">确定</a-button>
            </a-space>
        </template>
    </vxe-modal>
</template>

<script setup>
import { reactive, ref, watch, getCurrentInstance, computed, nextTick } from 'vue'
import { roleCreateApi } from '@/api/userApi'
const { proxy } = getCurrentInstance()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = defineProps({
    value: Boolean,
    data: Object,
    openType: {
        type: String,
        default: 'add',
        validator: (value) => ['add', 'edit'].includes(value)
    },
    list: {
        type: Array,
        default: []
    }
})
const emit = defineEmits(['update:value', 'onOk'])
const loading = ref(false)
const formRef = ref(null)
const expandedKeys = ref([])
const checkedKeys = ref([])
const fullCheckedKeys = ref({ checked: [], halfChecked: [] }) // 存储完整的 checkedKeys（包括半选状态）
// 新增编辑表单
const formState = reactive({
    name: '',
    desc: ''
})
const title = computed(() => {
    switch (props.openType) {
        case 'add':
            return '添加用户组'
        case 'edit':
            return '编辑用户组'
        default:
            throw new Error('无效的 openType')
    }
})
const checkedMenuIds = ref([])
// 规则
const rules = {
    name: [
        {
            required: true,
            message: '请输入用户组名',
            trigger: 'blur'
        }
    ]
}

// 处理树节点选中事件，获取完整的 checkedKeys（包括半选状态）
const handleTreeCheck = (checkedKeysValue, e) => {
    // e.checkedNodes 包含选中的节点信息
    // e.halfCheckedKeys 包含半选中的节点 key
    // checkedKeysValue 可能是数组或对象格式
    if (checkedKeysValue && typeof checkedKeysValue === 'object' && !Array.isArray(checkedKeysValue)) {
        // 对象格式：{ checked: [], halfChecked: [] }
        fullCheckedKeys.value = {
            checked: checkedKeysValue.checked || [],
            halfChecked: checkedKeysValue.halfChecked || []
        }
    } else if (Array.isArray(checkedKeysValue)) {
        // 数组格式：需要从事件对象中获取半选状态
        fullCheckedKeys.value = {
            checked: checkedKeysValue,
            halfChecked: e.halfCheckedKeys || []
        }
    } else {
        fullCheckedKeys.value = { checked: [], halfChecked: [] }
    }
}
// 处理树
const collectLeafKeys = (treeData) => {
    const set = new Set()
    const dfs = (arr) => {
        arr.forEach((node) => {
            if (!node.children || node.children.length === 0) {
                set.add(node.key) // 只要叶子
            } else {
                dfs(node.children)
            }
        })
    }
    dfs(treeData)
    return set
}
// 信息
const submitBaseForm = () => {
    formRef.value.validate().then(() => {
        const checked = fullCheckedKeys.value.checked || []
        const halfChecked = fullCheckedKeys.value.halfChecked || []
        const finalMenuIds = [...new Set([...checked, ...halfChecked])]
        loading.value = true
        const submitData = {
            name: formState.name,
            desc: formState.desc,
            menuIds: finalMenuIds
        }
        if (props.openType === 'edit') {
            submitData.id = formState.id
        }
        roleCreateApi(submitData)
            .then(() => {
                proxy.$message.success(props.openType === 'edit' ? '修改成功' : '新增成功')
                emit('onOk')
                handleCancel()
                resetForm()
            })
            .catch((err) => {
                // 出错
                console.log(err)
            })
            .finally(() => {
                loading.value = false
            })
    })
}
// 提交
const handleConfirm = () => {
    submitBaseForm()
}
const collectAllNodeKeys = (list, res = []) => {
    list.forEach((item) => {
        res.push(Number(item.id))
        if (item.children && item.children.length) {
            collectAllNodeKeys(item.children, res)
        }
    })
    return res
}
watch(
    [() => props.openType, () => props.data],
    ([type, data]) => {
        // 👉 新增：默认全部展开
        ;async ([type, list]) => {
            if (!list?.length) return
            // 新增模式：全展开
            if (type === 'add') {
                checkedKeys.value = []
                await nextTick() // ⭐ 关键
                expandedKeys.value = collectAllNodeKeys(list)
                return
            }
        }
        if (type === 'edit' && data) {
            formState.id = data.id || null
            formState.name = data.name || ''
            formState.desc = data.desc || ''
            const checkedMenuIds = data.menus ? data.menus.map((item) => Number(item.id)) : []
            const leafKeySet = collectLeafKeys(props.list)
            const backendIds = checkedMenuIds // 后端给的混合 ids
            if (!backendIds || !backendIds.length) return
            const leafOnlyIds = backendIds.filter((id) => leafKeySet.has(id)) // => ['0-0-0','0-0-1']
            checkedKeys.value = leafOnlyIds
            // 2️⃣ 自动展开它们的所有父级
            expandedKeys.value = Array.from(collectLeafKeys(props.list))
        } else {
            formState.id = null
            formState.name = ''
            formState.desc = ''
            checkedKeys.value = []
            expandedKeys.value = []
            checkedMenuIds.value = []
        }
    },
    { immediate: true }
)

// 添加重置表单的函数
const resetForm = () => {
    formState.id = null
    formState.name = ''
    formState.desc = ''
    checkedMenuIds.value = []
    expandedKeys.value = []
    checkedKeys.value = []
    formRef.value?.clearValidate()
}
defineExpose({ resetForm })
const handleCancel = () => {
    emit('update:value', false)
}
</script>
<style scoped lang="scss">
.form-inline {
    display: flex;
    align-items: center;
    gap: 8px;
}

.tag-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 12px 0;
}

.tag-wrap .ant-radio-button-wrapper {
    min-width: 90px;
    text-align: center;
    border-radius: 18px !important;
}

.tag-wrap .ant-radio-button-wrapper:first-child {
    border-top-left-radius: 18px !important;
    border-bottom-left-radius: 18px !important;
}

.tag-wrap .ant-radio-button-wrapper:last-child {
    border-top-right-radius: 18px !important;
    border-bottom-right-radius: 18px !important;
}

:deep(.ant-radio-button-wrapper::before) {
    background-color: transparent !important;
}

.btn-left {
    margin-right: 10px;
}

.permission-tree-wrapper {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    padding: 8px 12px;
    height: 200px;
    /* 固定高度 */
    overflow-y: auto;
    /* 超出滚动 */
    // background: #fafafa;
}
</style>
