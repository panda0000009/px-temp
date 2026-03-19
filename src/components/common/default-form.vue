/*
*  @ 全局通用表单组件
*  @
*/
<template>
    <div v-if="!refreshTag" class="default-form" :style="formContainerStyle">
        <a-form ref="formRef" :model="formData" :layout="formLayout" :disabled="isReadOnly" @submit.prevent>
            <a-row :gutter="styleState.itemGutter">
                <!-- formItem遍历 -->
                <a-col
                    v-for="(item, key) in normalizedFormItems"
                    :key="getItemKey(item, key)"
                    :span="getItemSpan(item)"
                    :style="getColStyle(item)"
                >
                    <template v-if="checkItemIsLoad(item)">
                        <div v-if="item.type === 'block'" v-show="checkItemIsShow(item)" class="default-form__block"></div>
                        <a-form-item
                            v-else
                            v-show="checkItemIsShow(item)"
                            class="default-form__item"
                            :style="getItemStyle(item)"
                            :help="getFieldError(item.field) || null"
                            :validate-status="getValidateStatus(item.field)"
                        >
                            <!-- 自定义label -->
                            <template #label v-if="item.label || item.type === 'block'">
                                <span class="label-wrap" :class="checkItemIsRequired(item) ? 'is-required' : ''">
                                    <span v-html="getLabel(item)"></span>
                                </span>
                            </template>

                            <!-- 绘制表单组件 -->
                            <template v-if="getRendererKind(item) === 'custom'">
                                <component
                                    :is="resolveCustomComponent(item)"
                                    :ref="(instance) => setFieldComponentRef(item.field, instance)"
                                    :model-value="formData[item.field]"
                                    :value="formData[item.field]"
                                    :data="item"
                                    :row-data="formData"
                                    :validate="item.validate"
                                    :read-only="isReadOnly"
                                    :disabled="getItemDisabled(item)"
                                    @update:modelValue="(value) => handleCustomModelUpdate(item, value)"
                                    @update:value="(value) => handleCustomModelUpdate(item, value)"
                                    @change="() => handleCustomComponentChange(item)"
                                />
                            </template>

                            <template v-else-if="getRendererKind(item) === 'input'">
                                <a-textarea
                                    v-if="isTextareaItem(item)"
                                    :value="formData[item.field]"
                                    :rows="Number(item.rows || 3)"
                                    :maxlength="item.maxlength"
                                    :show-count="Boolean(item.showWordLimit)"
                                    :placeholder="getItemPlaceholder(item)"
                                    :allow-clear="Boolean(item.clearable)"
                                    :disabled="getItemDisabled(item)"
                                    :readonly="getItemReadonly(item)"
                                    :auto-size="item.autosize || false"
                                    @update:value="(value) => handleInputModelUpdate(item, value)"
                                    @change="(event) => handleInputChange(item, event)"
                                    @input="(event) => handleInputInput(item, event)"
                                    @blur="() => callFunction(item.onBlur, getItemContext(item), formData[item.field])"
                                    @focus="() => callFunction(item.onFocus, getItemContext(item), formData[item.field])"
                                />
                                <div v-else-if="hasInputButton(item)" class="default-form__input-with-button">
                                    <a-input
                                        :value="formData[item.field]"
                                        :maxlength="item.maxlength"
                                        :placeholder="getItemPlaceholder(item)"
                                        :allow-clear="Boolean(item.clearable)"
                                        :disabled="getItemDisabled(item)"
                                        :readonly="getItemReadonly(item)"
                                        :type="item.inputType || 'text'"
                                        @update:value="(value) => handleInputModelUpdate(item, value)"
                                        @change="(event) => handleInputChange(item, event)"
                                        @input="(event) => handleInputInput(item, event)"
                                    />
                                    <a-button
                                        :loading="Boolean(inputButtonLoadingMap[item.field])"
                                        :disabled="getItemDisabled(item)"
                                        @click="handleInputButtonClick(item)"
                                    >
                                        {{ item.btnLabel || '更多' }}
                                    </a-button>
                                </div>
                                <a-input
                                    v-else
                                    :value="formData[item.field]"
                                    :maxlength="item.maxlength"
                                    :placeholder="getItemPlaceholder(item)"
                                    :allow-clear="Boolean(item.clearable)"
                                    :disabled="getItemDisabled(item)"
                                    :readonly="getItemReadonly(item)"
                                    :type="item.inputType || 'text'"
                                    @update:value="(value) => handleInputModelUpdate(item, value)"
                                    @change="(event) => handleInputChange(item, event)"
                                    @input="(event) => handleInputInput(item, event)"
                                >
                                    <template v-if="getAddonText(item.prepend, item)" #addonBefore>
                                        {{ getAddonText(item.prepend, item) }}
                                    </template>
                                    <template v-if="getAddonText(item.append, item)" #addonAfter>
                                        {{ getAddonText(item.append, item) }}
                                    </template>
                                </a-input>
                            </template>

                            <template v-else-if="getRendererKind(item) === 'input-number'">
                                <a-input-number
                                    :value="formData[item.field]"
                                    :min="item.min"
                                    :max="item.max"
                                    :step="item.step"
                                    :precision="item.precision"
                                    :placeholder="getItemPlaceholder(item)"
                                    :disabled="getItemDisabled(item)"
                                    style="width: 100%"
                                    @change="(value) => handleNumberChange(item, value)"
                                />
                            </template>

                            <template v-else-if="getRendererKind(item) === 'select'">
                                <a-select
                                    :value="formData[item.field]"
                                    :mode="item.multiple ? 'multiple' : undefined"
                                    :options="getSelectOptions(item)"
                                    :placeholder="getItemPlaceholder(item)"
                                    :allow-clear="item.clearable !== false"
                                    :disabled="getItemDisabled(item)"
                                    style="width: 100%"
                                    @change="(value, option) => handleSelectChange(item, value, option)"
                                />
                            </template>

                            <template v-else-if="getRendererKind(item) === 'select-list'">
                                <a-select
                                    :value="formData[item.field]"
                                    :mode="item.allowCreate ? 'tags' : 'multiple'"
                                    :options="getSelectOptions(item)"
                                    :placeholder="getItemPlaceholder(item)"
                                    :allow-clear="item.clearable !== false"
                                    :disabled="getItemDisabled(item)"
                                    :max-tag-count="item.maxTagCount || 'responsive'"
                                    style="width: 100%"
                                    @change="(value, option) => handleSelectListChange(item, value, option)"
                                />
                            </template>

                            <template v-else-if="getRendererKind(item) === 'switch'">
                                <a-switch
                                    :checked="getSwitchCheckedValue(item)"
                                    :checked-children="item.activeText"
                                    :un-checked-children="item.inactiveText"
                                    :disabled="getItemDisabled(item)"
                                    @change="(checked) => handleSwitchChange(item, checked)"
                                />
                            </template>

                            <template v-else-if="getRendererKind(item) === 'checkbox'">
                                <a-checkbox
                                    :checked="getCheckboxCheckedValue(item)"
                                    :disabled="getItemDisabled(item)"
                                    @change="(event) => handleCheckboxChange(item, event)"
                                >
                                    {{ item.checkboxLabel || item.text || '' }}
                                </a-checkbox>
                            </template>

                            <template v-else-if="getRendererKind(item) === 'checkbox-list'">
                                <a-checkbox-group
                                    :value="Array.isArray(formData[item.field]) ? formData[item.field] : []"
                                    :options="getCheckboxOptions(item)"
                                    :disabled="getItemDisabled(item)"
                                    @change="(value) => handleCheckboxListChange(item, value)"
                                />
                            </template>

                            <template v-else-if="getRendererKind(item) === 'radio-list'">
                                <a-radio-group
                                    :value="formData[item.field]"
                                    :button-style="item.buttonStyle || (item.styleBtn ? 'solid' : 'outline')"
                                    :disabled="getItemDisabled(item)"
                                    @change="(event) => handleRadioChange(item, event)"
                                >
                                    <template v-for="option in getCheckboxOptions(item)" :key="`${item.field}-${option.value}`">
                                        <a-radio-button v-if="item.styleBtn" :value="option.value" :disabled="option.disabled">
                                            {{ option.label }}
                                        </a-radio-button>
                                        <a-radio v-else :value="option.value" :disabled="option.disabled">{{ option.label }}</a-radio>
                                    </template>
                                </a-radio-group>
                            </template>

                            <template v-else-if="getRendererKind(item) === 'date-picker'">
                                <a-range-picker
                                    v-if="item.isRange"
                                    :value="Array.isArray(formData[item.field]) ? formData[item.field] : []"
                                    :picker="getDatePickerMode(item)"
                                    :show-time="getDateShowTime(item)"
                                    :placeholder="getRangePlaceholder(item)"
                                    :value-format="getDateValueFormat(item)"
                                    :disabled="getItemDisabled(item)"
                                    :allow-clear="item.clearable !== false"
                                    style="width: 100%"
                                    @change="(value, valueText) => handleDateChange(item, value, valueText)"
                                />
                                <a-date-picker
                                    v-else
                                    :value="formData[item.field]"
                                    :picker="getDatePickerMode(item)"
                                    :show-time="getDateShowTime(item)"
                                    :placeholder="getItemPlaceholder(item)"
                                    :value-format="getDateValueFormat(item)"
                                    :disabled="getItemDisabled(item)"
                                    :allow-clear="item.clearable !== false"
                                    style="width: 100%"
                                    @change="(value, valueText) => handleDateChange(item, value, valueText)"
                                />
                            </template>

                            <template v-else-if="getRendererKind(item) === 'time-picker'">
                                <div v-if="item.isRange" class="default-form__time-range">
                                    <a-time-picker
                                        :value="getTimeRangeValue(item.field)[0]"
                                        :placeholder="getRangePlaceholder(item)[0]"
                                        :value-format="getTimeValueFormat(item)"
                                        :disabled="getItemDisabled(item)"
                                        style="width: calc(50% - 12px)"
                                        @change="(value) => handleTimeRangeChange(item, 0, value)"
                                    />
                                    <span class="default-form__time-range-separator">-</span>
                                    <a-time-picker
                                        :value="getTimeRangeValue(item.field)[1]"
                                        :placeholder="getRangePlaceholder(item)[1]"
                                        :value-format="getTimeValueFormat(item)"
                                        :disabled="getItemDisabled(item)"
                                        style="width: calc(50% - 12px)"
                                        @change="(value) => handleTimeRangeChange(item, 1, value)"
                                    />
                                </div>
                                <a-time-picker
                                    v-else
                                    :value="formData[item.field]"
                                    :placeholder="getItemPlaceholder(item)"
                                    :value-format="getTimeValueFormat(item)"
                                    :disabled="getItemDisabled(item)"
                                    style="width: 100%"
                                    @change="(value) => handleTimeChange(item, value)"
                                />
                            </template>

                            <template v-else-if="getRendererKind(item) === 'cascader'">
                                <a-cascader
                                    :value="formData[item.field]"
                                    :options="getCascaderOptions(item)"
                                    :field-names="item.props || item.fieldNames"
                                    :placeholder="getItemPlaceholder(item)"
                                    :allow-clear="item.clearable !== false"
                                    :disabled="getItemDisabled(item)"
                                    style="width: 100%"
                                    @change="(value, selectedOptions) => handleCascaderChange(item, value, selectedOptions)"
                                />
                            </template>

                            <template v-else-if="getRendererKind(item) === 'slider'">
                                <a-slider
                                    :value="formData[item.field]"
                                    :min="item.min"
                                    :max="item.max"
                                    :step="item.step"
                                    :disabled="getItemDisabled(item)"
                                    @change="(value) => handleSliderChange(item, value)"
                                />
                            </template>

                            <template v-else-if="getRendererKind(item) === 'dict-select'">
                                <DictSelect
                                    :ref="(instance) => setFieldComponentRef(item.field, instance)"
                                    :value="formData[item.field]"
                                    :dict-code="item.dictCode || ''"
                                    :mode="item.multiple ? 'multiple' : item.mode || 'combobox'"
                                    :placeholder="getItemPlaceholder(item)"
                                    :allow-clear="item.clearable !== false"
                                    :label-field="item.labelField || 'label'"
                                    :value-field="item.valueField || 'value'"
                                    :options="getPlainOptionSource(item)"
                                    :disabled="getItemDisabled(item)"
                                    @update:value="(value) => handleSelectChange(item, value, null)"
                                    @onChange="(value) => handleSelectChange(item, value, null)"
                                />
                            </template>

                            <template v-else-if="getRendererKind(item) === 'input-select'">
                                <InputSelect
                                    :ref="(instance) => setFieldComponentRef(item.field, instance)"
                                    :value="formData[item.field]"
                                    :ids="item.idsField ? formData[item.idsField] : undefined"
                                    :placeholder="getItemPlaceholder(item)"
                                    :btn-text="item.btnText || '选择'"
                                    :max-length="item.maxlength || 100"
                                    :read-only="getItemReadonly(item)"
                                    :allow-clear="item.clearable !== false"
                                    @update:value="(value) => handleInputSelectValueUpdate(item, value)"
                                    @update:ids="(value) => handleInputSelectIdsUpdate(item, value)"
                                    @onSelect="() => callFunction(item.onSelect || item.btnFunction, getItemContext(item))"
                                />
                            </template>

                            <template v-else-if="getRendererKind(item) === 'editor'">
                                <TinymceEditor
                                    :ref="(instance) => setFieldComponentRef(item.field, instance)"
                                    :value="formData[item.field]"
                                    :placeholder="getItemPlaceholder(item)"
                                    :height="Number(item.height || 400)"
                                    :disabled="getItemDisabled(item)"
                                    :valid="checkItemIsRequired(item)"
                                    @update:value="(value) => handleEditorChange(item, value)"
                                    @onChange="(value) => handleEditorChange(item, value)"
                                />
                            </template>

                            <template v-else-if="getRendererKind(item) === 'form-table'">
                                <DefaultTable
                                    :ref="(instance) => setFieldComponentRef(item.field, instance)"
                                    v-bind="getFormTableProps(item)"
                                />
                            </template>

                            <template v-else-if="getRendererKind(item) === 'image' || getRendererKind(item) === 'image-list'">
                                <div class="default-form__images">
                                    <img
                                        v-for="(src, imageIndex) in getImageList(formData[item.field])"
                                        :key="`${item.field || 'image'}-${imageIndex}`"
                                        :src="src"
                                        :alt="item.label || item.field"
                                        :width="item.imageWidth"
                                        :height="item.imageHeight"
                                    />
                                    <span v-if="!getImageList(formData[item.field]).length" class="default-form__empty-text">
                                        {{ item.emptyText || '暂无图片' }}
                                    </span>
                                </div>
                            </template>

                            <template v-else-if="getRendererKind(item) === 'text'">
                                <span class="default-form__text">{{ getTextValue(item) }}</span>
                            </template>

                            <template v-else-if="getRendererKind(item) === 'button'">
                                <a-button
                                    :type="getResolvedButtonType(item)"
                                    :danger="Boolean(item.danger)"
                                    :disabled="getItemDisabled(item)"
                                    @click="handleFieldButtonClick(item)"
                                >
                                    {{ getFieldButtonLabel(item) }}
                                </a-button>
                            </template>

                            <template v-else>
                                <span class="default-form__unsupported">
                                    {{ getUnsupportedMessage(item) }}
                                </span>
                            </template>

                            <!-- 绘制表单提示信息 -->
                            <div v-if="item.itemMsg" class="item-msg">{{ getItemMsg(item) }}</div>
                        </a-form-item>
                    </template>
                </a-col>

                <!-- 操作按钮区域 -->
                <a-col v-if="normalizedButtonList.length" class="btn-wrap" :span="styleState.btnWrapSpan">
                    <a-button
                        v-for="(button, index) in normalButtons"
                        :key="getButtonKey(button, index)"
                        :type="getResolvedButtonType(button)"
                        :danger="Boolean(button.danger)"
                        :disabled="isButtonDisabled(button)"
                        :loading="getButtonLoading(button)"
                        @click="handleButtonClick(button)"
                    >
                        {{ getButtonLabel(button) }}
                    </a-button>
                    <div v-if="centerButtons.length" class="btn-center-line">
                        <a-button
                            v-for="(button, index) in centerButtons"
                            :key="getButtonKey(button, index)"
                            :type="getResolvedButtonType(button)"
                            :danger="Boolean(button.danger)"
                            :disabled="isButtonDisabled(button)"
                            :loading="getButtonLoading(button)"
                            @click="handleButtonClick(button)"
                        >
                            {{ getButtonLabel(button) }}
                        </a-button>
                    </div>
                </a-col>
            </a-row>
        </a-form>
    </div>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'

