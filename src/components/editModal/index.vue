<template>
    <vxe-modal :modelValue="props.value" :title="userInfo.value?.accountName" width="30%" @close="handleCancel">
        <template #default>
            <a-tabs v-model:activeKey="activeTab">
                <!-- 基本信息 -->
                <a-tab-pane key="base" tab="基本信息">
                    <a-form
                        ref="formRef"
                        :rules="rules"
                        :model="formState"
                        :label-col="{ span: 5 }"
                        :wrapper-col="{ span: 16 }"
                        name="formState"
                    >
                        <a-form-item label="账号" name="account">
                            <a-input v-model:value="formState.account" placeholder="请输入账号" disabled />
                        </a-form-item>
                        <a-form-item label="密码">
                            <a-input v-model:value="formState.password" placeholder="***********" disabled />
                        </a-form-item>
                        <a-form-item label="用户昵称">
                            <a-input v-model:value="formState.nickname" placeholder="请输入用户昵称" />
                        </a-form-item>
                        <a-form-item label="手机号码">
                            <a-input v-model:value="formState.phone" placeholder="请输入手机号码" />
                        </a-form-item>
                        <a-form-item label="邮箱" name="email">
                            <a-input v-model:value="formState.email" placeholder="请输入邮箱" />
                        </a-form-item>
                        <a-form-item label="备注">
                            <a-textarea
                                v-model:value="formState.desc"
                                placeholder="请输入备注"
                                :auto-size="{ minRows: 2, maxRows: 5 }"
                            />
                        </a-form-item>
                    </a-form>
                </a-tab-pane>
                <!-- 重置密码 -->
                <a-tab-pane key="reset" tab="重置密码">
                    <a-form
                        :label-col="{ span: 6 }"
                        :wrapper-col="{ span: 14 }"
                        :model="resetForm"
                        ref="resetFormRef"
                        :rules="rules"
                        name="resetForm"
                    >
                        <a-form-item label="账号" name="account">
                            <a-input v-model:value="resetForm.account" disabled />
                        </a-form-item>
                        <a-form-item label="旧密码" name="oldPassword">
                            <a-input-password v-model:value="resetForm.oldPassword" placeholder="请输入旧密码" />
                        </a-form-item>
                        <a-form-item label="新密码" name="newPassword">
                            <a-input-password v-model:value="resetForm.newPassword" placeholder="请输入新密码" />
                        </a-form-item>
                        <a-form-item label="确认新密码" name="confirmPassword">
                            <a-input-password
                                v-model:value="resetForm.confirmPassword"
                                placeholder="请再次输入新密码"
                            />
                        </a-form-item>
                    </a-form>
                </a-tab-pane>
                <!-- 找回密码 -->
                <a-tab-pane key="recover" tab="找回密码">
                    <a-form
                        :label-col="{ span: 6 }"
                        :wrapper-col="{ span: 14 }"
                        ref="recoverFormRef"
                        :rules="rules"
                        :model="recoverForm"
                        name="recoverForm"
                    >
                        <a-form-item label="账号" name="account">
                            <a-input v-model:value="recoverForm.account" disabled />
                        </a-form-item>
                        <a-form-item label="邮箱" name="email">
                            <a-input v-model:value="recoverForm.email" placeholder="请输入邮箱" />
                        </a-form-item>
                        <a-form-item label="验证码" name="code">
                            <a-input-group compact style="display: flex">
                                <a-input v-model:value="recoverForm.code" placeholder="请输入验证码" style="flex: 1" />
                                <a-button
                                    type="primary"
                                    :disabled="codeDisabled"
                                    @click="handleSendCode"
                                    style="margin-left: 8px"
                                >
                                    {{ codeText }}
                                </a-button>
                            </a-input-group>
                        </a-form-item>
                        <a-form-item label="新密码">
                            <a-input-password v-model:value="recoverForm.newPassword" placeholder="请输入新密码" />
                        </a-form-item>
                    </a-form>
                </a-tab-pane>
            </a-tabs>
        </template>

        <template #footer>
            <a-space>
                <a-button @click="handleCancel">取消</a-button>
                <a-button type="primary" :loading="loading" @click="handleConfirm">确定</a-button>
            </a-space>
        </template>
    </vxe-modal>
