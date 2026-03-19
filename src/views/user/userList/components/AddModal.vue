<template>
    <vxe-modal :modelValue="props.value" :title="title" width="30%" @close="handleCancel">
        <template #default>
            <div class="tag-wrap">
                <a-radio-group v-model:value="tabKey" button-style="solid">
                    <a-radio-button :value="1" class="btn-left">基本信息</a-radio-button>
                    <a-radio-button :value="2" v-if="openType === 'edit'">重置密码</a-radio-button>
                </a-radio-group>
            </div>
            <a-form
                ref="formRef"
                :model="formState"
                :rules="rules"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 16 }"
                v-if="tabKey === 1"
            >
                <a-form-item label="账号" name="account">
                    <a-input
                        v-model:value.trim="formState.account"
                        :maxLength="20"
                        placeholder="请输入账号"
                        allowClear
                        :disabled="openType === 'edit'"
                    />
                </a-form-item>
                <a-form-item label="密码" :name="`${openType === 'edit' ? '' : 'password'}`">
                    <a-input
                        v-model:value.trim="formState.password"
                        :maxLength="20"
                        :placeholder="`${openType === 'edit' ? '********' : '请输入密码'}`"
                        allowClear
                        :disabled="openType === 'edit'"
                    />
                </a-form-item>
                <a-form-item label="用户昵称" name="nickname">
                    <a-input
                        v-model:value.trim="formState.nickname"
                        :maxLength="20"
                        placeholder="请输入用户昵称"
                        allowClear
                    />
                </a-form-item>
                <a-form-item label="手机号码" name="phone">
                    <a-input
                        v-model:value.trim="formState.phone"
                        :maxLength="20"
                        placeholder="请输入手机号码"
                        allowClear
                    />
                </a-form-item>
                <a-form-item label="邮箱" name="email">
                    <a-input v-model:value.trim="formState.email" :maxLength="20" placeholder="请输入邮箱" allowClear />
                </a-form-item>
                <a-form-item label="备注" name="desc">
                    <a-textarea
                        v-model:value.trim="formState.desc"
                        :maxlength="50"
                        placeholder="请输入描述"
                        :rows="4"
                    />
                </a-form-item>
                <!-- <a-form-item label="账号状态">
                    <a-switch v-model:checked="formState.enabled" checked-children="启用" un-checked-children="禁用" />
                </a-form-item> -->
            </a-form>
            <a-form
                v-else
                ref="forgetRef"
                :model="forgetState"
                :rules="forgetRules"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 16 }"
            >
                <a-form-item label="账号">
                    <a-input
                        v-model:value.trim="formState.account"
                        :maxLength="20"
                        placeholder="请输入账号"
                        allowClear
                        disabled
                    />
                </a-form-item>
                <a-form-item label="密码" :name="`${openType === 'edit' ? '' : 'newPassword'}`">
                    <a-input
                        v-model:value.trim="forgetState.password"
                        :maxLength="20"
                        :placeholder="`${'请输入密码'}`"
                        allowClear
                    />
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
import { reactive, ref, watch, getCurrentInstance, computed } from 'vue'
import { accountCreateApi, resetPasswordApi } from '@/api/userApi'
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
const tabKey = ref(1)
const loading = ref(false)
const formRef = ref(null)
const forgetRef = ref(null)
// 新增编辑表单
const formState = reactive({
    account: '',
    password: '',
    nickname: '',
    phone: '',
    email: '',
    desc: '',
    enabled: false
})
// 重置密码
const forgetState = reactive({
    newAccount: '',
    password: ''
})
const validateNickname = (_rule, value) => {
    if (!value) return Promise.resolve()

    // 中文字符
    const chineseCount = (value.match(/[\u4e00-\u9fa5]/g) || []).length
    // 非中文字符
    const otherCount = value.length - chineseCount

    // 中文算 2，其他算 1
    const length = chineseCount * 2 + otherCount

    if (length < 4) {
        return Promise.reject('用户名称最少 2 个汉字或 4 个字符')
    }

    if (length > 16) {
        return Promise.reject('用户名称最多 8 个汉字或 16 个字符')
    }

    return Promise.resolve()
}
// 规则
const rules = {
    email: [
        { message: '请输入邮箱' },
        {
            pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            message: '邮箱格式不正确'
        }
    ],
    account: [
        {
            required: true,
            message: '请输入账号名称',
            trigger: 'blur'
        }
    ],

    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
            validator: (_, value, callback) => {
                if (!value) return callback()
                const baseReg = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{6,20}$/
                if (!baseReg.test(value)) {
                    return callback(new Error('密码需为6-20位字母、数字或符号'))
                }
                const types = [
                    /[A-Za-z]/.test(value),
                    /\d/.test(value),
                    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)
                ].filter(Boolean).length

                if (types < 2) {
                    return callback(new Error('密码需至少包含字母、数字、符号中的两种'))
                }
                callback()
            },
            trigger: 'blur'
        }
    ],
    nickname: [
        { required: true, message: '请输入用户名称', trigger: 'blur' },
        { validator: validateNickname, trigger: 'blur' }
    ]
}
// 重置密码规则
const forgetRules = {
    newAccount: [
        {
            required: true,
            message: '请输入账号名称',
            trigger: 'blur'
        }
    ],
    newPassword: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
            validator: (_, value, callback) => {
                if (!value) return callback()
                const baseReg = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{6,20}$/
                if (!baseReg.test(value)) {
                    return callback(new Error('密码需为6-20位字母、数字或符号'))
                }
                const types = [
                    /[A-Za-z]/.test(value),
                    /\d/.test(value),
                    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)
                ].filter(Boolean).length

                if (types < 2) {
                    return callback(new Error('密码需至少包含字母、数字、符号中的两种'))
                }
                callback()
            },
            trigger: 'blur'
        }
    ]
}
const title = computed(() => {
    switch (props.openType) {
        case 'add':
            return '新建账号'
        case 'edit':
            return '编辑账号'
        default:
            throw new Error('无效的 openType')
    }
})
watch(
    () => props.value,
    (visible) => {
        if (!visible) {
            resetForm()
        }
    }
)
watch(
    () => [props.openType, props.data?.id],
    ([type, id]) => {
        if (type === 'edit' && id) {
            const data = props.data
            formState.id = data.id
            formState.account = data.account || ''
            formState.password = ''
            formState.nickname = data.nickname || ''
            formState.phone = data.phone || ''
            formState.email = data.email || ''
            formState.desc = data.desc || ''
            formState.enabled = !!data.enabled
        } else {
            resetForm()
        }
    }
)
const emit = defineEmits(['update:value', 'onOk'])
// 提交
const handleConfirm = () => {
    if (tabKey.value === 1) {
        submitBaseForm()
    } else {
        submitPasswordForm()
    }
}