import DefaultTable from '@/components/common/default-table.vue'
import DictSelect from '@/components/DictSelect/index.vue'
import InputSelect from '@/components/InputSelect/index.vue'
import TinymceEditor from '@/components/TinymceEditor/index.vue'

const DEFAULT_FORM_STYLE = {
    itemSpan: 8,
    itemGutter: 20,
    labelWidth: '90px',
    btnWrapSpan: 24,
    btnWrapAlign: 'right'
}

const BUILTIN_RENDERER_MAP = {
    input: 'input',
    'default-input': 'input',
    'input-number': 'input-number',
    'default-input-number': 'input-number',
    select: 'select',
    'default-select': 'select',
    'select-list': 'select-list',
    'default-select-list': 'select-list',
    switch: 'switch',
    'default-switch': 'switch',
    checkbox: 'checkbox',
    'default-checkbox': 'checkbox',
    'checkbox-list': 'checkbox-list',
    'default-checkbox-list': 'checkbox-list',
    'radio-list': 'radio-list',
    'default-radio-list': 'radio-list',
    'date-picker': 'date-picker',
    'default-date-picker': 'date-picker',
    'time-picker': 'time-picker',
    'default-time-picker': 'time-picker',
    cascader: 'cascader',
    'default-cascader': 'cascader',
    slider: 'slider',
    'default-slider': 'slider',
    text: 'text',
    'default-text': 'text',
    button: 'button',
    'default-button': 'button',
    'dict-select': 'dict-select',
    DictSelect: 'dict-select',
    'input-select': 'input-select',
    InputSelect: 'input-select',
    editor: 'editor',
    'simple-editor': 'editor',
    TinymceEditor: 'editor',
    'tinymce-editor': 'editor',
    'form-table': 'form-table',
    'default-form-table': 'form-table',
    image: 'image',
    'default-image': 'image',
    'image-list': 'image-list',
    'default-image-list': 'image-list'
}

