<!-- src/components/StatCard.vue -->
<template>
    <a-col flex="1">
        <a-card class="stat-card">
            <div v-if="item.showCornerIcon" class="card-corner-icon">
                <InfoCircleOutlined />
                <!-- {{ item.currency }} -->
                <span class="currency">{{ currency ?? 'COIN' }}</span>
            </div>
            <div class="card-content">
                <div class="card-title">{{ item.title }}</div>
                <div class="card-value">{{ formatValue(item.value) }}</div>
                <div class="card-compare" :class="compareType">
                    <span class="compare-icon">
                        <CaretUpOutlined v-if="compareType === 'positive'" />
                        <CaretDownOutlined v-else />
                    </span>
                    {{ compareText }}
                </div>
            </div>
        </a-card>
    </a-col>
</template>

<script setup>
import { CaretUpOutlined, CaretDownOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'
import { computed } from 'vue'

const props = defineProps({
    currency: {
        type: String
    },
    item: {
        type: Object,
        default: {}
    },
    // 卡片标题
    title: {
        type: String
    },
    // 卡片数值
    value: {
        type: [String, Number]
    },
    // 环比数值（正数表示增长，负数表示下降）
    compareValue: {
        type: Number,
        required: true
    },
    // 是否显示右上角图标
    showCornerIcon: {
        type: Boolean,
        default: false
    },
    // 是否格式化数值（添加千分位分隔符）
    formatNumber: {
        type: Boolean,
        default: true
    },
    // 数值后缀（如 %）
    suffix: {
        type: String,
        default: ''
    },
    //
    contextValue: {
        type: String,
        default: ''
    }
})

// 定义事件
const emit = defineEmits(['icon-click'])

// 计算属性：环比类型（positive/negative）
const compareType = computed(() => {
    return props.compareValue >= 0 ? 'positive' : 'negative'
})

// 计算属性：环比文本
const compareText = computed(() => {
    const sign = props.compareValue >= 0 ? '+' : ''
    return `环比昨日 ${sign}${props.compareValue}%`
})

// 格式化数值
const formatValue = (val) => {
    if (!props.formatNumber || typeof val !== 'number') {
        return `${val}${props.suffix}`
    }

    // 添加千分位分隔符
    return `${val.toLocaleString()}${props.suffix}`
}
</script>

<style lang="scss" scoped>
.stat-card {
    position: relative;
    height: 140px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }

    // 右上角图标
    .card-corner-icon {
        position: absolute;
        top: 12px;
        right: 12px;
        color: #8c8c8c;
        font-size: 16px;
        z-index: 1;
        transition: color 0.3s;
        cursor: pointer;
        .currency {
            margin-left: 5px;
        }
        &:hover {
            color: #1890ff;
        }
    }

    .card-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;

        .card-title {
            font-size: 16px;
            color: #8c8c8c;
            margin-bottom: 12px;
        }

        .card-value {
            font-size: 28px;
            font-weight: 600;
            color: #1f1f1f;
            margin-bottom: 12px;
            line-height: 1.2;
        }

        .card-compare {
            display: flex;
            align-items: center;
            font-size: 12px;

            .compare-icon {
                margin-right: 4px;
                font-size: 10px;
            }

            &.positive {
                color: #52c41a;
            }

            &.negative {
                color: #ff4d4f;
            }
        }
    }
}

// 响应式调整
@media (max-width: 1200px) {
    .card-col {
        flex: 0 0 33.333333%;
        max-width: 33.333333%;
    }
}
</style>
