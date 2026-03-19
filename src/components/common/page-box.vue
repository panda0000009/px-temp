/*
*  @ 通用 page-box 组件 通用内容容器
*  @
*/
<template>
    <div class="page-box" :class="{ folded: isFolded }">
        <slot></slot>
    </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
    name: 'page-box'
})

const isFolded = ref(false)

const switchFold = () => {
    isFolded.value = !isFolded.value
}

const setFolded = (value) => {
    isFolded.value = Boolean(value)
}

defineExpose({
    // 是否折叠起来了 - 配合page-box-title组件控制
    isFolded,
    switchFold,
    setFolded
})
</script>

<style lang="scss" scoped>
.page-box {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    margin-bottom: 12px;
    background-color: #fff;
    transition: all 1s;

    &.folded {
        height: 46px;
        overflow: hidden;
    }
}
</style>
