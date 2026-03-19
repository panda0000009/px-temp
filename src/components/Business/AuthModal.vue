<template>
    <vxe-modal :modelValue="props.value" :title="title" width="55%" @close="handleCancel">
        <template #default>
            <div class="page page--modal">
                <div class="page__container">
                    <a-descriptions v-if="props.openType == 'identity'" :labelStyle="labelStyle"
                        :contentStyle="contentStyle" :column="2" bordered size="middle">
                        <a-descriptions-item label="身份证人像面" :span="1">
                            <a-image :src="props.curRow.frontUrl" :width="50" :height="50" />
                        </a-descriptions-item>
                        <a-descriptions-item label="身份证国徽面">
                            <a-image :src="props.curRow.backUrl" :width="50" :height="50" />
                        </a-descriptions-item>
                        <a-descriptions-item label="真实姓名">{{ props.curRow.name }}</a-descriptions-item>
                        <a-descriptions-item label="身份证号">{{ props.curRow.identificationNumber }}</a-descriptions-item>
                        <a-descriptions-item label="地址">
                            {{ props.curRow.address }}
                        </a-descriptions-item>
                        <a-descriptions-item label="有效期限">
                            {{ props.curRow.expirationStart }} -{{ props.curRow.expirationEnd }}
                        </a-descriptions-item>
                    </a-descriptions>

                    <template v-if="props.openType == 'carInfo'">
                        <div class="page__title">
                            <span class="page__title--text">驾驶证信息</span>
                        </div>
                        <a-descriptions :labelStyle="labelStyle" :contentStyle="contentStyle" :column="2" bordered
                            size="middle">
                            <a-descriptions-item label="驾驶证主页">
                                <a-image :src="props.curRow.drivingMainUrl" :width="50" :height="50" />
                            </a-descriptions-item>
                            <a-descriptions-item label="驾驶证副页">
                                <a-image :src="props.curRow.drivingSubUrl" :width="50" :height="50" />
                            </a-descriptions-item>
                            <a-descriptions-item label="姓名">
                                {{ props.curRow.name }}
                            </a-descriptions-item>
                            <a-descriptions-item label="驾驶证号">
                                {{ props.curRow.drivingLicenseNumber }}
                            </a-descriptions-item>
                            <a-descriptions-item label="准驾车型">
                                {{ props.curRow.allowDrivingType }}
                            </a-descriptions-item>
                            <a-descriptions-item label="档案编号">
                                {{ props.curRow.drivingArchivesNumber }}
                            </a-descriptions-item>
                            <a-descriptions-item label="发证机关">
                                {{ props.curRow.drivingIssuingAuthority }}
                            </a-descriptions-item>
                            <a-descriptions-item label="有效期限">
                                {{ props.curRow.expirationStart }} - {{ props.curRow.expirationEnd }}
                            </a-descriptions-item>
                        </a-descriptions>
                        <div class="page__title">
                            <span class="page__title--text">车辆行驶证信息</span>
                        </div>
                        <a-descriptions :labelStyle="labelStyle" :contentStyle="contentStyle" :column="2" bordered
                            size="middle">
                            <a-descriptions-item label="行驶证主页">
                                <a-image :src="props.curRow.vehicleMainUrl" :width="50" :height="50" />
                            </a-descriptions-item>
                            <a-descriptions-item label="行驶证副页">
                                <a-image :src="props.curRow.vehicleSubUrl" :width="50" :height="50" />
                            </a-descriptions-item>
                            <a-descriptions-item label="车辆类型">
                                {{ props.curRow.vehileType }}
                            </a-descriptions-item>
                            <a-descriptions-item label="所有人">
                                {{ props.curRow.belongs }}
                            </a-descriptions-item>
                            <a-descriptions-item label="使用性质">
                                {{ props.curRow.useCharacter }}
                            </a-descriptions-item>
                            <a-descriptions-item label="档案编号">
                                {{ props.curRow.vehileArchivesNumber }}
                            </a-descriptions-item>
                            <a-descriptions-item label="总质量(kg)">
                                {{ props.curRow.totalWeight }} kg
                            </a-descriptions-item>
                            <a-descriptions-item label="核定载重质量(kg)">
                                {{ props.curRow.approvedLoadWeight }} kg
                            </a-descriptions-item>
                            <a-descriptions-item label="车辆识别代号">
                                {{ props.curRow.vehicleIdentificationNumber }}
                            </a-descriptions-item>
                            <a-descriptions-item label="发证机关">
                                {{ props.curRow.vehicleIssuingAuthority }}
                            </a-descriptions-item>
                            <a-descriptions-item label="发动机号">
                                {{ props.curRow.engineNumber }}
                            </a-descriptions-item>
                            <a-descriptions-item label="整备质量(kg)">
                                {{ props.curRow.curbWeight }}
                            </a-descriptions-item>
                            <a-descriptions-item label="注册日期">
                                {{ props.curRow.registrationDate }}
                            </a-descriptions-item>
                            <a-descriptions-item label="发证日期">
                                {{ props.curRow.vehicleIssuingDate }}
                            </a-descriptions-item>
                            <a-descriptions-item label="检验有效期">
                                {{ props.curRow.inspectionValidityDate }}
                            </a-descriptions-item>
                        </a-descriptions>
                        <div class="page__title">
                            <span class="page__title--text">其他信息</span>
                        </div>
                        <a-descriptions :labelStyle="labelStyle" :contentStyle="contentStyle" :column="2" bordered
                            size="middle">
                            <a-descriptions-item label="品牌型号">
                                {{ props.curRow.brandModel }}
                            </a-descriptions-item>
                            <a-descriptions-item label="核载人数">{{ props.curRow.approvedLoadNumber }}</a-descriptions-item>
                            <a-descriptions-item label="强制报废期">{{ props.curRow.scrapDate }}</a-descriptions-item>
                            <a-descriptions-item label="外廓长度">{{ props.curRow.outerLength }}</a-descriptions-item>
                            <a-descriptions-item label="外廓宽度">{{props.curRow.outerWidth }}</a-descriptions-item>
                            <a-descriptions-item label="外廓高度">{{ props.curRow.outerHeight }}</a-descriptions-item>
                        </a-descriptions>
                        <div class="page__title">
                            <span class="page__title--text">车辆照片</span>
                        </div>
                        <a-descriptions :labelStyle="labelStyle" :contentStyle="contentStyle" :column="2" bordered
                            size="middle">
                            <a-descriptions-item label="车辆正面">
                                <a-image
                                    :src="props.curRow.vehicleFrontUrl"
                                    :width="50" :height="50" />
                            </a-descriptions-item>
                            <a-descriptions-item label="车辆侧面">
                                <a-image
                                    :src="props.curRow.vehicleSideUrl"
                                    :width="50" :height="50" />
                            </a-descriptions-item>
                            <a-descriptions-item label="车辆后面">
                                <a-image
                                    :src="props.curRow.vehicleBackUrl"
                                    :width="50" :height="50" />
                            </a-descriptions-item>
                            <a-descriptions-item label="本人和车辆正面">
                                <a-image
                                    :src="props.curRow.vehicleDriverFrontUrl"
                                    :width="50" :height="50" />
                            </a-descriptions-item>
                            <a-descriptions-item label="车牌号码">{{ props.curRow.vehicleNumber }}</a-descriptions-item>
                            <a-descriptions-item label="车辆能源类型">{{props.curRow.energyType }}</a-descriptions-item>
                            <a-descriptions-item label="板车类型">{{ props.curRow.boardLicenseType === 1 ? '蓝牌' :'黄牌' }}</a-descriptions-item>
                        </a-descriptions>
                    </template>

                    <a-descriptions v-if="props.openType == 'insurance'" :labelStyle="labelStyle"
                        :contentStyle="contentStyle" :column="2" bordered size="middle">
                        <a-descriptions-item label="保险单主页" :span="1">
                            <a-image :src="props.curRow.mainUrl" :width="50" :height="50" />
                        </a-descriptions-item>
                        <a-descriptions-item label="保险单副页">
                            <a-image :src="props.curRow.subUrl" :width="50" :height="50" />
                        </a-descriptions-item>
                        <a-descriptions-item label="保险单号">{{ props.curRow.insuranceNumber }}</a-descriptions-item>
                        <a-descriptions-item label="保险公司名称">{{ props.curRow.insuranceCompany }}</a-descriptions-item>
                        <a-descriptions-item label="有效期限">{{ props.curRow.expirationStart }} -{{ props.curRow.expirationEnd
                            }}</a-descriptions-item>
                        <a-descriptions-item label="保险类型">{{ props.curRow.insuranceType }}</a-descriptions-item>
                    </a-descriptions>
                </div>

                <a-form ref="formRef" :model="formState" :rules="rules" :label-col="{ span: 3 }"
                    :wrapper-col="{ span: 20 }">
                    <a-form-item :class="{ 'form__item': formState.auditState == 0 }" label="审核结果" required>
                        <a-radio-group v-model:value="formState.auditState">
                            <a-radio :value="1">通过</a-radio>
                            <a-radio :value="2">不通过</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item v-if="formState.auditState === 2" class="form__item" label="不通过原因" name="description">
                        <a-textarea v-model:value.trim="formState.description" placeholder="请输入不通过原因" :maxLength="200"
                            :autoSize="{ minRows: 4, maxRows: 4 }" allowClear />
                    </a-form-item>
                </a-form>
            </div>
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
import { ref, reactive, computed,getCurrentInstance } from 'vue'
import {auditTaskaudit} from '@/api/userApi'
const { proxy } = getCurrentInstance()
const props = defineProps({
    value: Boolean,
    openType: {
        type: String,
        default: 'identity',
        validator: (value) => ['identity', 'carInfo', 'insurance'].includes(value)
    },
    curRow: Object,
  
})

