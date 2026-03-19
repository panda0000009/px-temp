<template>
    <div class="default-form-demo">
        <a-card title="普通表单 Demo" class="default-form-demo__card">
            <a-space wrap class="default-form-demo__actions">
                <a-button type="primary" @click="handleMainValidate">校验主表单</a-button>
                <a-button @click="handleMainReset">重置主表单</a-button>
                <a-button @click="handleRefreshCustomField">刷新自定义字段</a-button>
            </a-space>

            <DefaultForm
                ref="mainFormRef"
                :form-data="mainFormData"
                :form-items="mainFormItems"
                :form-button-list="mainButtonList"
                :component-map="componentMap"
                :form-style="{ itemSpan: 8, itemGutter: 20, labelWidth: 110 }"
            />

            <a-divider />
            <pre class="default-form-demo__json">{{ mainFormData }}</pre>
        </a-card>

        <a-card title="查询表单 Demo" class="default-form-demo__card">
            <a-space wrap class="default-form-demo__actions">
                <a-button type="primary" @click="handleSearchValidate">校验查询表单</a-button>
                <a-button @click="handleSaveSearchData">保存查询条件</a-button>
                <a-button @click="handleRestoreSearchData">读取查询条件</a-button>
                <a-button @click="toggleAdvanced">切换高级字段</a-button>
            </a-space>

            <DefaultForm
                ref="searchFormRef"
                form-type="search"
                :form-data="searchFormData"
                :form-items="searchFormItems"
                :form-button-list="searchButtonList"
                :component-map="componentMap"
                :form-style="{ itemSpan: 8, itemGutter: 20, labelWidth: 100 }"
                :btn-wrap-style="{ wrapAlign: 'left' }"
            />

            <a-divider />
            <div class="default-form-demo__state">
                <div>
                    <h4>当前查询条件</h4>
                    <pre class="default-form-demo__json">{{ searchFormData }}</pre>
                </div>
                <div>
                    <h4>最近一次保存结果</h4>
                    <pre class="default-form-demo__json">{{ savedSearchData }}</pre>
                </div>
            </div>
        </a-card>
    </div>
</template>

