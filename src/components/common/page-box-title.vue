/*
*  @ 通用 page-box 标题栏组件
*  @
*/
<template>
    <div class="page-box-title" :class="type">
        <!-- 标题 -->
        <div v-if="hasTitleContent" class="title-box">
            <div v-if="title" class="title" :class="getTitleClass()">
                {{ title }}
                <span v-if="tipTxt"> {{ tipTxt }}</span>
            </div>
            <div v-if="subtitle" class="subtitle">{{ subtitle }}</div>
        </div>

        <!-- 自定义插槽 -->
        <div v-if="$slots.default" class="slot-wrap">
            <slot></slot>
        </div>

        <!-- 按钮栏 -->
        <div class="btn-wrap" :class="!hasTitleContent ? 'whole-line' : ''">
            <div v-if="leftButtonList.length > 0" class="btn-group">
                <a-button
                    v-for="(button, index) in leftButtonList"
                    :key="getButtonKey(button, index, 'left')"
                    :type="getButtonType(button)"
                    :danger="getButtonDanger(button)"
                    :ghost="Boolean(button.ghost)"
                    :loading="getButtonLoading(button)"
                    :disabled="getButtonDisabled(button)"
                    @click="handleButtonClick(button)"
                >
                    {{ getButtonLabel(button, index) }}
                </a-button>
            </div>
            <div v-if="rightButtonList.length > 0" class="btn-group is-right">
                <a-button
                    v-for="(button, index) in rightButtonList"
                    :key="getButtonKey(button, index, 'right')"
                    :type="getButtonType(button)"
                    :danger="getButtonDanger(button)"
                    :ghost="Boolean(button.ghost)"
                    :loading="getButtonLoading(button)"
                    :disabled="getButtonDisabled(button)"
                    @click="handleButtonClick(button)"
                >
                    {{ getButtonLabel(button, index) }}
                </a-button>
            </div>
        </div>

        <button v-if="isFoldable" type="button" class="fold-wrap" @click="switchFold">
            <CaretUpOutlined v-if="isFolded" />
            <CaretDownOutlined v-else />
        </button>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons-vue'

defineOptions({
    name: 'page-box-title'
})

const props = defineProps({
    // 类型 sub
    type: { type: String, default: '' },
    // 标题
    title: { type: String, default: '' },
    // 标题后添加的信息
    tipTxt: { type: String, default: '' },
    // 小标题
    subtitle: { type: String, default: '' },
    // 按钮列表
    buttonList: {
        type: Array,
        default: () => {
            return []
        }
    },
    // 是否支持折叠展开
    isFoldable: { type: Boolean, default: false },
    // 默认是否折叠
    isFoldedDefault: { type: Boolean, default: false },
    // 是否加粗标题
    isStrongTitle: { type: Boolean, default: false },
    // 是否彩色
    hasColor: { type: Boolean, default: false },
    // 标题按钮rowData
    titleButtonRowData: { type: Object, default: null },
    // page-box 实例
    pageBoxRef: { type: Object, default: null }
})

const isFolded = ref(false)
const hasAppliedDefaultFold = ref(false)

const hasTitleContent = computed(() => Boolean(props.title || props.subtitle))

const normalizedButtonList = computed(() =>
    props.buttonList.map((button) => ({
        ...button,
        float: button.float || 'right'
    }))
)

const leftButtonList = computed(() => normalizedButtonList.value.filter((button) => button.float === 'left'))
const rightButtonList = computed(() => normalizedButtonList.value.filter((button) => button.float !== 'left'))

const resolvePageBoxInstance = () => {
    if (props.pageBoxRef && typeof props.pageBoxRef === 'object' && 'value' in props.pageBoxRef) {
        return props.pageBoxRef.value
    }

    return props.pageBoxRef
}

const readFoldedValue = (instance) => {
    if (!instance) {
        return false
    }

    if (typeof instance.isFolded === 'boolean') {
        return instance.isFolded
    }

    if (typeof instance.isFolded?.value === 'boolean') {
        return instance.isFolded.value
    }

    return false
}