const title = computed(() => {
    const text = '审核'
    switch (props.openType) {
        case 'identity':
            return `${text}-实名认证`
        case 'carInfo':
            return `${text}-车辆信息`
        case 'insurance':
            return `${text}-保险信息`
        default:
            throw new Error('无效的 openType')
    }
})

const labelStyle = { width: '160px', minWidth: '160px', maxWidth: '160px' }
const contentStyle = { width: 'calc(100% / 2)' }
const loading = ref(false)
const formRef = ref(null)
const formState = reactive({
    auditState: 1,
    description: ''
})
const rules = {
    remark: [{ required: true, message: '请输入不通过原因', trigger: 'change' }]
}

const emit = defineEmits(['update:value', 'onOk'])
const handleConfirm = () => {
    formRef.value.validate().then(async () => {
        console.log(111)
        try {
            loading.value = true
            await auditTaskaudit({...formState,id:props.curRow.id || props.curRow.auditTaskId})
          
            // const api = props.openType === 'add' ? createActivity : updateActivity
            // await api(formState)
            loading.value = false
            proxy.$message.success('操作成功')
            emit('onOk')
            handleCancel()
        } catch (error) {
            console.error(`保存失败：${error}`)
            loading.value = false
        }
    })
}
const handleCancel = () => {
    emit('update:value', false)
}
</script>

<style lang="scss" scoped>
.page {
    padding: 0 10px;

    :deep(.ant-image) {
        display: table-cell;
    }

    &__title {
        &:not(&:nth-of-type(1)) {
            padding-top: 10px;
        }
    }

    &__container {
        margin-bottom: 20px;
        overflow: hidden auto;
    }
}

.form__item {
    margin: 0 !important;
}
</style>