const NAMED_VALIDATORS = {
    email: (value) => ({
        success: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '')),
        errorMsg: '请输入正确的邮箱地址'
    }),
    mobile: (value) => ({
        success: /^1\d{10}$/.test(String(value || '')),
        errorMsg: '请输入正确的手机号码'
    }),
    phone: (value) => ({
        success: /^(\d{3,4}-?)?\d{7,8}$/.test(String(value || '')),
        errorMsg: '请输入正确的电话号码'
    }),
    url: (value) => ({
        success: /^(https?:\/\/|\/)/.test(String(value || '')),
        errorMsg: '请输入正确的链接地址'
    }),
    integer: (value) => ({
        success: /^-?\d+$/.test(String(value || '')),
        errorMsg: '请输入整数'
    }),
    number: (value) => ({
        success: !Number.isNaN(Number(value)),
        errorMsg: '请输入数字'
    })
}

const isFunction = (value) => typeof value === 'function'
const isDefined = (value) => typeof value !== 'undefined'
const isObject = (value) => Object.prototype.toString.call(value) === '[object Object]'
const isComponentLike = (value) =>
    isObject(value) || (isFunction(value) && (value.props || value.setup || value.render || value.__asyncLoader))

const jsonClone = (value) => JSON.parse(JSON.stringify(value ?? null))

const parseNumber = (value, fallback) => {
    const number = Number.parseInt(value, 10)
    return Number.isNaN(number) ? fallback : number
}

const normalizeCssSize = (value, fallback = DEFAULT_FORM_STYLE.labelWidth) => {
    if (!isDefined(value) || value === null || value === '') {
        return fallback
    }

    return typeof value === 'number' ? `${value}px` : String(value)
}

const getEventValue = (event) => {
    if (event && typeof event === 'object' && 'target' in event) {
        return event.target?.value
    }
    return event
}

const getCheckboxEventChecked = (event) => event?.target?.checked

const isEmptyValue = (value) => {
    if (value === '' || value === null || typeof value === 'undefined') {
        return true
    }
    if (Array.isArray(value)) {
        return value.length === 0
    }
    if (isObject(value)) {
        return Object.keys(value).length === 0
    }
    return false
}

const callFunction = (handler, ...args) => {
    if (!isFunction(handler)) {
        return undefined
    }
    return handler(...args)
}

defineOptions({
    name: 'DefaultForm'
})

