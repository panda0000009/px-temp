<template>
    <vxe-modal :modelValue="props.value" title="添加邮箱" width="25%" @close="handleCancel">
        <template #default>
            <a-form ref="formRef" :model="formState" :rules="rules">
                <a-form-item label="邮箱列表" name="emails">
                    <a-textarea
                        v-model:value="formState.emails"
                        placeholder="请输入邮箱列表(用逗号,隔开)"
                        :auto-size="{ minRows: 5, maxRows: 5 }"
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
import { reactive, ref, watch, getCurrentInstance } from 'vue'
import { addMailApi } from '@/api/riskApi'
const { proxy } = getCurrentInstance()
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
const { t } = useI18n()
const emit = defineEmits(['update:value', 'onOk'])
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
const loading = ref(false)
const formRef = ref(null)
const formState = reactive({
    emails: ''
})
const rules = {
    emails: [
        {
            required: true,
            message: '至少输入一个邮箱',
            trigger: 'blur'
        }
    ]
}

watch(
    [() => props.openType, () => props.data],
    ([type, data]) => {
        if (type === 'edit' && data) {
            formState.emails = data.emails || ''
        } else {
            formState.emails = ''
        }
    },
    { immediate: true }
)
const formatEmails = (val) => {
    if (Array.isArray(val)) return val
    return (
        val
            // 统一中文符号 → 英文符号
            .replace(/，/g, ',')
            .replace(/；/g, ';')
            .replace(/\s/g, '')
            .split(/,|;|\n/)
            .filter(Boolean)
    )
}
const handleConfirm = () => {
    formRef.value.validate().then(() => {
        loading.value = true
        const submitData = {
            emails: formatEmails(formState.emails)
        }
        addMailApi(submitData)
            .then(() => {
                proxy.$message.success(props.openType === 'edit' ? '修改成功' : '新增成功')
                emit('onOk')
                handleCancel()
                // 关键：在成功回调中手动重置表单
                resetForm()
            })
            .catch((err) => {
                // 出错
                message.error('邮箱已存在!')
                console.log(err)
            })
            .finally(() => {
                loading.value = false
            })
    })
}
// 添加重置表单的函数
const resetForm = () => {
    formState.emails = ''
}
watch(
    () => props.value,
    (v) => {
        if (!v) {
            resetForm()
        }
    }
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
</style>