<script setup>
import { computed, defineComponent, h, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'

import DefaultForm from '@/components/common/default-form.vue'

const DemoStatusField = defineComponent({
    name: 'DemoStatusField',
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        data: {
            type: Object,
            default: () => ({})
        },
        rowData: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ['update:modelValue', 'change'],
    setup(props, { emit, expose }) {
        const errorMessage = ref('')

        const doValidate = async () => {
            if (!props.modelValue) {
                errorMessage.value = '请选择接入状态'
                return {
                    isSuccess: false,
                    errorMessage: errorMessage.value
                }
            }

            errorMessage.value = ''
            return {
                isSuccess: true,
                errorMessage: ''
            }
        }

        const clearValidateData = () => {
            errorMessage.value = ''
        }

        const setValidateObjError = (messageText) => {
            errorMessage.value = messageText
        }

        expose({
            doValidate,
            clearValidateData,
            setValidateObjError
        })

        return () =>
            h('div', { class: 'demo-status-field' }, [
                h(
                    'span',
                    {
                        class: ['demo-status-field__tag', props.modelValue === 'online' ? 'is-online' : 'is-offline']
                    },
                    props.modelValue === 'online' ? '在线' : props.modelValue === 'offline' ? '离线' : '未设置'
                ),
                h(
                    'button',
                    {
                        class: 'demo-status-field__button',
                        type: 'button',
                        onClick: () => {
                            const nextValue = props.modelValue === 'online' ? 'offline' : 'online'
                            emit('update:modelValue', nextValue)
                            emit('change', nextValue)
                        }
                    },
                    '切换'
                ),
                errorMessage.value
                    ? h('div', { class: 'demo-status-field__error' }, errorMessage.value)
                    : null
            ])
    }
})

const mainFormRef = ref(null)
const searchFormRef = ref(null)
const showAdvanced = ref(false)
const savedSearchData = ref({})

const componentMap = {
    DemoStatusField
}

const mainFormData = reactive({
    title: '示例活动',
    category: undefined,
    keywords: ['首发'],
    enabled: true,
    channelList: ['app'],
    auditState: 'approved',
    publishDate: '2026-03-19 10:30:00',
    statusPreview: 'online',
    coverList: [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80'
    ]
})

const mainFormItems = computed(() => [
    { label: '标题', field: 'title', type: 'input', isRequired: true, maxlength: 30, itemMsg: '说明：标题最长 30 个字符。' },
    { label: '活动分类', field: 'category', type: 'select', isRequired: true, options: categoryOptions },
    { label: '关键词', field: 'keywords', type: 'select-list', allowCreate: true, options: keywordOptions },
    { label: '启用状态', field: 'enabled', type: 'switch', activeText: '启用', inactiveText: '停用' },
    { label: '通知渠道', field: 'channelList', type: 'checkbox-list', options: channelOptions, span: 12, isRequired: true },
    { label: '审核结果', field: 'auditState', type: 'radio-list', styleBtn: true, options: auditOptions, span: 12 },
    { label: '上线时间', field: 'publishDate', type: 'date-picker', pickType: 'datetime', span: 12, isRequired: true },
    {
        label: '接入状态',
        field: 'statusPreview',
        componentName: 'DemoStatusField',
        span: 12,
        validate: {
            isRequired: true
        }
    },
    {
        label: '封面预览',
        field: 'coverList',
        type: 'image-list',
        span: 24,
        itemMsg: '说明：当前项目没有旧工程的上传型图片组件，这里演示预览型能力。'
    },
    {
        label: '状态文案',
        field: 'statusText',
        type: 'text',
        span: 24,
        formatter: ({ row }) => `当前标题《${row.title || '-'}》处于${row.enabled ? '启用' : '停用'}状态`
    }
])

const mainButtonList = [
    {
        label: '提交',
        type: 'primary',
        function: async () => {
            const valid = await mainFormRef.value?.validateForm()
            if (!valid) {
                message.error('主表单校验未通过')
                return
            }
            message.success('主表单校验通过')
        }
    },
    {
        label: '重置',
        buttonType: 'resetForm'
    }
]

const searchFormData = reactive({
    keyword: '',
    status: undefined,
    createdRange: [],
    onlyRisk: false,
    advancedTag: ''
})

const searchFormItems = computed(() => [
    {
        label: () => (searchFormData.keyword ? '关键词（已填写）' : '关键词'),
        field: 'keyword',
        type: 'input',
        clearable: true
    },
    {
        label: '状态',
        field: 'status',
        type: 'select',
        options: statusOptions,
        clearable: true
    },
    {
        label: '创建时间',
        field: 'createdRange',
        type: 'date-picker',
        isRange: true,
        span: 12
    },
    {
        label: '只看风控',
        field: 'onlyRisk',
        type: 'switch',
        span: 12
    },
    {
        label: '高级标签',
        field: 'advancedTag',
        type: 'input',
        span: 12,
        isShow: () => showAdvanced.value,
        itemMsg: () => (showAdvanced.value ? '说明：这是动态显隐字段。' : '')
    }
])

const searchButtonList = [
    {
        label: '查询',
        type: 'primary',
        function: async () => {
            const valid = await searchFormRef.value?.validateForm()
            if (!valid) {
                message.error('查询条件校验未通过')
                return
            }
            message.success('查询条件校验通过')
        }
    },
    {
        label: '重置',
        buttonType: 'resetForm'
    }
]

const categoryOptions = [
    { label: '公告', value: 'notice' },
    { label: '活动', value: 'activity' },
    { label: '系统', value: 'system' }
]

const keywordOptions = [
    { label: '首发', value: '首发' },
    { label: '推荐', value: '推荐' },
    { label: '限时', value: '限时' }
]

const channelOptions = [
    { label: 'APP', value: 'app' },
    { label: '短信', value: 'sms' },
    { label: '邮件', value: 'email' }
]

const auditOptions = [
    { label: '通过', value: 'approved' },
    { label: '待审', value: 'pending' },
    { label: '驳回', value: 'rejected' }
]

const statusOptions = [
    { label: '全部', value: 'all' },
    { label: '启用', value: 'enabled' },
    { label: '停用', value: 'disabled' }
]

const handleMainValidate = async () => {
    const valid = await mainFormRef.value?.validateForm()
    message[valid ? 'success' : 'error'](valid ? '主表单校验通过' : '主表单校验未通过')
}

const handleMainReset = () => {
    mainFormRef.value?.resetForm()
}

const handleRefreshCustomField = () => {
    mainFormRef.value?.refreshItem('statusPreview')
}

const handleSearchValidate = async () => {
    const valid = await searchFormRef.value?.validateForm()
    message[valid ? 'success' : 'error'](valid ? '查询表单校验通过' : '查询表单校验未通过')
}

const handleSaveSearchData = () => {
    searchFormRef.value?.saveSearchData(searchFormData)
    savedSearchData.value = searchFormRef.value?.getSearchData?.() || {}
    message.success('已保存当前查询条件')
}

const handleRestoreSearchData = () => {
    const cache = searchFormRef.value?.getSearchData?.() || {}
    Object.assign(searchFormData, cache)
    message.success('已回填最近一次保存的查询条件')
}

const toggleAdvanced = () => {
    showAdvanced.value = !showAdvanced.value
}
</script>

<style lang="scss" scoped>
.default-form-demo {
    padding: 24px;

    &__card + &__card {
        margin-top: 24px;
    }

    &__actions {
        margin-bottom: 16px;
    }

    &__state {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &__json {
        margin: 0;
        padding: 16px;
        border-radius: 8px;
        background: #f7f8fa;
        color: #334155;
        overflow: auto;
    }
}

.demo-status-field {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;

    &__tag {
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        color: #fff;

        &.is-online {
            background: #16a34a;
        }

        &.is-offline {
            background: #f59e0b;
        }
    }

    &__button {
        padding: 4px 10px;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        background: #fff;
        cursor: pointer;
    }

    &__error {
        width: 100%;
        color: #ff4d4f;
        font-size: 12px;
    }
}

@media (max-width: 900px) {
    .default-form-demo {
        &__state {
            grid-template-columns: 1fr;
        }
    }
}
</style>
