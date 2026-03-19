<template>
    <vxe-modal :modelValue="props.value" :title="title" width="30%" @close="handleCancel">
        <template #default>
            <a-form
                ref="formRef"
                :model="formState"
                :rules="rules"
                :label-col="{ span: 5 }"
                :wrapper-col="{ span: 20 }"
            >
                <!-- 风控条件名称 -->
                <a-form-item label="风控条件名称" name="name">
                    <a-input
                        v-model:value.trim="formState.name"
                        :maxLength="20"
                        placeholder="请输入风控条件名称"
                        allowClear
                        style="width: 300px"
                    />
                </a-form-item>
                <!-- 逻辑关系 -->
                <a-form-item label="逻辑关系" name="logicType">
                    <a-radio-group v-model:value="formState.logicType">
                        <a-radio :value="1">与(&)</a-radio>
                        <a-radio :value="2">或(|)</a-radio>
                        <a-radio :value="3">与非(!&)</a-radio>
                        <a-radio :value="4">或非(!|)</a-radio>
                    </a-radio-group>
                </a-form-item>
                <!-- 监控字段类型 -->
                <a-form-item label="监控字段" name="fieldType">
                    <a-select
                        v-model:value="formState.fieldType"
                        :options="fieldTypeOptions"
                        placeholder="请选择监控字段"
                        style="width: 180px"
                    />
                </a-form-item>
                <!-- 条件类型 -->
                <a-form-item label="参数条件" name="paramCond">
                    <a-radio-group v-model:value="formState.paramCond" button-style="solid">
                        <a-radio-button
                            style="margin-right: 10px; border-radius: 0"
                            v-for="opt in paramCondOptions"
                            :key="opt.value"
                            :value="opt.value"
                        >
                            {{ opt.label }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>

                <!-- 参数值 -->
                <a-form-item label="参数值" name="paramValue">
                    <a-input-number
                        v-model:value="formState.paramValue"
                        style="width: 180px"
                        :precision="8"
                        placeholder="请输入参数值"
                    />
                </a-form-item>

                <a-form-item label="状态">
                    <a-switch v-model:checked="formState.enabled" checked-children="启用" un-checked-children="禁用" />
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
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const emit = defineEmits(['update:value', 'confirm'])
const props = defineProps({
    value: Boolean,
    data: Object,
    condType: {
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
    name: '', // 风控条件名称
    logicType: null, // 与其他条件的逻辑关系
    fieldType: null, // 监控字段
    paramCond: null, // 参数条件

    paramValue: '', // 参数值

    enabled: true
})
// 监控字段类型
const fieldTypeOptions = [
    { label: '下注金额(单次)', value: 1 },
    { label: '发奖金额(单次)', value: 2 },
    { label: '总支出(全局)', value: 3 },
    { label: 'RTP(全局)', value: 4 },
    { label: 'JACKPOT(单次)', value: 5 },
    { label: '下注失败后返款(单次)', value: 6 },
    { label: '下注金额（今日）', value: 7 },
    { label: '发奖金额（今日）', value: 8 },
    { label: '总支出（单次）', value: 9 },
    { label: 'RTP(单次)', value: 10 }
]
const paramCondOptions = [
    { label: '=', value: 1 }, // 等于
    { label: '≠', value: 2 }, // 不等于
    { label: '<', value: 3 }, // 小于
    { label: '>', value: 4 }, // 大于
    { label: '≤', value: 5 }, // 小于等于
    { label: '≥', value: 6 } // 大于等于
]

const rules = {
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    logicType: [{ required: true, message: '请选择逻辑关系', trigger: 'change' }],
    fieldType: [{ required: true, message: '请选择监控字段', trigger: 'change' }],
    paramCond: [{ required: true, message: '请选择参数条件', trigger: 'change' }],
    paramValue: [{ required: true, message: '请输入参数值', trigger: 'blur' }]
}
const title = computed(() => {
    switch (props.condType) {
        case 'add':
            return '新增条件'
        case 'edit':
            return '编辑条件'
        default:
            throw new Error('无效的 condType')
    }
})
watch(
    [() => props.condType, () => props.data],
    ([type, data]) => {
        if (type === 'edit' && data) {
            console.log('13123====>', data)
            formState.id = data.id || null
            formState.name = data.name || ''
            formState.logicType = data.logicType || null

            formState.fieldType = data.fieldType || null
            formState.paramCond = data.paramCond || null

            formState.paramValue = data.paramValue || ''
            formState.enabled = data.enabled || true
        } else {
            formState.id = null
            formState.name = ''
            formState.logicType = null
            formState.fieldType = null
            formState.paramCond = null

            formState.paramValue = ''
            formState.enabled = true
        }
    },
    { immediate: true }
)

const handleConfirm = () => {
    formRef.value.validate().then(() => {
        const submitData = {
            ...formState
        }
        if (props.condType === 'edit') {
            submitData.id = formState.id
        }
        emit('confirm', submitData)
        resetForm()
        handleCancel()
    })
}
// 添加重置表单的函数
const resetForm = () => {
    formState.id = null
    formState.name = ''
    formState.logicType = null
    formState.fieldType = null
    formState.paramCond = null

    formState.paramValue = ''
    formState.enabled = true
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
.radio-gap {
    display: flex;
    //   gap: 8px;
    border: none;
}

.radio-gap .ant-radio-button-wrapper {
    border-radius: 6px;
}
.radio-clean .ant-radio-button-wrapper:not(:first-child)::before {
    display: none !important;
}
</style>
