<template>
    <div class="workbench-container">
        <!-- 数据卡片区域 -->
        <a-row :gutter="16" class="card">
            <!-- 左侧卡片区 -->
            <a-col flex="1">
                <a-row :gutter="16">
                    <StatCard
                        v-for="card in cardData"
                        :key="card.id"
                        :item="card"
                        :compare-value="card.compareValue"
                        :show-corner-icon="card.showCornerIcon"
                        :suffix="card.suffix"
                        :currency="currencyParams"
                    />
                </a-row>
            </a-col>
            <!-- 右侧按钮 -->
            <a-col flex="none">
                <span>货币: </span>
                <a-select
                    v-model:value="currencyParams"
                    show-search
                    allowClear
                    placeholder="选择货币类型"
                    style="width: 180px"
                    optionFilterProp="label"
                    @change="onCurrencyChange"
                >
                    <a-select-option
                        v-for="item in currencyOptions"
                        :key="item.id"
                        :value="item.id"
                        :label="item.label"
                    >
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-col>
        </a-row>
        <div class="page">
            <div class="page__header">
                <search-bar bordered @onSearch="onHandleSearch" @onReset="onHandleReset" :action="false" customAdd>
                    <template #right>
                        <!-- <search-bar-label label="日期" width="180px">
                            <a-date-picker
                                v-model:value="dateValue"
                                placeholder="请选择日期"
                                format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD"
                                style="width: 100%"
                                :disabled="timeValue?.length > 0"
                                @change="onDateChange"
                                allowClear
                            />
                        </search-bar-label> -->
                        <search-bar-label label="时间" width="420px">
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
                        <search-bar-label width="300" label="供应商">
                            <a-select
                                v-model:value="queryParams.providerId"
                                mode="multiple"
                                allowClear
                                :maxTagCount="2"
                                placeholder="请选择供应商"
                                style="width: 100%"
                                @dropdownVisibleChange="onDropdownVisible('agent', $event)"
                            >
                                <a-select-option v-for="item in targetOptions" :key="item.id" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </search-bar-label>
                        <search-bar-label label="游戏">
                            <a-select
                                v-model:value="queryParams.gameId"
                                allowClear
                                mode="multiple"
                                placeholder="请选择游戏"
                                :maxTagCount="3"
                                :filter-option="false"
                                style="width: 100%"
                                @dropdownVisibleChange="onDropdownVisible('game', $event)"
                            >
                                <a-select-option v-for="item in gameOptions" :key="item.id" :value="item.id">
                                    {{ item.gameName }}
                                </a-select-option>
                            </a-select>
                        </search-bar-label>
                        <search-bar-label label="货币">
                            <a-select
                                v-model:value="queryParams.currency"
                                allowClear
                                :maxTagCount="2"
                                mode="multiple"
                                placeholder="请选择货币类型"
                                :filter-option="false"
                                style="width: 100%"
                            >
                                <a-select-option v-for="item in currencyOptions" :key="item.id" :value="item.id">
                                    {{ item.label }}
                                </a-select-option>
                            </a-select>
                        </search-bar-label>
                    </template>
                </search-bar>
            </div>
            <div class="page__container">
                <vxe-table
                    v-show="activeTable === 'add'"
                    ref="addTableRef"
                    height="auto"
                    :column-config="columnConfig"
                    :resizable-config="{ minWidth: 1 }"
                    :loading="loading"
                    :data="tableData"
                    border
                    header-align="center"
                    align="center"
                >
                    <vxe-column field="statistics_date" title="日期" min-width="200" fixed="left" />
                    <vxe-column field="providerId" title="供应商ID" min-width="150" />
                    <vxe-column field="gameIds" title="游戏ID" min-width="120" />
                    <vxe-column field="currency" title="货币" min-width="120" />
                    <vxe-column field="newPlayer" title="新增" min-width="100" />
                    <vxe-column field="newPlayerBetTime" title="新增下注次数" min-width="120" />
                    <vxe-column field="newPlayerAverageBetTimes" title="新增人均下注次数" min-width="160" />
                    <vxe-column field="newPlayerAverageBet" title="新增人均下注" min-width="120" />
                    <vxe-column field="newPlayerBet" title="新增总下注" min-width="180" />
                    <vxe-column field="newPlayerWin" title="新增总支出" min-width="180" />
                    <vxe-column field="newPlayerWinLose" title="新增总盈亏" min-width="120" />
                    <vxe-column field="newPlayerRTP" title="新增RTP" min-width="120" />
                </vxe-table>

                <vxe-table
                    v-show="activeTable === 'invigorate'"
                    ref="invigorateTableRef"
                    height="auto"
                    :loading="loading"
                    :column-config="columnConfig"
                    :resizable-config="{ minWidth: 1 }"
                    :data="tableData"
                    border
                    header-align="center"
                    align="center"
                >
                    <vxe-column field="statistics_date" title="日期" min-width="200" fixed="left" />
                    <vxe-column field="providerId" title="供应商ID" min-width="150" />
                    <vxe-column field="gameIds" title="游戏ID" min-width="120" />
                    <vxe-column field="currency" title="货币" min-width="120" />
                    <vxe-column field="playerActivation" title="日活" min-width="100" />
                    <vxe-column field="effectPlayerActivation" title="有效日活" min-width="100" />
                    <vxe-column field="totalBetTimes" title="总下注次数" min-width="120" />
                    <vxe-column field="averageBetTimes" title="人均下注次数" min-width="120" />
                    <vxe-column field="averageBet" title="人均下注" min-width="120" />
                    <vxe-column field="totalBet" title="总下注" min-width="120" />
                    <vxe-column field="totalWin" title="总支出" min-width="120" />
                    <vxe-column field="totalWinLose" title="总盈亏" min-width="120" />
                    <vxe-column field="RTP" title="RTP" min-width="120" />
                    <vxe-column field="errorRate" title="异常率" min-width="120" />
                </vxe-table>
            </div>
            <div class="page__footer">
                <div class="tab-footer">
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
                <pager
                    v-model:current="pagerInfo.page"
                    v-model:pageSize="pagerInfo.pageSize"
                    :total="total"
                    @onChange="reloadData"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, watch, onMounted, computed, onUnmounted, nextTick } from 'vue'
