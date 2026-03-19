<template>
    <vxe-modal :modelValue="props.value" title="修改密码" width="30%" @close="handleCancel">
        <template #default>
            <a-form ref="formRef" :model="formState" :rules="rules" :label-col="{ span: 6 }"
                :wrapper-col="{ span: 16 }">
                <a-form-item label="旧密码" name="oldPassword">
                    <a-input v-model:value.trim="formState.oldPassword" placeholder="请输入旧密码" allowClear />
                </a-form-item>
                <a-form-item label="新密码" name="password">
                    <a-input v-model:value.trim="formState.password" placeholder="请输入新密码" allowClear />
                </a-form-item>
                <a-form-item label="确认新密码" name="confirmNewPsw">
                    <a-input v-model:value.trim="formState.confirmNewPsw" placeholder="请再次输入新密码" allowClear />
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

import { reactive, ref, toRaw, getCurrentInstance } from 'vue'
import { updatePassword } from '@/api/systemApi'

const { proxy } = getCurrentInstance()
const props = defineProps({
    value: Boolean,
    id: Number,
})

const loading = ref(false)
const formRef = ref(null)
const formState = reactive({
    oldPassword: '',
    password: '',
    confirmNewPsw: ''
})

const validateConfirmPassword = (rule, value, callback) => {
    if (!value)
        return callback(new Error('请输入确认密码'))
    if (value != formState.password) {
        callback(new Error('两次输入的密码不一致!'));
    } else {
        callback();
    }
}

const rules = {
    oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'change' }],
    password: [{ required: true, message: '请输入新密码', trigger: 'change' }],
    confirmNewPsw: [{ required: true, validator: validateConfirmPassword, }]
}

const emit = defineEmits(['update:value', 'onOk'])
const handleConfirm = () => {
    formRef.value.validate().then(() => {
        updatePassword({ ...formState, id: props.id }).then(res => {
            loading.value = true
            emit('onOk', toRaw(formState))
            formRef.value.resetFields()
            proxy.$message.success('修改成功')
            handleCancel()
        })

    })
}

const handleCancel = () => {
    emit('update:value', false)
}
</script>
