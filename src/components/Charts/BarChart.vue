<template>
    <div :id="chartId" :style="{ height: getHeight }"></div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, computed } from 'vue'

const props = defineProps({
    height: {
        type: [String, Number],
        default: '300px'
    },
    title: Object,
    tooltip: Object,
    grid: Object,
    xAxis: Object,
    yAxis: Object,
    series: {
        type: Array,
        default: () => [
            {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar'
            }
        ]
    }
})

const getHeight = computed(() => {
    if (props.height === undefined || props.height < 0) {
        console.error('Invalid height value:', props.height)
        return '300px' // 默认高度
    }

    if (typeof props.height === 'string') {
        return props.height.endsWith('px') || props.height.endsWith('%') ? props.height : `${props.height}px`
    }

    return props.height.toString() + 'px'
})

const { proxy } = getCurrentInstance()
const chartId = ref('chart-' + +new Date() + ((Math.random() * 1000).toFixed(0) + ''))
const options = ref({
    title: { text: 'Bar Chart', show: false, ...props.title },
    tooltip: { trigger: 'axis', ...props.tooltip },
    grid: {
        left: '10px',
        right: '10px',
        top: '5%',
        bottom: '8%',
        containLabel: true,
        ...props.grid
    },
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        ...props.xAxis
    },
    yAxis: { type: 'value', ...props.yAxis },
    series: props.series,
    color: '#1890ff'
})

onMounted(() => {
    const chart = proxy.$echarts.init(document.getElementById(chartId.value))
    chart.setOption(options.value)
    window.addEventListener('resize', () => {
        chart.resize()
    })
})
</script>
