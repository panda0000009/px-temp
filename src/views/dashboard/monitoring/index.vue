<template>
    <div class="page">
        <div class="page__top">
            <div class="page_bar">
                <search-bar-label label="时间" width="360px">
                    <a-range-picker
                        v-model:value="timeValue"
                        :placeholder="['请选择开始时间', '请选择结束时间']"
                        format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        :show-time="{
                            format: 'HH:mm:ss',
                            defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')]
                        }"
                        style="width: 100%"
                        allowClear
                    />
                </search-bar-label>
                <search-bar-label width="280" label="运营商ID">
                    <a-select
                        v-model:value="queryParams.agentId"
                        mode="multiple"
                        allowClear
                        :maxTagCount="1"
                        placeholder="请选择运营商ID"
                        style="width: 100%"
                        @dropdownVisibleChange="onDropdownVisible('agent', $event)"
                    >
                        <a-select-option v-for="item in agentList" :key="item.id" :value="item.id">
                            {{ item.agentName }}
                        </a-select-option>
                    </a-select>
                </search-bar-label>
                <search-bar-label label="供应商ID" width="280">
                    <a-select
                        v-model:value="queryParams.providerIds"
                        mode="multiple"
                        placeholder="请选择供应商ID"
                        allowClear
                        style="width: 100%"
                        :maxTagCount="1"
                        @dropdownVisibleChange="onDropdownVisible('provider', $event)"
                    >
                        <a-select-option v-for="item in providerList" :key="item.id" :value="item.id">
                            {{ item.providerName }}
                        </a-select-option>
                    </a-select>
                </search-bar-label>
                <search-bar-label label="游戏ID" width="200">
                    <a-select
                        v-model:value="queryParams.gameId"
                        allowClear
                        placeholder="请选择游戏ID"
                        :filter-option="false"
                        style="width: 100%"
                    >
                        <a-select-option v-for="item in gameOptions" :key="item.id" :value="item.id">
                            {{ item.gameName }}
                        </a-select-option>
                    </a-select>
                </search-bar-label>
                <search-bar-label label="新增玩家" width="100">
                    <a-select v-model:value="queryParams.isNew" allowClear placeholder="请选择" style="width: 100px">
                        <a-select-option :value="1">是</a-select-option>
                        <a-select-option :value="0">否</a-select-option>
                    </a-select>
                </search-bar-label>
            </div>
            <div class="operate">
                <a-button
                    type="primary"
                    danger
                    ghost
                    @click="handleOpenSetting"
                    style="border-color: #722ed1; color: #722ed1; margin-right: 10px"
                >
                    <SettingOutlined />设置RTP
                </a-button>
                <a-button type="primary" @click="handleSearch" style="margin-right: 10px"
                    ><SearchOutlined />搜索</a-button
                >
                <a-button type="default" @click="handleReset"><RedoOutlined />重置</a-button>
            </div>
        </div>
        <div class="page__header" v-if="mapData.length">
            <a-button :type="activeTable === 'add' ? 'primary' : 'default'" @click="switchTable('add')"
                >新增数据</a-button
            >
            <a-button
                style="margin-left: 10px"
                :type="activeTable === 'invigorate' ? 'primary' : 'default'"
                @click="switchTable('invigorate')"
                >活跃数据</a-button
            >
        </div>
        <div class="page__chart-container">
            <a-spin :spinning="chartLoading" tip="正在获取图表数据...">
                <div ref="rtpChartRef" class="rtp-chart" v-if="mapData.length" />
                <div v-else class="empty-wrapper">
                    <a-empty :description="emptyText" />
                </div>
            </a-spin>
        </div>
        <!-- 第二个表格数据 -->
        <div class="bet-statistics">
            <a-tabs v-model:activeKey="activeGame" @change="handleTabChange">
                <a-tab-pane v-for="item in betInfoData" :key="item.gameName" :tab="item.gameName" />
            </a-tabs>
            <vxe-table
                height="500"
                :loading="loading"
                :data="currentTableData"
                border
                header-align="center"
                align="center"
            >
                <vxe-column title="下注金额区间" min-width="180">
                    <template #default="{ row }"> {{ row.betMin }} - {{ row.betMax }} </template>
                </vxe-column>
                <vxe-colgroup title="新增玩家">
                    <vxe-column field="newBetTimes" title="下注次数" width="100"></vxe-column>
                    <vxe-column field="newBetTimesPercent" title="次数比例(%)" width="120">
                        <template #default="{ row }">
                            {{ formatPercent(row.newBetTimesPercent) }}
                        </template>
                    </vxe-column>
                    <vxe-column field="newBetCount" title="下注人数" width="100"></vxe-column>
                    <vxe-column field="newBetCountPercent" title="人数比例(%)" width="120">
                        <template #default="{ row }">
                            {{ formatPercent(row.newBetCountPercent) }}
                        </template>
                    </vxe-column>
                </vxe-colgroup>
                <vxe-colgroup title="全量玩家统计">
                    <vxe-column field="betTimes" title="总下注次数" width="100"></vxe-column>
                    <vxe-column field="betTimesPercent" title="次数比例(%)" width="120">
                        <template #default="{ row }"> {{ row.betTimesPercent }}% </template>
                    </vxe-column>
                    <vxe-column field="betCount" title="总下注人数" width="100"></vxe-column>
                    <vxe-column field="betCountPercent" title="人数比例(%)" width="120">
                        <template #default="{ row }"> {{ row.betCountPercent }}% </template>
                    </vxe-column>
                </vxe-colgroup>
            </vxe-table>
        </div>
        <AddModal v-model:value="modalValue" :game-list="gameOptions" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive, computed, nextTick } from 'vue'
