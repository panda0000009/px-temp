<template>
    <vxe-modal :modelValue="value" title="设置BaseRtp" width="25%" @close="handleCancel">
        <template #default>
            <a-form ref="formRef" :model="formState" :rules="rules">
                <a-form-item label="游戏ID" name="gameId">
                    <a-select
                        v-model:value="formState.gameId"
                        allowClear
                        placeholder="请选择游戏ID"
                        :filter-option="false"
                        style="width: 100%"
                    >
                        <a-select-option v-for="item in gameList" :key="item.id" :value="item.id">
                            {{ item.gameName }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="基础RTP" name="baseRTP">
                    <a-input-number
                        v-model:value="formState.baseRTP"
                        placeholder="请输入基础 RTP"
                        string-mode
                        addon-after="%"
                        style="width: 100%"
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
import { setBaseRtpApi } from '@/api/merchant'
const { proxy } = getCurrentInstance()
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
const { t } = useI18n()
const emit = defineEmits(['update:value', 'onOk'])
const props = defineProps({
    value: Boolean,
    gameList: {
        type: Array,
        default: []
    }
})
const loading = ref(false)
const formRef = ref(null)
const formState = reactive({
    gameId: null,
    baseRTP: ''
})
const rules = {
    gameId: [
        {
            required: true,
            message: '请选择需要设置的游戏',
            trigger: 'change'
        }
    ],
    baseRTP: [
        {
            required: true,
            message: '请输入 baseRTP',
            trigger: 'blur'
        }
    ]
}

const handleConfirm = () => {
    formRef.value.validate().then(() => {
        loading.value = true
        const submitData = {
            ...formState
        }
        setBaseRtpApi(submitData)
            .then(() => {
                proxy.$message.success('修改成功')
                emit('onOk')
                handleCancel()
                formRef.value?.resetFields()
            })
            .catch((err) => {
                message.error(err)
                console.log(err)
            })
            .finally(() => {
                loading.value = false
            })
    })
}

watch(
    () => props.value,
    (val) => {
        if (!val) {
            formRef.value?.resetFields()
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