const props = defineProps({
    // 表单只读控制字段
    readOnly: { type: Boolean, default: false },
    // 表单类型 default, search
    formType: { type: String, default: 'default' },
    // 表单状态 create, edit, view
    formStatus: { type: String, default: 'create' },
    // 表单数据对象
    formData: { type: Object, default: () => ({}) },
    // 多字段校验方法在这配置
    formValidate: { type: Array, default: () => [] },
    // 表单字段配置列表
    formItems: { type: Array, default: () => [] },
    // 表单样式配置对象
    formStyle: { type: Object, default: () => ({}) },
    // 表单按钮配置列表
    formButtonList: { type: Array, default: () => [] },
    // 表单样式配置对象
    btnWrapStyle: { type: Object, default: () => ({}) },
    // 表单标签位置
    labelPosition: { type: String, default: 'right' },
    // 外部组件映射表
    componentMap: { type: Object, default: () => ({}) }
})

const formRef = ref(null)
const refreshTag = ref(false)
const refreshItemTag = ref(false)
const searchData = ref({})
const initialFormData = ref({})
const fieldComponentInstances = reactive({})
const fieldErrorMap = reactive({})
const fieldAdapterCache = reactive({})
const inputButtonLoadingMap = reactive({})
const styleState = reactive({ ...DEFAULT_FORM_STYLE })
const exposedFormApi = {}

const formData = computed(() => props.formData)
const isReadOnly = computed(() => props.readOnly || props.formStatus === 'view')
const formLayout = computed(() => (props.labelPosition === 'top' ? 'vertical' : 'horizontal'))
const formContainerStyle = computed(() => ({
    '--default-form-label-width': styleState.labelWidth
}))

// 对表单传参 formItems 进行默认赋值、校验等初始化的操作
const getItemType = (item) => {
    if (isFunction(item?.type)) {
        return item.type(props.formData)
    }
    return item?.type || item?.componentName || 'input'
}

const setItemDefaultSize = (item) => {
    const type = getItemType(item)
    if (!isDefined(item.size) && !isDefined(item.span)) {
        if (
            type === 'checkbox-list' ||
            type === 'radio-list' ||
            type === 'select-list' ||
            type === 'editor' ||
            type === 'simple-editor' ||
            type === 'image-list' ||
            type === 'form-table' ||
            (type === 'input' && Number(item.rows || 1) > 1)
        ) {
            item.span = 24
        } else {
            item.size = 1
        }
    }
}

const normalizeFormItem = (item = {}) => {
    const nextItem = {
        ...item,
        validate: item.validate ? { ...item.validate } : undefined
    }

    nextItem.type = getItemType(nextItem)
    if (nextItem.type === 'image' || nextItem.type === 'image-list') {
        if (!isDefined(nextItem.imageHeight)) {
            nextItem.imageHeight = 36
        }
        if (!isDefined(nextItem.imageWidth)) {
            nextItem.imageWidth = 36
        }
    }

    setItemDefaultSize(nextItem)

    if (props.formType === 'search' && !isDefined(nextItem.clearable)) {
        nextItem.clearable = true
    }

    if (nextItem.isRequired) {
        nextItem.validate = {
            ...(nextItem.validate || {}),
            isRequired: nextItem.isRequired
        }
    }

    return nextItem
}

const normalizedFormItems = computed(() => props.formItems.map((item) => normalizeFormItem(item)))
const normalizedButtonList = computed(() =>
    props.formButtonList.map((button) => ({
        ...button,
        float: isDefined(button.float) ? button.float : styleState.btnWrapAlign
    }))
)
const normalButtons = computed(() => normalizedButtonList.value.filter((button) => button.float !== 'center'))
const centerButtons = computed(() => normalizedButtonList.value.filter((button) => button.float === 'center'))

// 设置字段对应默认值
const getItemDefaultData = (item) => {
    const type = getItemType(item)
    let data = isDefined(item.defaultValue) ? item.defaultValue : ''

    if (type === 'input-number' || type === 'slider') {
        data = 0
    } else if (type === 'switch') {
        data = isDefined(item.inactiveValue) ? item.inactiveValue : false
    } else if (type === 'checkbox') {
        data = isDefined(item.falseLabel) ? item.falseLabel : false
    } else if (
        type === 'checkbox-list' ||
        type === 'select-list' ||
        type === 'image-list' ||
        type === 'form-table' ||
        (type === 'select' && item.multiple === true) ||
        (type === 'dict-select' && item.multiple === true) ||
        (type === 'time-picker' && item.isRange) ||
        (type === 'date-picker' && item.isRange)
    ) {
        data = []
    }

    return data
}

// 设置表单数据字段值
const setFormDataInit = () => {
    normalizedFormItems.value.forEach((item) => {
        if (isDefined(item.field) && !isDefined(props.formData[item.field])) {
            props.formData[item.field] = getItemDefaultData(item)
        }
    })
}

// 对表单样式进行默认赋值等初始化的操作
const syncFormStyleState = () => {
    styleState.itemSpan = parseNumber(props.formStyle.itemSpan, DEFAULT_FORM_STYLE.itemSpan)
    styleState.itemGutter = parseNumber(props.formStyle.itemGutter, DEFAULT_FORM_STYLE.itemGutter)
    styleState.labelWidth = normalizeCssSize(props.formStyle.labelWidth, DEFAULT_FORM_STYLE.labelWidth)
    styleState.btnWrapSpan = parseNumber(props.btnWrapStyle.wrapSpan, DEFAULT_FORM_STYLE.btnWrapSpan)
    styleState.btnWrapAlign = props.btnWrapStyle.wrapAlign || DEFAULT_FORM_STYLE.btnWrapAlign
}

const captureInitialFormData = () => {
    initialFormData.value = jsonClone(props.formData) || {}
}

watch(
    () => props.formItems,
    () => {
        setFormDataInit()
        captureInitialFormData()
    },
    { immediate: true, deep: true }
)

watch(
    () => props.formData,
    () => {
        setFormDataInit()
        captureInitialFormData()
        refreshForm()
    }
)

watch(
    () => props.formStyle,
    () => {
        syncFormStyleState()
    },
    { immediate: true, deep: true }
)

watch(
    () => props.btnWrapStyle,
    () => {
        syncFormStyleState()
    },
    { immediate: true, deep: true }
)

// 获取组件label
const getItemContext = (item) => ({
    form: exposedFormApi,
    row: props.formData,
    rowData: props.formData,
    item
})

const getLabel = (item) => {
    if (isFunction(item.label)) {
        return item.label(getItemContext(item))
    }
    return item.label || ''
}

const getItemKey = (item, key) => `${item.field || item.type || 'item'}-${key}`

const getColStyle = (item) => {
    const style = { ...(item.colStyle || {}) }
    if (item.showBottomLine) {
        style.borderBottom = '1px solid #DCDFE6'
    }
    return style
}

const getItemStyle = (item) => {
    const style = {}
    if (formLayout.value === 'horizontal') {
        style['--item-label-width'] = normalizeCssSize(item.labelWidth, styleState.labelWidth)
    }
    return style
}

const getItemSpan = (item) => {
    if (isFunction(item.span)) {
        return Number(item.span(getItemContext(item))) || styleState.itemSpan
    }
    if (item.span) {
        return Number(item.span)
    }
    return Number(item.size || 1) * styleState.itemSpan
}

