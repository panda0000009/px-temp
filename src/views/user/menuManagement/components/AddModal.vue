<template>
    <vxe-modal :modelValue="props.value" :title="title" width="30%" @close="handleCancel">
        <template #default>
            <a-form ref="formRef" :model="formData" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
                <a-form-item label="上级菜单" name="parentId">
                    <a-tree-select
                        v-model:value="formData.parentId"
                        :tree-data="menuTree"
                        placeholder="请选择上级菜单"
                        allowClear
                        tree-default-expand-all
                        :field-names="{ label: 'name', value: 'id', children: 'children' }"
                    />
                </a-form-item>
                <a-form-item label="菜单名称">
                    <a-input v-model:value="formData.name" placeholder="请输入菜单名称" name="name" />
                </a-form-item>
                <a-form-item label="路由" name="route">
                    <a-input v-model:value="formData.route" placeholder="例如：/system" />
                </a-form-item>
                <a-form-item label="组件路径" name="component">
                    <a-input
                        v-model:value.trim="formData.component"
                        :maxLength="100"
                        placeholder="请输入组件路径"
                        allowClear
                    />
                </a-form-item>
                <a-form-item label="图标">
                    <input-select
                        v-model:value="formData.icon"
                        placeholder="请选择图标"
                        readOnly
                        allowClear
                        @onSelect="handleIconSelect"
                    />
                </a-form-item>
                <a-form-item label="排名" name="rank">
                    <a-space>
                        <a-input-number v-model:value="formData.rank" :min="1" :max="100" />
                    </a-space>
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
    <IconModal v-model:value="IconVisible" @IconSelect="IconSelect" />
</template>

<script setup>
import { reactive, ref, watch, getCurrentInstance, computed } from 'vue'
import { menuCreateApi } from '@/api/userApi'
import IconModal from '@/components/IconModal/index.vue'
const { proxy } = getCurrentInstance()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const IconVisible = ref(false)
const props = defineProps({
    value: Boolean,
    data: Object,
    menuTree: Array,
    openType: {
        type: String,
        default: 'add',
        validator: (value) => ['add', 'edit', 'children'].includes(value)
    }
})
const emit = defineEmits(['update:value', 'onOk'])
const loading = ref(false)
const formRef = ref(null)
const formData = reactive({
    id: null,
    name: '',
    route: '',
    icon: '',
    component: '', //组件路径
    rank: 1,
    parentId: null // 👈 表单阶段永远用 null
})
const rules = {
    route: [
        { required: true, message: '请输入路由地址' },
        {
            pattern: /^\/[A-Za-z0-9\/-]*$/,
            message: '路由必须以 / 开头，只能包含字母、数字、/、-'
        }
    ],
    name: [{ required: true, message: '请输入菜单名称' }],
    rank: { required: true, message: '请输入排序值' }
}
const title = computed(() => {
    switch (props.openType) {
        case 'add':
            return '新建上级菜单'
        case 'children':
            return '新建子菜单'
        case 'edit':
            return '编辑菜单'
        default:
            throw new Error('无效的 openType')
    }
})
const handleIconSelect = () => {
    IconVisible.value = true
}
// 选中的icon
const IconSelect = (name) => {
    formData.icon = name
}
const handleConfirm = () => {
    formRef.value
        .validate()
        .then(() => {
            const submitData = {
                id: formData.id,
                name: formData.name,
                route: formData.route,
                icon: formData.icon,
                rank: formData.rank,
                component: formData.component,
                parentId: formData.parentId ?? 0 // ⭐ 唯一兜底点
            }
            menuCreateApi(submitData)
                .then(() => {
                    proxy.$message.success(props.openType === 'edit' ? '修改成功' : '新增成功')
                    emit('onOk')
                    handleCancel()
                    resetForm()
                })
                .finally(() => {
                    loading.value = false
                })
        })
        .catch((error) => {
            console.log('表单验证失败:', error)
        })
}
// 重置表单
const resetForm = () => {
    formData.icon = ''
    formData.name = ''
    formData.parentId = null
    formData.rank = 0
    formData.route = ''
    formData.component = ''
    formRef.value?.clearValidate()
}
watch(
    [() => props.openType, () => props.data],
    ([type, data]) => {
        if ((type === 'edit' || type === 'children') && data) {
            // 编辑或新增子菜单，都需要回填 parentId
            Object.assign(formData, {
                id: type === 'edit' ? data.id : null, // 编辑才有 id
                icon: type === 'edit' ? data.icon || '' : '',
                name: type === 'edit' ? data.name || '' : '',
                route: type === 'edit' ? data.route || '' : '',
                rank: type === 'edit' ? data.rank ?? 1 : 1,
                component: type === 'edit' ? data.component ?? '' : '',
                parentId:
                    type === 'edit'
                        ? data.parentId === 0
                            ? null
                            : data.parentId // 编辑菜单
                        : data.id // 新增子菜单，parentId 就是当前行的 id
            })
        } else {
            // 新增根菜单
            Object.assign(formData, {
                id: null,
                icon: '',
                name: '',
                route: '',
                rank: 1,
                component: '',
                parentId: null // 根菜单 parentId null
            })
        }
    },
    { immediate: true }
)

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
</style>
