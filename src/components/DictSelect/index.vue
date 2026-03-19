<template>
    <a-select
        v-if="props.mode != 'multiple'"
        style="width: 100%"
        :value="props.value"
        :placeholder="props.placeholder"
        :allowClear="props.allowClear"
        :disabled="disabled"
        @change="handleChange"
    >
        <a-select-option v-for="item in dictList" :key="item.id" :value="item[valueField]">
            {{ item[labelField] }}
        </a-select-option>
    </a-select>
    <a-select
        v-else
        style="width: 100%"
        :value="props.value"
        mode="multiple"
        :placeholder="props.placeholder"
        :allowClear="props.allowClear"
        :max-tag-count="props.maxTagCount"
        :options="props.dictList"
    ></a-select>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
// import { getDictDataByCode } from '@/api/systemApi'

const props = defineProps({
    value: {
        type: [String, Number, undefined],
        default: undefined
    },
    dictCode: {
        type: String,
        default: ''
    },
    mode: {
        type: String,
        default: 'combobox'
    },
    maxTagCount: {
        type: String,
        default: 'responsive'
    },
    placeholder: {
        type: String,
        default: '请选择'
    },
    allowClear: {
        type: Boolean,
        default: true
    },
    labelField: {
        type: String,
        default: 'label'
    },
    valueField: {
        type: String,
        default: 'value'
    },
    options: {
        type: Array,
        default: () => []
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

watch(
    () => props.options,
    (newValue) => {
        if (!props.dictCode && newValue) {
            dictList.value = newValue
        }
    },
    {
        deep: true
    }
)

const dictList = ref([])
const getDictList = async () => {
    if (props.options.length > 0) {
        dictList.value = props.options
    } else {
        if (!props.dictCode) return
        const fetchApi = null
        const res = await fetchApi({ dictCode: props.dictCode })
        dictList.value = res.map((item) => {
            return {
                value: item[props.valueField],
                label: item[props.labelField]
            }
        })
    }
}

const emit = defineEmits(['update:value', 'onChange'])
const handleChange = (value) => {
    const dict = dictList.value.filter((item) => item.value === value)[0]
    emit('update:value', value)
    emit('onChange', value, dict)
}

onMounted(async () => {
    await getDictList()
})
</script>
