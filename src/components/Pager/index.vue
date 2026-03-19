<template>
    <vxe-pager
        :current-page="props.current"
        :layouts="props.layouts"
        :page-size="props.pageSize"
        :page-sizes="props.pageSizes"
        :total="props.total"
        @page-change="handlePageChange"
    >
        <template #left>
            <slot name="left"></slot>
        </template>
        <template #right>
            <slot name="right"></slot>
        </template>
    </vxe-pager>
</template>

<script setup>
const props = defineProps({
    current: {
        type: Number,
        default: 1,
        required: true
    },
    layouts: {
        type: Array,
        default: () => ['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']
    },
    pageSize: {
        type: Number,
        default: undefined,
        required: true
    },
    pageSizes: {
        type: Array,
        default: () => [10, 15, 20, 30, 50, 100]
    },
    total: {
        type: Number,
        default: 0,
        required: true
    }
})

const emit = defineEmits(['update:current', 'update:pageSize', 'onChange'])
const handlePageChange = ({ currentPage, pageSize }) => {
    emit('update:current', currentPage)
    emit('update:pageSize', pageSize)
    emit('onChange', { currentPage, pageSize })
}
</script>