import useTable from '@/hooks/useTable'
import { aggregateData, statisticsData } from '@/api/homeApi.js'
import { gamelistAuth, listAuthProvider } from '@/api/merchant.js'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import StatCard from '@/components/CustomCard/index.vue'
import { useRollNumber } from '@/hooks/useRollNumber'
import dayjs from 'dayjs'
const { proxy } = getCurrentInstance()
const { t } = useI18n()
import { usePolling } from '@/hooks/usePolling'
// 日期时间选择
const timeValue = ref([])
const dateValue = ref(dayjs().format('YYYY-MM-DD'))
const startTime = computed(() => timeValue.value?.[0] || '')
const endTime = computed(() => timeValue.value?.[1] || '')
const { loading, queryParams, tableData, pagerInfo, total, handleSearch, handleReset, reloadData } = useTable(
    (params) =>
        statisticsData({
            ...params,
            // pageSize: 30,
            reportType: 1,
            tenantType: 2,
            startTime: startTime.value || '',
            endTime: endTime.value || '',
            // pickDate: dateValue.value,
            gameId: params.gameId?.map((id) => Number(id)) || [],
            providerId: params.providerId?.map((id) => Number(id)) || [],
            currency: params.currency?.map((id) => String(id)) || []
        }),
    { immediate: true, pageSize: 30 }
)