// 判断表单字段是否必填
const checkItemIsRequired = (item) => {
    if (item.validate && isDefined(item.validate.isRequired)) {
        if (isFunction(item.validate.isRequired)) {
            return Boolean(item.validate.isRequired(props.formData))
        }
        return Boolean(item.validate.isRequired)
    }
    return false
}

// 判断表单字段是否加载
const checkItemIsLoad = (item) => {
    if (item.field === refreshItemTag.value) {
        return false
    }
    if (!item.field && item.type !== 'block') {
        return false
    }
    if (typeof item.isLoad === 'function') {
        return item.isLoad(getItemContext(item))
    }
    if (typeof item.isLoad === 'boolean') {
        return item.isLoad
    }
    return true
}

// 判断表单字段是否显示
const checkItemIsShow = (item) => {
    if (!item.field && item.type !== 'block') {
        return false
    }
    if (typeof item.isShow === 'function') {
        return item.isShow(getItemContext(item))
    }
    if (typeof item.isShow === 'boolean') {
        return item.isShow
    }
    return true
}

const getItemMsg = (item) => {
    if (isFunction(item.itemMsg)) {
        return item.itemMsg(props.formData)
    }
    return item.itemMsg || ''
}

const getRendererSource = (item) => {
    if (item.component) {
        if (isComponentLike(item.component)) {
            return { kind: 'custom', value: item.component }
        }
        if (isFunction(item.component)) {
            const resolvedComponent = item.component(getItemContext(item))
            if (resolvedComponent) {
                return isComponentLike(resolvedComponent)
                    ? { kind: 'custom', value: resolvedComponent }
                    : { kind: 'name', value: resolvedComponent }
            }
        }
    }

    let componentName = item.componentName
    if (isFunction(componentName)) {
        componentName = componentName(getItemContext(item))
    }

    if (componentName) {
        return { kind: 'name', value: componentName }
    }

    return { kind: 'type', value: getItemType(item) }
}

const getRendererKind = (item) => {
    const rendererSource = getRendererSource(item)
    if (rendererSource.kind === 'custom') {
        return 'custom'
    }

    const rendererName = String(rendererSource.value || '')
    if (BUILTIN_RENDERER_MAP[rendererName]) {
        return BUILTIN_RENDERER_MAP[rendererName]
    }
    if (props.componentMap?.[rendererName]) {
        return 'custom'
    }
    return 'unsupported'
}

const resolveCustomComponent = (item) => {
    const rendererSource = getRendererSource(item)
    if (rendererSource.kind === 'custom') {
        return rendererSource.value
    }

    const rendererName = String(rendererSource.value || '')
    return props.componentMap?.[rendererName] || null
}

const getUnsupportedMessage = (item) => {
    const rendererSource = getRendererSource(item)
    return `未注册组件：${rendererSource.value || item.type || item.field || 'unknown'}`
}

const getFieldError = (field) => (field ? fieldErrorMap[field] || '' : '')
const setFieldError = (field, message = '') => {
    if (!field) {
        return
    }
    if (message) {
        fieldErrorMap[field] = message
    } else {
        delete fieldErrorMap[field]
    }
}
const clearFieldError = (field) => {
    if (field) {
        delete fieldErrorMap[field]
    }
}
const clearAllFieldErrors = () => {
    Object.keys(fieldErrorMap).forEach((field) => {
        delete fieldErrorMap[field]
    })
}

const getValidateStatus = (field) => (getFieldError(field) ? 'error' : '')

const getResolvedOptionList = (item) => {
    const options = isFunction(item.options) ? item.options(props.formData) : item.options
    return Array.isArray(options) ? options : []
}

const getPlainOptionSource = (item) => getResolvedOptionList(item)

const normalizeOption = (option, item) => {
    const labelField = item.labelField || 'label'
    const valueField = item.valueField || 'value'
    const label = option?.[labelField] ?? option?.name ?? option?.label ?? option?.text ?? option?.title ?? option?.code ?? option?.value
    const value = option?.[valueField] ?? option?.code ?? option?.id ?? option?.value ?? label
    const disabled = isFunction(option?.disabled) ? option.disabled(props.formData) : Boolean(option?.disabled)

    return {
        label,
        value,
        disabled,
        raw: option
    }
}

const getSelectOptions = (item) => getResolvedOptionList(item).map((option) => normalizeOption(option, item))
const getCheckboxOptions = (item) => getResolvedOptionList(item).map((option) => normalizeOption(option, item))
const getCascaderOptions = (item) => getResolvedOptionList(item)

const getItemDisabled = (item) => {
    if (isReadOnly.value) {
        return true
    }
    if (isFunction(item.disabled)) {
        return Boolean(item.disabled(props.formData))
    }
    return Boolean(item.disabled)
}

const getItemReadonly = (item) => {
    if (isReadOnly.value) {
        return true
    }
    if (isFunction(item.readonly)) {
        return Boolean(item.readonly(props.formData))
    }
    return Boolean(item.readonly)
}

const getItemPlaceholder = (item) => {
    if (isDefined(item.placeholder) && item.placeholder !== '') {
        return item.placeholder
    }

    if (item.maxlength && getRendererKind(item) === 'input') {
        return `请输入${item.maxlength}个以内字符`
    }

    if (
        getRendererKind(item) === 'select' ||
        getRendererKind(item) === 'select-list' ||
        getRendererKind(item) === 'date-picker' ||
        getRendererKind(item) === 'time-picker' ||
        getRendererKind(item) === 'dict-select' ||
        getRendererKind(item) === 'cascader' ||
        getRendererKind(item) === 'input-select'
    ) {
        return `请选择${getLabel(item)}`
    }

    return `请输入${getLabel(item)}`
}

const getRangePlaceholder = (item) => [item.startPlaceholder || '开始时间', item.endPlaceholder || '结束时间']
const getDatePickerMode = (item) => ((item.pickType || 'date') === 'datetime' ? 'date' : item.pickType || 'date')
const getDateShowTime = (item) => (item.pickType === 'datetime' ? item.showTime || true : false)

const getDateValueFormat = (item) => {
    if (item.valueFormat) {
        return item.valueFormat
    }
    if (item.pickType === 'datetime') {
        return 'YYYY-MM-DD HH:mm:ss'
    }
    if (item.pickType === 'month') {
        return 'YYYY-MM'
    }
    if (item.pickType === 'year') {
        return 'YYYY'
    }
    return 'YYYY-MM-DD'
}

const getTimeValueFormat = (item) => item.valueFormat || 'HH:mm:ss'
const getTimeRangeValue = (field) => (Array.isArray(props.formData[field]) ? props.formData[field] : [undefined, undefined])
const isTextareaItem = (item) => item.inputType === 'textarea' || Number(item.rows || 1) > 1
const hasInputButton = (item) => (isFunction(item.hasBtn) ? Boolean(item.hasBtn(props.formData)) : Boolean(item.hasBtn))
const getAddonText = (value, item) => (isFunction(value) ? value(props.formData, item) : value || '')

