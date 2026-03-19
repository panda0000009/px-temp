<template>
    <label class="search-bar__label" :style="{ width: itemWidth }">
        <span v-if="label" class="search-bar__label--text">{{ label }}：</span>
        <div class="search-bar__comp">
            <slot></slot>
        </div>
    </label>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
    name: 'SearchBarLabel'
})

const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    width: {
        type: [String, Number],
        default: 260
    }
})

const itemWidth = computed(() => {
    if (typeof props.width === 'number') {
        return `${props.width}px`
    }
    if (typeof props.width === 'string' && !props.width.endsWith('px')) {
        return `${props.width}px`
    }
    return props.width
})
</script>

<style lang="scss" scoped>
.search-bar__label {
    display: flex;
    align-items: center;

    &--text {
        margin-left: 20px;
        word-break: keep-all;
        white-space: nowrap;
    }
}

.search-bar__comp {
    flex-grow: 1;
    text-align: left;
}
</style>
