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
                <a-form-item label="用户组" name="roleIds">
                    <div class="form-item-with-button">
                        <a-select
                            v-model:value="formState.roleIds"
                            mode="multiple"
                            placeholder="请选择用户组（可多选）"
                            allowClear
                            style="width: 100%"
                            :maxTagCount="3"
                            @change="handleRoleChange"
                            show-search
                            option-filter-prop="label"
                            :options="roleOptions"
                        >
                            <a-select-option v-for="item in roleList" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </div>
                </a-form-item>
                <!-- <a-form-item label="后台权限" name="menuIds">
                    <div class="permission-tree-wrapper" style="width: 280px">
                        <a-tree
                            checkable
                            :tree-data="list"
                            v-model:checkedKeys="checkedMenuIds"
                            default-expand-all
                            :disabled="!formState.roleIds || formState.roleIds.length === 0"
                        />
                    </div>
                </a-form-item> -->
                <a-form-item label="运营商数据权限" name="agentIds">
                    <a-select
                        v-model:value="formState.agentIds"
                        mode="multiple"
                        placeholder="请选择运营商数据权限（可多选）"
                        allowClear
                        style="width: 100%"
                        :maxTagCount="3"
                        :disabled="!formState.roleIds || formState.roleIds.length === 0"
                    >
                        <a-select-option v-for="item in agentList" :key="item.id" :value="item.id">
                            {{ item.agentName }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="供应商数据权限" name="providerIds">
                    <a-select
                        v-model:value="formState.providerIds"
                        mode="multiple"
                        placeholder="请选择供应商数据权限（可多选）"
                        allowClear
                        style="width: 100%"
                        :maxTagCount="3"
                        :disabled="!formState.roleIds || formState.roleIds.length === 0"
                    >
                        <a-select-option v-for="item in providerList" :key="item.id" :value="item.id">
                            {{ item.providerName }}
                        </a-select-option>
                    </a-select>
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
import { reactive, ref, watch, getCurrentInstance, computed, onMounted } from 'vue'
import { roleListApi } from '@/api/userApi'
import { setAuthorityApi } from '@/api/merchant'
import { getProvider, getMerchant } from '@/api/merchant'
const { proxy } = getCurrentInstance()
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
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
    },
    selectedUsers: {
        type: Array,
        default: () => []
    }
})
const emit = defineEmits(['update:value', 'onOk'])
const loading = ref(false)
const formRef = ref(null)
// 用户组列表
const roleList = ref([])
// 运营商列表
const agentList = ref([])
// 供应商列表
const providerList = ref([])
// 新增表单
const formState = reactive({
    roleIds: [],
    agentIds: [],
    providerIds: []
})
const title = computed(() => {
    if (props.selectedUsers && props.selectedUsers.length > 0) {
        const userNames = props.selectedUsers.map((user) => user.nickname || user.account).join('、')
        // 如果用户名称太长，只显示前几个
        if (userNames.length > 30) {
            const firstUser = props.selectedUsers[0].nickname || props.selectedUsers[0].account
            return `批量权限设置（${firstUser}等${props.selectedUsers.length}个用户）`
        }
        return `批量权限设置（${userNames}）`
    }
    switch (props.openType) {
        case 'add':
            return '权限设置'
        case 'edit':
            return '编辑权限'
        default:
            throw new Error('无效的 openType')
    }
})
const checkedMenuIds = ref([])

// 规则
const rules = {
    roleIds: [
        {
            required: true,
            message: '请至少选择一个用户组',
            trigger: 'change',
            validator: (rule, value) => {
                if (!value || value.length === 0) {
                    return Promise.reject('请至少选择一个用户组')
                }
                return Promise.resolve()
            }
        }
    ]
}
const roleOptions = computed(() => {
    return roleList.value.map((item) => ({
        label: item.name, // 显示名称
        value: item.id // 提交值
    }))
})
// 获取用户组列表
const getRoleList = async () => {
    try {
        const res = await roleListApi({ page: 1, pageSize: 999 })
        roleList.value = res.items || []
        console.log('获取用户组列表', roleList.value)
    } catch (err) {
        console.error('获取用户组列表失败:', err)
    }
}