const getImageList = (value) => {
    if (Array.isArray(value)) {
        return value.filter(Boolean)
    }
    if (!value) {
        return []
    }
    return String(value)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
}

const getTextValue = (item) => {
    const value = props.formData[item.field]

    if (isFunction(item.formatter)) {
        const formattedValue = item.formatter({
            item,
            row: props.formData,
            value
        })
        return isDefined(formattedValue) ? formattedValue : ''
    }

    if (isFunction(item.format)) {
        const formattedValue = item.format(props.formData, value)
        return isDefined(formattedValue) ? formattedValue : ''
    }

    if (Array.isArray(value)) {
        return value.join(', ')
    }

    return isDefined(value) ? value : ''
}

const getResolvedButtonType = (button) => {
    const type = isFunction(button.type) ? button.type(props.formData) : button.type
    return type || 'default'
}

const getButtonLabel = (button) => (isFunction(button.label) ? button.label(props.formData) : button.label || '按钮')
const getFieldButtonLabel = (item) => {
    if (isFunction(item.format)) {
        return item.format(props.formData, props.formData[item.field]) || item.label || '按钮'
    }
    return item.buttonLabel || item.label || '按钮'
}
const getButtonLoading = (button) => (isFunction(button.loading) ? Boolean(button.loading(props.formData)) : Boolean(button.loading))
const isButtonDisabled = (button) => (isFunction(button.disabled) ? Boolean(button.disabled(props.formData)) : Boolean(button.disabled))
const getButtonKey = (button, index) => `${button.code || button.label || 'button'}-${index}`

// 获取form对象
const getForm = () => exposedFormApi

// 通过field获取item对象
const getItem = (field) => normalizedFormItems.value.find((item) => item.field === field) || false
const getItemValue = (field) => (isDefined(props.formData[field]) ? props.formData[field] : null)

const setFieldValue = (field, value) => {
    if (field) {
        props.formData[field] = value
    }
}

// 获取item的组件对象
const setFieldComponentRef = (field, instance) => {
    if (!field) {
        return
    }
    if (instance) {
        fieldComponentInstances[field] = instance
    } else {
        delete fieldComponentInstances[field]
    }
}

const getRequiredMessage = (item) => {
    const rendererKind = getRendererKind(item)

    if (rendererKind === 'image' || rendererKind === 'image-list') {
        return item.errorMessage || '请上传图片'
    }

    if (
        rendererKind === 'select' ||
        rendererKind === 'select-list' ||
        rendererKind === 'checkbox' ||
        rendererKind === 'checkbox-list' ||
        rendererKind === 'radio-list' ||
        rendererKind === 'date-picker' ||
        rendererKind === 'time-picker' ||
        rendererKind === 'dict-select' ||
        rendererKind === 'cascader' ||
        rendererKind === 'input-select'
    ) {
        return `请选择${getLabel(item)}`
    }

    return `请输入${getLabel(item)}`
}

const resolveCustomizeValidators = (item) => {
    const customize = item.validate?.customize
    if (isFunction(customize)) {
        return customize(props.formData) || []
    }
    return Array.isArray(customize) ? customize : []
}

const runNamedValidator = async (validatorName, value, item) => {
    if (isFunction(validatorName)) {
        const result = await validatorName({
            value,
            row: props.formData,
            rowData: props.formData,
            item
        })
        return {
            success: result?.success !== false,
            errorMsg: result?.errorMsg || result?.message || ''
        }
    }

    if (validatorName instanceof RegExp) {
        return {
            success: validatorName.test(String(value || '')),
            errorMsg: `${getLabel(item)}格式不正确`
        }
    }

    if (typeof validatorName === 'string' && NAMED_VALIDATORS[validatorName]) {
        return NAMED_VALIDATORS[validatorName](value)
    }

    return {
        success: true,
        errorMsg: ''
    }
}

const validateSingleField = async (field) => {
    const item = getItem(field)
    if (!item || !checkItemIsLoad(item) || item.type === 'button' || item.type === 'block') {
        return { isSuccess: true, errorMessage: '' }
    }

    clearFieldError(field)
    const value = props.formData[field]

    if (checkItemIsRequired(item) && isEmptyValue(value)) {
        const errorMessage = getRequiredMessage(item)
        setFieldError(field, errorMessage)
        return { isSuccess: false, errorMessage }
    }

    const validatorList = resolveCustomizeValidators(item)
    for (const validatorName of validatorList) {
        if (isEmptyValue(value)) {
            break
        }

        const { success, errorMsg } = await runNamedValidator(validatorName, value, item)
        if (!success) {
            setFieldError(field, errorMsg)
            return { isSuccess: false, errorMessage: errorMsg }
        }
    }

    if (isFunction(item.validate?.function)) {
        const result = await item.validate.function({
            value,
            row: props.formData,
            rowData: props.formData,
            item
        })
        if (result?.success === false) {
            setFieldError(field, result.errorMsg || result.message || `${getLabel(item)}校验失败`)
            return {
                isSuccess: false,
                errorMessage: getFieldError(field)
            }
        }
    }

    return { isSuccess: true, errorMessage: '' }
}

const buildFieldAdapter = (field) => ({
    get type() {
        return getItem(field)?.type || ''
    },
    get data() {
        return getItem(field) || {}
    },
    get raw() {
        return fieldComponentInstances[field] || null
    },
    async doValidate() {
        const instance = fieldComponentInstances[field]
        const item = getItem(field)

        if (instance && isFunction(instance.doValidate)) {
            const result = await instance.doValidate()
            if (result?.isSuccess === false) {
                setFieldError(field, result.errorMessage || '')
            } else {
                clearFieldError(field)
            }
            return result || { isSuccess: true, errorMessage: '' }
        }

        if (item?.type === 'form-table' && instance && isFunction(instance.validateTable)) {
            const isSuccess = await instance.validateTable()
            if (isSuccess === false) {
                setFieldError(field, item.errorMessage || `${getLabel(item)}校验失败`)
                return { isSuccess: false, errorMessage: getFieldError(field) }
            }
            clearFieldError(field)
            return { isSuccess: true, errorMessage: '' }
        }

        return validateSingleField(field)
    },
    clearValidateData() {
        clearFieldError(field)
        const instance = fieldComponentInstances[field]
        if (instance && isFunction(instance.clearValidateData)) {
            instance.clearValidateData()
        }
    },
    setValidateObjError(message) {
        setFieldError(field, message)
        const instance = fieldComponentInstances[field]
        if (instance && isFunction(instance.setValidateObjError)) {
            instance.setValidateObjError(message)
        }
    },
    async validateTable() {
        const instance = fieldComponentInstances[field]
        if (instance && isFunction(instance.validateTable)) {
            return instance.validateTable()
        }
        return true
    },
    refresh() {
        refreshItem(field)
    },
    fullfillData() {
        fieldComponentInstances[field]?.fullfillData?.()
    },
    clearSelectIndex() {
        fieldComponentInstances[field]?.clearSelectIndex?.()
    }
})

const getItemComponent = (field) => {
    if (!field) {
        return null
    }

    if (!fieldAdapterCache[field]) {
        fieldAdapterCache[field] = buildFieldAdapter(field)
    }

    return fieldAdapterCache[field]
}