const syncFoldState = () => {
    isFolded.value = readFoldedValue(resolvePageBoxInstance())
}

const ensureDefaultFoldState = async () => {
    const instance = resolvePageBoxInstance()

    if (!props.isFoldedDefault || hasAppliedDefaultFold.value || !instance) {
        return
    }

    if (typeof instance.setFolded === 'function') {
        instance.setFolded(true)
    } else if (typeof instance.switchFold === 'function' && !readFoldedValue(instance)) {
        instance.switchFold()
    }

    hasAppliedDefaultFold.value = true
    await nextTick()
    syncFoldState()
}

const evaluateMaybeFunction = (value, button) => {
    if (typeof value === 'function') {
        return value(props.titleButtonRowData, button)
    }

    return value
}

const getTitleClass = () => {
    const list = []

    if (props.isStrongTitle) {
        list.push('is-strong')
    }
    if (props.hasColor) {
        list.push('has-color')
    }

    return list
}

const getButtonLabel = (button, index) => button.label || button.text || `按钮${index + 1}`

const getButtonKey = (button, index, position) => button.key || `${position}-${button.label || button.text || index}`

const getButtonType = (button) => {
    const type = button.type || 'default'

    if (['primary', 'dashed', 'link', 'text', 'default'].includes(type)) {
        return type
    }

    return 'default'
}

const getButtonDanger = (button) => button.type === 'danger' || Boolean(button.danger)

const getButtonLoading = (button) => Boolean(evaluateMaybeFunction(button.loading, button))

const getButtonDisabled = (button) => Boolean(evaluateMaybeFunction(button.disabled, button))

const handleButtonClick = async (button) => {
    const handler = button.function || button.onClick

    if (typeof handler === 'function') {
        await handler(props.titleButtonRowData, button)
    }
}

const switchFold = async () => {
    const instance = resolvePageBoxInstance()

    if (instance && typeof instance.switchFold === 'function') {
        instance.switchFold()
        await nextTick()
        syncFoldState()
        return
    }

    isFolded.value = !isFolded.value
}

watch(
    () => props.pageBoxRef,
    async () => {
        await nextTick()
        await ensureDefaultFoldState()
        syncFoldState()
    },
    { immediate: true }
)

onMounted(async () => {
    await nextTick()
    await ensureDefaultFoldState()
    syncFoldState()
})
</script>

<style lang="scss" scoped>
.page-box-title {
    --page-box-accent: #1677ff;
    --page-box-danger: #ff4d4f;

    padding: 5px 15px;
    min-height: 47px;
    border-bottom: 1px solid #eee;
    overflow: auto;
    display: flex;
    align-items: center;
    gap: 12px;

    .title-box {
        min-width: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        margin-right: auto;
    }

    .title {
        color: #333;
        min-height: 36px;
        line-height: 36px;

        span {
            color: var(--page-box-danger);
        }
    }

    .subtitle {
        color: #888;
        margin-top: -4px;
        padding-bottom: 6px;
    }

    .slot-wrap {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .is-strong {
        font-size: 16px;
        font-weight: bold;
    }

    .has-color {
        color: var(--page-box-accent);
    }

    .fold-wrap {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        width: 32px;
        cursor: pointer;
        border-radius: 4px;
        margin: 0 0 0 6px;
        border: 0;
        background: transparent;
        color: #666;

        &:hover {
            background-color: #f3f6f9;
        }
    }

    .btn-wrap {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: auto;

        &.whole-line {
            width: 100%;
        }
    }

    .btn-group {
        display: flex;
        align-items: center;
        gap: 8px;

        &.is-right {
            margin-left: auto;
        }
    }

    &.sub {
        min-height: 30px;
        border-bottom: 0;

        .title {
            min-height: 20px;
            line-height: 20px;
        }
    }

    &.under-bread {
        min-height: 48px;
        border-top: 1px solid #eee;
        margin-top: 24px;
    }
}
</style>
