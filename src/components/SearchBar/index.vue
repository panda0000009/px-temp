<template>
    <div class="search-bar" :class="{ 'search-bar--bordered': bordered }">
        <div class="search-bar__main">
            <div v-if="action" class="search-bar__main--left">
                <a-space>
                    <slot name="left">
                        <a-button v-if="showAddButton" type="primary" @click="handleAdd">
                            <plus-outlined />
                            {{ $t('common.add') }}
                        </a-button>
                    </slot>
                </a-space>
            </div>
            <div class="search-bar__main--right" :class="{ alignLeft: !action }">
                <a-space class="search-bar__space" wrap>
                    <slot name="right"></slot>
                    <slot name="search" v-if="search">
                        <a-button @click="handleSearch" type="primary">
                            <search-outlined />
                            {{ $t('common.search') }}
                        </a-button>
                        <a-button @click="handleReset">
                            <reload-outlined />
                            {{ $t('common.reset') }}
                        </a-button>
                    </slot>
                    <a-button v-if="advanced" @click="handleAdvanced">
                        {{ $t('common.advancedFilter') }}
                        <down-outlined v-if="!showAdvanced" />
                        <up-outlined v-else />
                    </a-button>
                </a-space>
            </div>
        </div>
        <div
            v-if="advanced"
            class="search-bar__advanced"
            :class="{ 'search-bar__advanced--visible': showAdvanced, alignLeft: !action }"
        >
            <a-space class="search-bar__space" wrap>
                <slot name="advanced"></slot>
            </a-space>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { SearchOutlined, ReloadOutlined, PlusOutlined, UpOutlined, DownOutlined } from '@ant-design/icons-vue'
import { checkButtonPermission } from '@/utils/permission'

const { t } = useI18n()
const route = useRoute()

defineOptions({
    name: 'SearchBar'
})

const props = defineProps({
    // 显示左侧按钮
    action: {
        type: Boolean,
        default: true
    },
    // 显示搜索/重置
    search: {
        type: Boolean,
        default: true
    },
    // 显示高级筛选
    advanced: {
        type: Boolean,
        default: false
    },
    // 显示边框
    bordered: Boolean,
    // 新增按钮的权限标识，如果传入此参数，会根据权限判断是否显示新增按钮
    addButtonPermission: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['onAdd', 'onSearch', 'onReset'])

// 根据权限判断是否显示新增按钮
const showAddButton = computed(() => {
    // 如果传入了权限标识，则根据权限判断
    if (props.addButtonPermission) {
        return checkButtonPermission(route.path, props.addButtonPermission)
    }
    // 如果没有传入权限标识，默认显示（保持原有行为）
    return true
})

const handleAdd = () => {
    emit('onAdd')
}

const handleSearch = () => {
    emit('onSearch')
}

const handleReset = () => {
    emit('onReset')
}

const showAdvanced = ref(false)
const handleAdvanced = () => {
    showAdvanced.value = !showAdvanced.value
}
</script>

<style lang="scss" scoped>
.search-bar {
    width: 100%;
    background-color: #fff;
    overflow: hidden;

    &--bordered {
        padding: 10px;
        box-sizing: border-box;
        border: 1px solid #e8eaec;
        background: #f8f8f9;
    }

    &__main {
        display: flex;

        &--right {
            flex: 1;
            text-align: right;

            &.alignLeft {
                text-align: left;
            }
        }
    }

    &__advanced {
        display: none;
        margin-top: 10px;
        text-align: right;

        &--visible {
            display: block;
        }

        &.alignLeft {
            text-align: left;
        }
    }

    &__space {
        margin-bottom: 0 !important;
        justify-content: flex-end;
    }
}
</style>