// 获取item的组件对象列表
const getItemComponentList = () =>
    normalizedFormItems.value
        .map((item) => (item.field ? getItemComponent(item.field) : null))
        .filter(Boolean)

// 单字段变更触发多字段校验方法
const checkFormValidate = async (field, value) => {
    if (!props.formValidate.length) {
        return
    }

    for (const line of props.formValidate) {
        if (!Array.isArray(line.fieldList) || line.fieldList.indexOf(field) < 0) {
            continue
        }

        for (const currentField of line.fieldList) {
            const component = getItemComponent(currentField)
            if (component?.doValidate) {
                await component.doValidate()
            }
        }

        const result = await line.function({
            value,
            field,
            row: props.formData,
            rowData: props.formData
        })

        const errorList = Array.isArray(result) ? result : []
        errorList.forEach((errorItem) => {
            if (errorItem?.field) {
                getItemComponent(errorItem.field)?.setValidateObjError(errorItem.errorMsg || `${errorItem.field}校验失败`)
            }
        })
    }
}

const afterFieldValueChange = (item, value) => {
    if (!item?.field) {
        return
    }

    nextTick(() => {
        checkFormValidate(item.field, value)
    })
}

const handleInputModelUpdate = (item, value) => {
    setFieldValue(item.field, value)
}

const handleInputInput = (item, event) => {
    const value = getEventValue(event)
    setFieldValue(item.field, value)
    if (isFunction(item.onInput)) {
        item.onInput({
            value,
            row: props.formData
        })
    }
}

const handleInputChange = (item, event) => {
    const value = getEventValue(event)
    setFieldValue(item.field, value)
    if (isFunction(item.onChange)) {
        item.onChange({
            value,
            row: props.formData
        })
    }
    afterFieldValueChange(item, value)
}

const handleNumberChange = (item, value) => {
    setFieldValue(item.field, value)
    if (isFunction(item.onChange)) {
        item.onChange({ value })
    }
    if (isFunction(item.afterChange)) {
        item.afterChange({ value })
    }
    afterFieldValueChange(item, value)
}

const handleSelectChange = (item, value) => {
    setFieldValue(item.field, value)
    if (isFunction(item.onChange)) {
        item.onChange(value, props.formData)
    }
    if (isFunction(item.afterChange)) {
        item.afterChange(value, props.formData)
    }
    afterFieldValueChange(item, value)
}

const handleSelectListChange = (item, value) => {
    setFieldValue(item.field, value)
    if (isFunction(item.onChange)) {
        item.onChange(value, props.formData)
    }
    if (isFunction(item.afterChange)) {
        item.afterChange(value, props.formData)
    }
    afterFieldValueChange(item, value)
}

const getSwitchActiveValue = (item) => (isDefined(item.activeValue) ? item.activeValue : true)
const getSwitchInactiveValue = (item) => (isDefined(item.inactiveValue) ? item.inactiveValue : false)
const getSwitchCheckedValue = (item) => props.formData[item.field] === getSwitchActiveValue(item)

const handleSwitchChange = (item, checked) => {
    const oldValue = props.formData[item.field]
    const newValue = checked ? getSwitchActiveValue(item) : getSwitchInactiveValue(item)
    setFieldValue(item.field, newValue)
    if (isFunction(item.onChange)) {
        item.onChange({ newVal: newValue, oldVal: oldValue, row: props.formData })
    }
    afterFieldValueChange(item, newValue)
}

const getCheckboxTrueValue = (item) => (isDefined(item.trueLabel) ? item.trueLabel : true)
const getCheckboxFalseValue = (item) => (isDefined(item.falseLabel) ? item.falseLabel : false)
const getCheckboxCheckedValue = (item) => props.formData[item.field] === getCheckboxTrueValue(item)

const handleCheckboxChange = (item, event) => {
    const checked = getCheckboxEventChecked(event)
    const value = checked ? getCheckboxTrueValue(item) : getCheckboxFalseValue(item)
    setFieldValue(item.field, value)
    if (isFunction(item.onChange)) {
        item.onChange({ value, row: props.formData })
    }
    afterFieldValueChange(item, value)
}

const handleCheckboxListChange = (item, value) => {
    setFieldValue(item.field, value)
    if (isFunction(item.onChange)) {
        item.onChange({ value, row: props.formData })
    }
    afterFieldValueChange(item, value)
}

const handleRadioChange = (item, event) => {
    const value = event?.target?.value
    setFieldValue(item.field, value)
    if (isFunction(item.onChange)) {
        item.onChange(props.formData, value)
    }
    afterFieldValueChange(item, value)
}

const handleDateChange = (item, value) => {
    setFieldValue(item.field, value)
    if (isFunction(item.onChange)) {
        item.onChange({ value, row: props.formData })
    }
    afterFieldValueChange(item, value)
}

const handleTimeChange = (item, value) => {
    setFieldValue(item.field, value)
    if (isFunction(item.onChange)) {
        item.onChange(value, props.formData)
    }
    if (isFunction(item.afterChange)) {
        item.afterChange(value, props.formData)
    }
    afterFieldValueChange(item, value)
}

const handleTimeRangeChange = (item, index, value) => {
    const range = [...getTimeRangeValue(item.field)]
    range[index] = value
    setFieldValue(item.field, range)
    if (isFunction(item.onChange)) {
        item.onChange(range, props.formData)
    }
    if (isFunction(item.afterChange)) {
        item.afterChange(range, props.formData)
    }
    afterFieldValueChange(item, range)
}

const handleCascaderChange = (item, value) => {
    setFieldValue(item.field, value)
    if (isFunction(item.onChange)) {
        item.onChange({ value })
    }
    if (isFunction(item.afterChange)) {
        item.afterChange({ value })
    }
    afterFieldValueChange(item, value)
}

const handleSliderChange = (item, value) => {
    setFieldValue(item.field, value)
    if (isFunction(item.onChange)) {
        item.onChange(value, props.formData)
    }
    afterFieldValueChange(item, value)
}

const handleInputSelectValueUpdate = (item, value) => {
    setFieldValue(item.field, value)
    afterFieldValueChange(item, value)
}

const handleInputSelectIdsUpdate = (item, value) => {
    if (item.idsField) {
        setFieldValue(item.idsField, value)
    }
}

const handleEditorChange = (item, value) => {
    setFieldValue(item.field, value)
    if (isFunction(item.onChange)) {
        item.onChange({ value })
    }
    afterFieldValueChange(item, value)
}

const handleCustomModelUpdate = (item, value) => {
    setFieldValue(item.field, value)
}

const handleCustomComponentChange = (item) => {
    afterFieldValueChange(item, props.formData[item.field])
}

const handleFieldButtonClick = async (item) => {
    const handler = item.function || item.onClick || item.click
    if (isFunction(handler)) {
        await handler({
            form: exposedFormApi,
            row: props.formData,
            rowData: props.formData,
            item
        })
    }
}