import { listAuthProvider, agentListAuth, gamelistAuth } from '@/api/merchant.js'
import { statisticsData, betInfoApi } from '@/api/homeApi.js'
import { SearchOutlined, RedoOutlined, SettingOutlined } from '@ant-design/icons-vue'
import AddModal from './components/AddModal.vue'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { message } from 'ant-design-vue'
// 初始参数
const initialParams = {
    agentId: [],
    providerIds: [],
    gameId: undefined,
    isNew: undefined
}
const chartLoading = ref(false)
const modalValue = ref(false)
const queryParams = reactive({ ...initialParams })
// 供应商数据
const providerList = ref([])
// 获取运营商
const agentList = ref([])
// 游戏列表
const gameOptions = ref([])
// 日期时间选择
const timeValue = ref([])
const startTime = computed(() => timeValue.value?.[0] || '')
const endTime = computed(() => timeValue.value?.[1] || '')
const activeTable = ref('invigorate')
const rtpChartRef = ref(null)
const mapData = ref([])
const betInfoData = ref([]) // 接口返回的 items
const activeGame = ref('Plinko') // 默认选中 Plinko
const loading = ref(false)
let myChart = null
// 1. 初始化图表
const initChart = () => {
    if (rtpChartRef.value) {
        myChart = echarts.init(rtpChartRef.value)
        updateChart()
    }
}
// 2. 更新图表配置
const updateChart = () => {
    // 确保有图表实例且数据已加载
    if (!myChart || !mapData.value.length || !gameOptions.value.length) return
    // 第一步：建立游戏配置映射表 (提高查找效率)
    const gameMap = {}
    gameOptions.value.forEach((item) => {
        gameMap[item.id.toString()] = {
            name: item.gameName,
            baseRtp: parseFloat(item.baseRTP || 0)
        }
    })
    // 第二步：提取横坐标 (日期并去重排序)
    // 接口返回的顺序可能是倒序，我们要升序排列以便折线图从左往右画
    const dates = [...new Set(mapData.value.map((item) => item.statistics_date))].sort().slice(-7)
    // 第三步：提取涉及到的游戏 ID
    // 从统计数据的 gameIds 字段中获取（你的数据中 gameIds 是字符串 "1"）
    const involvedGameIds = [...new Set(mapData.value.map((item) => item.gameIds))]
    // 第四步：构造 series 数组
    const series = involvedGameIds
        .map((gId) => {
            const config = gameMap[gId]
            if (!config) return null // 过滤掉没有配置的游戏
            const lineData = dates.map((date) => {
                // 找到当天该游戏的数据
                const record = mapData.value.find((r) => r.gameIds === gId && r.statistics_date === date)
                if (record) {
                    // 根据 Tab 状态取不同的 RTP 字段
                    const rawRtpStr = activeTable.value === 'add' ? record.newPlayerRTP : record.RTP
                    // 处理空值或空字符串
                    if (!rawRtpStr || rawRtpStr.trim() === '') return null
                    // 清洗百分号转数字
                    const currentRtp = parseFloat(rawRtpStr.replace('%', '').trim())
                    // 计算波动：当前 - 预设
                    return parseFloat((currentRtp - config.baseRtp).toFixed(2))
                }
                return []
            })
            return {
                name: config.name,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                connectNulls: true, // 关键：自动连接缺失的数据点
                data: lineData,
                symbolSize: 8,
                emphasis: { focus: 'series' }
            }
        })
        .filter((s) => s !== null) // 剔除无效数据

    // 第五步：设置配置项
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                let res = `${params[0].name}<br/>`
                params.forEach((p) => {
                    // 只有有值时才显示
                    if (p.data !== null && p.data !== undefined) {
                        const val = p.data >= 0 ? `+${p.data}%` : `${p.data}%`
                        res += `${p.marker} ${p.seriesName}: <b>${val}</b><br/>`
                    }
                })
                return res
            }
        },
        legend: {
            type: 'scroll',
            bottom: 0
        },
        grid: {
            left: '4%',
            right: '4%',
            bottom: '15%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates
        },
        yAxis: {
            type: 'value',
            axisLabel: { formatter: '{value}%' },
            splitLine: { lineStyle: { type: 'dashed' } }
        },
        series: series
    }

    myChart.setOption(option, true)
}
// 切换图表tab
const switchTable = (type) => {
    activeTable.value = type
    updateChart()
}
// 根据当前选中的 Tab 过滤出表格数据
const currentTableData = computed(() => {
    const game = betInfoData.value.find((item) => item.gameName === activeGame.value)
    return game ? game.list : []
})
// 2. 动态文案（可选）
const emptyText = computed(() => {
    return '暂无数据'
})
// 下拉框调用接口
const onDropdownVisible = (type, visible) => {
    if (!visible) return
    switch (type) {
        // case 'game':
        //     return
        case 'agent':
            getAgentList()
        case 'provider':
            getProviderList()
            return
    }
}
// 设置rtp
const handleOpenSetting = () => {
    modalValue.value = true
}
// 获取数据统计
const getStatisticsData = async () => {
    try {
        const params = {
            startTime: startTime.value,
            endTime: endTime.value,
            page: 1,
            pageSize: 50,
            tenantType: 1,
            reportType: 1,
            ...queryParams,
            gameId: [queryParams.gameId]
        }
        const resp = await statisticsData(params)
        mapData.value = resp.items || []
        // 数据更新后，重新渲染图表
        nextTick(() => {
            updateChart()
        })
    } catch (error) {
        console.log(error)
    }
}
// 获取下注统计
const getBetInfo = async () => {
    loading.value = true
    try {
        const params = {
            ...queryParams,
            gameId: [queryParams.gameId],
            startTime: startTime.value,
            endTime: endTime.value,
            isNew: queryParams.isNew === 1 ? true : false
        }
        const resp = await betInfoApi(params)
        betInfoData.value = resp.items || []
        // 容错处理：如果数据里没有默认的 Plinko，就选中第一个
        if (betInfoData.value.length > 0) {
            const hasPlinko = betInfoData.value.some((i) => i.gameName === 'Plinko')
            if (!hasPlinko) {
                activeGame.value = betInfoData.value[0].gameName
            }
        }
    } catch (error) {
        console.error('获取下注统计失败', error)
    } finally {
        loading.value = false
    }
}
// 格式化百分比显示（处理后端可能返回的 NaN 字符串）
const formatPercent = (val) => {
    if (val === 'NaN' || val === null || val === undefined) return '0.00%'
    return `${val}%`
}
// Tab 切换事件
const handleTabChange = (key) => {
    activeGame.value = key
}
// 获取运营商列表
const getAgentList = async () => {
    try {
        const res = await agentListAuth()
        agentList.value = (res.items || []).map((item) => ({
            id: item.id,
            agentName: item.agentName
        }))
    } catch (err) {
        console.error('获取运营商列表失败:', err)
    }
}
// 获取供应商id数据
const getProviderList = async () => {
    try {
        const res = await listAuthProvider()
        providerList.value = (res.items || []).map((item) => ({
            id: item.id,
            providerName: item.providerName
        }))
    } catch (err) {
        console.error('获取供应商列表失败:', err)
    }
}
// 获取游戏选项
const getGameOptions = async () => {
    try {
        const res = await gamelistAuth()
        gameOptions.value = res.items
    } catch (error) {
        console.log(error)
    }
}
// 搜索
const handleSearch = async () => {
    if (!startTime.value || !endTime.value) {
        message.error('请选择开始时间和结束时间!')
        return
    }
    if (!queryParams.gameId) {
        message.error('请选择游戏ID!')
        return
    }
    chartLoading.value = true
    try {
        await getStatisticsData()
        initChart()
        getBetInfo()
    } catch (error) {
        console.log(error)
    } finally {
        chartLoading.value = false
    }
}
// 重置
const handleReset = async () => {
    chartLoading.value = true
    try {
        // 清空筛选参数
        Object.assign(queryParams, initialParams)
        timeValue.value = []
        // 清空数据源
        mapData.value = []
        betInfoData.value = []
        if (myChart) {
            myChart.clear() // 清空内容
        }
        await new Promise((resolve) => setTimeout(resolve, 200))
    } catch (error) {
        console.error('重置失败:', error)
    } finally {
        chartLoading.value = false
    }
}
onMounted(() => {
    getGameOptions()
})

onUnmounted(() => {
    myChart?.dispose()
})
</script>

<style lang="scss" scoped>
.page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #fff;
    overflow: auto;
    .page__top {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .page_bar {
            display: flex;
            align-items: center;
        }
    }
    .page__header {
        margin-top: 10px;
        display: flex;
        // justify-content: flex-end;
        padding: 15px;
        border-bottom: 1px solid #f0f0f0;
    }

    .page__chart-container {
        height: 300px;
        // padding: 10px 15px;
        flex-shrink: 0;
        box-sizing: border-box;
        .chart-title {
            font-size: 14px;
            font-weight: bold;
            color: #666;
            margin-bottom: 10px;
        }

        .rtp-chart {
            height: 250px;
            width: 100%;
        }
        .empty-wrapper {
            width: 100%;
            margin-top: 20px;
            height: 250px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px dashed #e8e8e8; /* 可选：增加一个虚线框感 */
        }
        /* 确保 loading 状态下高度一致 */
        :deep(.ant-spin-nested-loading),
        :deep(.ant-spin-container) {
            height: 250px;
        }
    }

    .page__content {
        flex: 1; // 剩下的给表格
        overflow: hidden;
        padding: 10px 15px;
    }
}
</style>