</template>
<script setup>
import { reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { resetPasswordApi, accountCreateApi, sendSmsApi, verifyCode } from '@/api/userApi'
import useUserStore from '@/stores/modules/userStore'
import { message } from 'ant-design-vue'
import { useLogout } from '@/hooks/usehandlogout'
const emit = defineEmits(['update:value', 'submit'])
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
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const { handleLogout } = useLogout()
const loading = ref(false)
const activeTab = ref('base')
const formRef = ref(null)
const resetFormRef = ref(null)
const recoverFormRef = ref(null)
const formState = reactive({
    account: userInfo.value?.value?.accountName,
    password: '',
    phone: '',
    email: '',
    desc: '',
    nickname: ''
})

const resetForm = reactive({
    account: userInfo.value?.value?.accountName,
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const recoverForm = reactive({
    account: userInfo.value?.value?.accountName,
    email: '',
    code: '',
    newPassword: ''
})
const codeDisabled = ref(false)
const codeText = ref('获取验证码')
let timer = null
const COUNTDOWN = 60
// const title = computed(() => (props.openType === 'add' ? '个人资料' : '编辑用户'))
const handleCancel = () => {
    emit('update:value', false)
}
// 倒计时
const startCountdown = () => {
    let time = COUNTDOWN
    codeDisabled.value = true
    codeText.value = `${time}s`

    timer = setInterval(() => {
        time--
        codeText.value = `${time}s`
        if (time <= 0) {
            clearInterval(timer)
            timer = null
            codeDisabled.value = false
            codeText.value = '重新获取'
        }
    }, 1000)
}
const handleSendCode = async () => {
    if (!recoverForm.email) {
        return message.warning('请先填写邮箱')
    }
    try {
        const isEmail = userInfo.value?.value?.isBoundEMail
        await sendSmsApi({ email: recoverForm.email, reason: isEmail ? 2 : 1 })
        message.success('验证码已发送')
        startCountdown()
    } catch (e) {
        message.error('发送失败，请稍后重试')
    }
}

//  确定
const handleConfirm = () => {
    switch (activeTab.value) {
        case 'base':
            handleUserInfo()
            return
        case 'reset':
            handleResetForm()
            return
        case 'recover':
            handleRecoverForm()
            return
    }
}
// 校验规则
const rules = {
    account: { required: true, message: '请输入账户名', trigger: 'blur' },
    code: { required: true, message: '请输入验证码', trigger: 'blur' },
    email: [
        { required: true, message: '请输入邮箱' },
        {
            pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            message: '邮箱格式不正确'
        }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        {
            pattern: /^[A-Za-z0-9~!@#$%^&*()_\-+=\[\]{}|;:'",.<>/?]{6,20}$/,
            message: '密码需为6-20个字母、数字或符号',
            trigger: 'blur'
        }
    ],
    oldPassword: [
        { required: true, message: '请输入旧密码', trigger: 'blur' },
        {
            pattern: /^[A-Za-z0-9~!@#$%^&*()_\-+=\[\]{}|;:'",.<>/?]{6,20}$/,
            message: '密码需为6-20个字母、数字或符号',
            trigger: 'blur'
        }
    ],
    newPassword: [
        { required: true, message: '请输入确认密码', trigger: 'blur' },
        {
            pattern: /^[A-Za-z0-9~!@#$%^&*()_\-+=\[\]{}|;:'",.<>/?]{6,20}$/,
            message: '密码需为6-20个字母、数字或符号',
            trigger: 'blur'
        },
        {
            validator: (_, value) => {
                if (!value) return Promise.resolve()
                if (value === resetForm.oldPassword) {
                    return Promise.reject('新密码不能和旧密码相同')
                }
                return Promise.resolve()
            },
            trigger: ['blur', 'change']
        }
    ],
    confirmPassword: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        {
            validator: (_, value) => {
                if (!value) return Promise.resolve()
                if (value !== resetForm.newPassword) {
                    return Promise.reject('两次输入的新密码不一致')
                }
                return Promise.resolve()
            },
            trigger: ['blur', 'change']
        }
    ]
}
// 个人信息
const handleUserInfo = async () => {
    try {
        loading.value = true
        await formRef.value?.validate()
        // 2️⃣ 提交
        await accountCreateApi({
            ...formState,
            id: userInfo.value?.value?.accountId
        })
        formRef.value?.resetFields()
        emit('onOk')
        message.success('修改成功')

        handleCancel()
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}
// 重置密码
const handleResetForm = async () => {
    try {
        loading.value = true
        await resetFormRef.value?.validate()
        const isSpuer = userInfo.value?.value?.isSuper
        const params = {
            oldPassword: resetForm.oldPassword,
            newPassword: resetForm.newPassword
        }
        if (isSpuer) {
            params.account = userInfo.value?.value?.accountName
        }
        // 2️⃣ 提交
        await resetPasswordApi(params)
        resetFormRef.value?.resetFields()
        emit('onOk')
        // message.success('修改成功')
        resetForm.newPassword = ''
        resetForm.oldPassword = ''
        handleLogout('修改成功,请重新登录')
        handleCancel()
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}
// 找回密码
const handleRecoverForm = async () => {
    try {
        loading.value = true
        await recoverFormRef.value?.validate()
        // 2️⃣ 提交
        await verifyCode({
            ...recoverForm
        })
        recoverFormRef.value?.resetFields()
        emit('onOk')
        message.success('修改成功')
        recoverForm.code = ''
        recoverForm.email = ''
        recoverForm.newPassword = ''
        handleCancel()
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}
const resetFormAll = () => {
    resetForm.confirmPassword = ''
    resetForm.newPassword = ''
    resetForm.oldPassword = ''
    formState.desc = ''
    formState.email = ''
    formState.nickname = ''
    formState.phone = ''
    recoverForm.code = ''
    recoverForm.email = ''
    recoverForm.newPassword = ''
}
watch(
    () => props.value,
    (va) => {
        if (!va) {
            resetFormAll()
            activeTab.value = 'base'
        }
    }
)
</script>
<style lang="scss"></style>