const handleInputButtonClick = async (item) => {
    if (!item?.field || !isFunction(item.btnFunction)) {
        return
    }

    inputButtonLoadingMap[item.field] = true
    try {
        await item.btnFunction(getItemContext(item))
    } finally {
        inputButtonLoadingMap[item.field] = false
    }
}

const getFormTableProps = (item) => ({
    loading: isFunction(item.loading) ? Boolean(item.loading(props.formData)) : Boolean(item.loading),
    tableData: Array.isArray(props.formData[item.field]) ? props.formData[item.field] : [],
    tableItems: item.tableItems || [],
    tableStyle: item.tableStyle || {},
    tableButtonList: item.tableButtonList || [],
    tablePage: item.tablePage || {},
    tableSelectAbled: Boolean(item.tableSelectAbled),
    lineSelectAbled: item.lineSelectAbled || null,
    showButtonColumn: isDefined(item.showButtonColumn) ? item.showButtonColumn : true,
    showSerialNumber: Boolean(item.showSerialNumber),
    showPagination: isDefined(item.showPagination) ? item.showPagination : true,
    frontendPagination: Boolean(item.frontendPagination),
    emptyText: item.emptyText || '暂无数据',
    itemEmptyText: item.itemEmptyText || '-',
    tableDraggable: Boolean(item.tableDraggable),
    rowKey: item.rowKey || '',
    doSpanMerge: item.doSpanMerge || null,
    doHeaderCellMerge: item.doHeaderCellMerge || null,
    children: item.children || '',
    hasChildren: item.hasChildren || '',
    onDraggableEnd: item.onDraggableEnd || null,
    load: item.load || null,
    lazy: Boolean(item.lazy),
    expandChange: item.expandChange || (() => {}),
    multiTableItems: item.multiTableItems || [],
    useMaxHeight: isDefined(item.useMaxHeight) ? item.useMaxHeight : true,
    onRowClick: item.onRowClick || (() => {}),
    stripe: isDefined(item.stripe) ? item.stripe : true,
    reserveSelection: Boolean(item.reserveSelection),
    functionBarFixed: Boolean(item.functionBarFixed),
    hasStandardMergeField: Boolean(item.hasStandardMergeField)
})

// 发起表单校验
const validateForm = async () => {
    let isValidate = true
    const itemComponentList = getItemComponentList()

    for (const component of itemComponentList) {
        if (component.type === 'button') {
            continue
        }

        if (component.data?.type === 'form-table' && isFunction(component.validateTable)) {
            const isSuccess = await component.validateTable()
            if (isSuccess === false) {
                isValidate = false
            }
            continue
        }

        const { isSuccess } = await component.doValidate()
        if (isSuccess === false) {
            isValidate = false
        }
    }

    if (props.formValidate.length) {
        for (const line of props.formValidate) {
            const result = await line.function({
                row: props.formData,
                rowData: props.formData
            })
            const errorList = Array.isArray(result) ? result : []
            if (errorList.length > 0) {
                errorList.forEach((errorItem) => {
                    getItemComponent(errorItem.field)?.setValidateObjError(errorItem.errorMsg || `${errorItem.field}校验失败`)
                })
                isValidate = false
            }
        }
    }

    return isValidate
}

// 重置表单字段为默认值
const resetForm = () => {
    normalizedFormItems.value.forEach((item) => {
        if (!item.field) {
            return
        }

        const nextValue = isDefined(initialFormData.value?.[item.field])
            ? jsonClone(initialFormData.value[item.field])
            : getItemDefaultData(item)
        props.formData[item.field] = nextValue
    })

    resetValidate()
}

// 清除表单字段校验状态
const resetValidate = () => {
    clearAllFieldErrors()
    getItemComponentList().forEach((component) => {
        component.clearValidateData?.()
    })
}

const clearValidate = (field) => {
    clearFieldError(field)
    getItemComponent(field)?.clearValidateData?.()
}

// 保存当前查询条件
const saveSearchData = (json) => {
    searchData.value = jsonClone(json) || {}
}

// 获取当前查询条件
const getSearchData = () => jsonClone(searchData.value) || {}

// 重绘表单组件
const refreshItem = (field) => {
    refreshItemTag.value = field
    nextTick(() => {
        refreshItemTag.value = false
    })
}

// 刷新表单对象【重置表单默认值】
const refreshForm = () => {
    refreshTag.value = true
    nextTick(() => {
        refreshTag.value = false
    })
}

// 调用工具栏方法
const runToolbarFunction = () => {
    const component = getItemComponent('content')
    component?.fullfillData?.()
}

// 清除工具栏选中index
const clearToolbarSelectIndex = () => {
    const component = getItemComponent('content')
    component?.clearSelectIndex?.()
}

const handleButtonClick = async (button) => {
    if (button.buttonType === 'resetForm') {
        resetForm()
        return
    }

    const handler = button.function || button.onClick || button.click
    if (isFunction(handler)) {
        await handler({
            form: exposedFormApi,
            row: props.formData,
            rowData: props.formData,
            button
        })
    }
}

Object.assign(exposedFormApi, {
    getForm,
    getItem,
    getItemValue,
    getItemComponent,
    getItemComponentList,
    validateForm,
    resetForm,
    resetValidate,
    clearValidate,
    saveSearchData,
    getSearchData,
    refreshItem,
    refreshForm,
    runToolbarFunction,
    clearToolbarSelectIndex
})

defineExpose(exposedFormApi)
</script>

<style lang="scss" scoped>
.default-form {
    .item-msg {
        margin-top: 8px;
        white-space: pre-line;
        color: #8c8c8c;
        font-size: 12px;
        line-height: 1.5;
    }

    .btn-wrap {
        position: relative;
        min-height: 45px;
        line-height: 50px;
        text-align: v-bind('styleState.btnWrapAlign');

        .ant-btn {
            display: inline-block;
            margin-left: 8px;
        }

        .btn-center-line {
            position: absolute;
            width: 100%;
            height: 100%;
            text-align: center;

            .ant-btn {
                margin: 0 5px;
            }
        }
    }

    &__item {
        :deep(.ant-form-item-row) {
            width: 100%;
        }

        :deep(.ant-form-item-label) {
            width: var(--item-label-width, var(--default-form-label-width));
            flex: 0 0 var(--item-label-width, var(--default-form-label-width));
            overflow: hidden;
        }

        :deep(.ant-form-item-control) {
            min-width: 0;
            flex: 1;
        }
    }

    &__text,
    &__unsupported,
    &__empty-text {
        color: #595959;
        line-height: 32px;
    }

    &__unsupported {
        color: #fa8c16;
    }

    &__images {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;

        img {
            display: block;
            object-fit: cover;
            border-radius: 6px;
            border: 1px solid #f0f0f0;
        }
    }

    &__input-with-button {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    &__time-range {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    &__time-range-separator {
        color: #8c8c8c;
    }

    &__block {
        min-height: 1px;
    }

    :deep(.ant-form-vertical .ant-form-item-label) {
        width: 100%;
        flex: none;
    }

    .label-wrap {
        display: inline-flex;
        align-items: center;
        gap: 4px;

        &.is-required::before {
            content: '*';
            color: #ff4d4f;
            line-height: 1;
        }
    }
}
</style>