// 信息
const submitBaseForm = () => {
    formRef.value.validate().then(() => {
        loading.value = true
        const submitData = {
            account: formState.account,
            password: formState.password,
            nickname: formState.nickname,
            phone: formState.phone,
            email: formState.email,
            desc: formState.desc
        }
        if (props.openType === 'edit') {
            submitData.id = formState.id
        }
        accountCreateApi(submitData)
            .then(() => {
                proxy.$message.success(props.openType === 'edit' ? '修改成功' : '新增成功')
                emit('onOk')
                handleCancel()
                resetForm()
                resetForgetForm()
            })
            .catch((err) => {
                // 出错
                // console.log(err)
                loading.value = false
            })
            .finally(() => {
                loading.value = false
            })
    })
}
// 重置密码
const submitPasswordForm = () => {
    forgetRef.value.validate().then(() => {
        loading.value = true
        const submitData = {
            // account: forgetState.newAccount,
            account: formState.account,
            newPassword: forgetState.password
        }
        resetPasswordApi(submitData)
            .then(() => {
                proxy.$message.success('密码重置成功')
                // resetForgetForm()
                // resetForm()
                resetForgetForm()
                handleCancel()
            })
            .finally(() => (loading.value = false))
    })
}
// 添加重置表单的函数
const resetForm = () => {
    Object.assign(formState, {
        id: null,
        account: '',
        password: '',
        nickname: '',
        phone: '',
        email: '',
        desc: '',
        enabled: false
    })
    forgetState.newAccount = ''
    forgetState.password = ''
}
// 重置密码表单
const resetForgetForm = () => {
    tabKey.value = 1
    forgetState.password = ''
    forgetRef.value?.clearValidate()
}

defineExpose({ resetForm, resetForgetForm })
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
