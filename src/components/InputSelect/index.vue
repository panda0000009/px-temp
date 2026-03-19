<template>
    <a-input-search
        class="input-select"
        :class="{ 'input-select--readonly': readOnly }"
        :value="value"
        :placeholder="placeholder"
        :maxLength="maxLength"
        :readOnly="readOnly"
        :allowClear="allowClear"
        @change="handleChange"
        @click="handleSelect(!readOnly)"
    >
        <template #enterButton>
            <a-button @click.stop="handleSelect(false)">{{ btnText }}</a-button>
        </template>
    </a-input-search>
</template>

<script setup>
const props = defineProps({
    value: String,
    ids: [String, Number],
    placeholder: {
        type: String,
        default: '请选择'
    },
    btnText: {
        type: String,
        default: '选择'
    },
    maxLength: {
        type: Number,
        default: 100
    },
    readOnly: Boolean,
    allowClear: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:value', 'update:ids', 'onSelect'])

const handleChange = (e) => {
    const value = e.target.value
    if (value) {
        emit('update:value', value)
    } else {
        handleClear()
    }
}

const handleSelect = (isOuter) => {
    if (isOuter) return
    emit('onSelect')
}

const handleClear = () => {
    emit('update:value', '')
    emit('update:ids', '')
}
</script>

<style lang="scss" scoped>
.input-select {
    &--readonly {
        cursor: pointer;

        :deep(.ant-input) {
            cursor: pointer;
        }
    }

    &--clear {
        margin-right: 3px;
        font-size: 12px;
        color: #bfbfbf;
        cursor: pointer;
        transition: color 0.2s;

        &:hover {
            color: #8c8c8c;
        }
    }
}
</style>