// 获取运营商列表
const getAgentList = async () => {
    try {
        const res = await getMerchant({ page: 1, pageSize: 999 })
        agentList.value = (res.items || []).map((item) => ({
            id: item.id,
            agentName: item.agentName
        }))
    } catch (err) {
        console.error('获取运营商列表失败:', err)
    }
}

// 获取供应商列表
const getProviderList = async () => {
    try {
        const res = await getProvider({ page: 1, pageSize: 999 })
        providerList.value = (res.items || []).map((item) => ({
            id: item.id,
            providerName: item.providerName
        }))
    } catch (err) {
        console.error('获取供应商列表失败:', err)
    }
}

// 用户组选择变化
const handleRoleChange = async (roleIds) => {
    // 选择用户组时，清空所有权限让用户重新选择
    if (roleIds && roleIds.length > 0) {
        // 有选择用户组时，清空权限让用户重新选择
        checkedMenuIds.value = []
        formState.agentIds = []
        formState.providerIds = []
    } else {
        // 没有选择用户组时，也清空权限
        checkedMenuIds.value = []
        formState.agentIds = []
        formState.providerIds = []
    }
}

watch(
    [() => props.openType, () => props.data],
    ([type, data]) => {
        if (type === 'edit' && data) {
            formState.roleIds = data.id ? [data.id] : []
            checkedMenuIds.value = data.menus ? data.menus.map((item) => Number(item.id)) : []
            formState.agentIds = data.agentIds ? (Array.isArray(data.agentIds) ? data.agentIds : [data.agentIds]) : []
            formState.providerIds = data.providerIds
                ? Array.isArray(data.providerIds)
                    ? data.providerIds
                    : [data.providerIds]
                : []
        } else {
            formState.roleIds = []
            checkedMenuIds.value = []
            formState.agentIds = []
            formState.providerIds = []
        }
    },
    { immediate: true }
)

// 监听弹窗打开，获取用户组列表和数据权限列表
watch(
    () => props.value,
    (visible) => {
        if (visible) {
            getRoleList()
            getAgentList()
            getProviderList()
        }
    }
)

// 提交
const handleConfirm = () => {
    submitBaseForm()
}
// 信息
const submitBaseForm = () => {
    formRef.value.validate().then(() => {
        loading.value = true
        // 如果有选中的用户，批量设置这些用户的权限
        if (props.selectedUsers && props.selectedUsers.length > 0) {
            const accountIds = props.selectedUsers.map((user) => user.id)
            const submitData = {
                accountIds,
                roleIds: formState.roleIds,
                agentIds: formState.agentIds,
                providerIds: formState.providerIds
            }
            setAuthorityApi(submitData)
                .then(() => {
                    proxy.$message.success(`成功为 ${props.selectedUsers.length} 个用户批量设置权限`)
                    emit('onOk')
                    handleCancel()
                    resetForm()
                })
                .catch((err) => {
                    console.error('批量设置权限失败:', err)
                    message.error('批量设置权限失败，请重试')
                })
                .finally(() => {
                    loading.value = false
                })
        }
    })
}
// 添加重置表单的函数
const resetForm = () => {
    formState.roleIds = []
    checkedMenuIds.value = []
    formState.agentIds = []
    formState.providerIds = []
    formRef.value?.clearValidate()
}
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
.form-item-with-button {
    display: flex;
    align-items: flex-start;
    gap: 8px;
}
.selected-users-info {
    margin-bottom: 16px;
}
.user-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
}
.permission-tree-wrapper {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    padding: 8px 12px;
    height: 200px; /* 固定高度 */
    overflow-y: auto; /* 超出滚动 */
    // background: #fafafa;
}
</style>