// 运营商选择
const targetOptions = ref([])
// 游戏选择
const gameOptions = ref([])
const currencyParams = ref(null)
// 货币类型
const currencyOptions = ref([
    { label: 'USD', id: 'USD' },
    { label: 'GOLD', id: 'GOLD' },
    { label: 'COIN', id: 'COIN' }
])
const columnConfig = reactive({
    resizable: true
})
// 卡片数据
const cardData = ref([])
// 字典转换
const CARD_MAP = [
    {
        key: 'newPlayer',
        title: '新增'
    },
    {
        key: 'playerActivation',
        title: '日活'
    },
    {
        key: 'totalBet',
        title: '总下注'
    },
    {
        key: 'totalWin',
        title: '总支出'
    },
    {
        key: 'rtp',
        title: 'RTP'
    }
]
const activeTable = ref('add')
// 切换标签
const switchTable = (t) => {
    activeTable.value = t
}
function formatRtp(val) {
    return Number(val.toFixed(2))
}
const toNumber = (val, fallback = 0) => {
    const num = Number(val)
    return Number.isFinite(num) ? num : fallback
}
// 处理卡片数据
function buildCardData(apiData) {
    cardData.value = CARD_MAP.map((cfg, index) => {
        const isRtp = cfg.key === 'rtp'

        const rawValue = toNumber(apiData[cfg.key])
        const rawCompare = toNumber(apiData[`${cfg.key}LinkRelate`])
        const value = isRtp
            ? formatRtp(rawValue) // 295 -> 2.95
            : Number(rawValue.toFixed(2))
        const compareValue = Number(rawCompare.toFixed(2))

        return {
            id: index + 1,
            title: cfg.title,
            value,
            compareValue,
            showCornerIcon: index > 1,
            suffix: isRtp ? '%' : cfg.suffix
        }
    })
}

// 点击下拉框
// 下拉框调用接口
const onDropdownVisible = (type, visible) => {
    if (!visible) return
    switch (type) {
        case 'game':
            getGameOptions()
            return
        case 'agent':
            loadAgentList()
            return
    }
}
// 获取游戏选项
const getGameOptions = async () => {
    try {
        const res = await gamelistAuth()
        gameOptions.value = res.items || []
    } catch (error) {
        console.log(error)
    }
}
// 获取供应商数据
const loadAgentList = async () => {
    const resp = await listAuthProvider()
    targetOptions.value = resp?.items.map((i) => ({
        id: i.id,
        name: i.providerName
    }))
}

// 获取仪表盘数据
const getData = async () => {
    const params = {
        currency: currencyParams.value,
        tenantType: 2
    }
    try {
        const resp = await aggregateData(params)
        buildCardData(resp)
    } catch (error) {
        console.log(error)
    }
}
// 日期选择时清空时间
const onDateChange = (val) => {
    if (val) {
        timeValue.value = []
    }
}
// 轮询30秒调接口
const { start } = usePolling(getData, { interval: 30000 })
// 时间选择时清空日期
const onTimeChange = (val) => {
    if (!val) {
        return
    }
    if (val.length) {
        dateValue.value = '' // 清空日期
    }
}
// 点击重置
const onHandleReset = () => {
    dateValue.value = dayjs().format('YYYY-MM-DD')
    timeValue.value = null
    handleReset()
}
// 点击搜索
const onHandleSearch = () => {
    // if (!timeValue.value || timeValue.value.length === 0) {
    //     proxy.$message.warning('请选择时间！')
    //     return
    // }
    handleSearch()
}
const onCurrencyChange = () => {
    getData()
}
const xTable = ref()
watch(
    () => [pagerInfo.value.page, pagerInfo.value.pageSize],
    () => {
        nextTick(() => {
            xTable.value?.scrollTo(0, 0)
        })
    },
    { flush: 'post' }
)
onMounted(() => {
    start()
})
</script>

<style lang="scss" scoped>
.workbench-container {
    background-color: #f0f2f5;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    .card {
        padding-top: 10px;
        padding-bottom: 10px;
        margin: 0 !important;
    }
    .page {
        background-color: #ffff;
        flex: 1;
        min-height: 0;
        .page__footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .tab-footer {
                margin-left: 10px;
            }
        }
    }
}
.optionsItem {
    margin-left: 5px;
    display: flex;
    align-items: center;
}

:deep(.search-bar__space) {
    justify-content: unset !important;
}
</style>
