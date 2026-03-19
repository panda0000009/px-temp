<template>
    <vxe-modal :modelValue="props.value" title="选择图标" width="50%" @close="handleCancel">
        <template #default>
            <div class="icon-warp">
                <div
                    v-for="icon in iconList"
                    :key="icon"
                    :value="icon"
                    :class="['icon-item', IconName === icon ? 'active' : '']"
                    @click="handleIconSelect(icon)"
                >
                    <component
                        v-if="icon != 'createFromIconfontCN' && icon != 'getTwoToneColor'"
                        :is="getIconComponent(icon)"
                    />
                </div>
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
import { ref } from 'vue'
import * as Icons from '@ant-design/icons-vue'
const emit = defineEmits(['update:value', 'IconSelect'])

const props = defineProps({
    value: Boolean
})
const iconList = Object.keys(Icons)

const loading = ref(false)

const IconName = ref('')

const handleConfirm = () => {
    emit('IconSelect', IconName.value)
    handleCancel()
}

const handleIconSelect = (iconName) => {
    IconName.value = iconName
}
const handleCancel = () => {
    emit('update:value', false)
}
const getIconComponent = (iconName) => {
    return Icons[iconName]
}
</script>
<style lang="scss" scoped>
.icon-warp {
    display: flex;
    flex-wrap: wrap;
    height: 300px;
    overflow: scroll;

    .icon-item {
        width: 40px;
        height: 40px;
        font-size: 28px;
        text-align: center;
        cursor: pointer;
        border: 1px solid #f2f2f2;
    }

    .icon-item:hover {
        color: #fff;
        background-color: #1677ff;
        border-radius: 10px;
    }

    .active {
        color: #1677ff;
    }
}
</style>
