<template>
    <div class="page-box-demo">
        <a-card title="基础 page-box 容器" class="page-box-demo__card">
            <PageBox>
                <div class="page-box-demo__content">
                    <h3>内容容器示例</h3>
                    <p>这个区域演示 `page-box` 作为白底内容块的基础承载能力。</p>
                    <p>它保留了阴影、底部间距和默认插槽行为，适合包裹表单、表格或说明内容。</p>
                </div>
            </PageBox>
        </a-card>

        <a-card title="标题栏样式与按钮栏" class="page-box-demo__card">
            <PageBox>
                <PageBoxTitle
                    title="营销位配置"
                    tip-txt="请在保存前检查按钮状态"
                    subtitle="这里演示标题、副标题、彩色强调、按钮栏以及插槽扩展。"
                    :button-list="titleButtonList"
                    :title-button-row-data="titleButtonRowData"
                    :is-strong-title="true"
                    :has-color="true"
                >
                    <a-tag color="blue">插槽内容</a-tag>
                </PageBoxTitle>
                <div class="page-box-demo__content">
                    <p>按钮栏已改为直接渲染 Ant Design 按钮，不再依赖旧工程里的按钮组件。</p>
                    <p>按钮支持 `label`、`type`、`loading`、`disabled`、`float`、`function`、`onClick`。</p>
                </div>
            </PageBox>

            <PageBox>
                <PageBoxTitle
                    type="sub"
                    title="副级标题样式"
                    subtitle="`type=&quot;sub&quot;` 会启用更紧凑的标题栏视觉效果。"
                />
                <div class="page-box-demo__content">
                    <p>这个场景用来验证旧样式变体在 Vue 3 下仍能正常展示。</p>
                </div>
            </PageBox>
        </a-card>

        <a-card title="显式 pageBoxRef 折叠联动" class="page-box-demo__card">
            <a-space wrap class="page-box-demo__actions">
                <a-button type="primary" @click="toggleFold">外部切换折叠</a-button>
                <a-button @click="expandFoldableBox">强制展开</a-button>
                <span>当前状态：{{ foldStateText }}</span>
            </a-space>

            <PageBox ref="foldableBoxRef">
                <PageBoxTitle
                    title="支持折叠"
                    subtitle="通过显式传入 pageBoxRef，让标题栏控制对应 page-box 的展开与收起。"
                    :button-list="foldButtonList"
                    :title-button-row-data="titleButtonRowData"
                    :is-foldable="true"
                    :is-folded-default="true"
                    :page-box-ref="foldableBoxRef"
                />
                <div class="page-box-demo__content page-box-demo__content--long">
                    <p>这块内容故意写得更长，用来观察折叠时的裁切效果是否与旧版一致。</p>
                    <p>如果当前是折叠状态，这里应该会被限制在 46px 高度以内，只保留标题栏露出。</p>
                    <p>你也可以通过上面的外部按钮来切换折叠，验证 `switchFold()` 和 `setFolded(false)` 的实例方法。</p>
                    <p>当前 demo 不再使用 `$parent` 做隐式联动，所有控制都通过显式 `pageBoxRef` 完成。</p>
                </div>
            </PageBox>
        </a-card>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { message } from 'ant-design-vue'

import PageBox from '@/components/common/page-box.vue'
import PageBoxTitle from '@/components/common/page-box-title.vue'

const foldableBoxRef = ref(null)

const titleButtonRowData = {
    id: 1001,
    name: '营销位配置'
}

const readFoldedState = () => {
    const folded = foldableBoxRef.value?.isFolded

    if (typeof folded === 'boolean') {
        return folded
    }

    if (typeof folded?.value === 'boolean') {
        return folded.value
    }

    return false
}

const foldStateText = computed(() => (readFoldedState() ? '已折叠' : '已展开'))

const titleButtonList = [
    {
        label: '查看行数据',
        float: 'left',
        onClick: (rowData) => {
            message.info(`当前标题栏数据：${rowData?.name || '-'}`)
        }
    },
    {
        label: '保存',
        type: 'primary',
        function: (rowData) => {
            message.success(`已触发保存：${rowData?.name || '-'}`)
        }
    },
    {
        label: '禁用按钮',
        disabled: () => true,
        onClick: () => {
            message.info('这颗按钮会保持禁用，不会触发')
        }
    }
]

const foldButtonList = [
    {
        label: '读取状态',
        onClick: () => {
            message.info(`当前容器${readFoldedState() ? '已折叠' : '已展开'}`)
        }
    },
    {
        label: '展开内容',
        type: 'primary',
        function: () => {
            expandFoldableBox()
            message.success('容器已展开')
        }
    }
]

const toggleFold = () => {
    foldableBoxRef.value?.switchFold?.()
}

const expandFoldableBox = () => {
    foldableBoxRef.value?.setFolded?.(false)
}
</script>

<style lang="scss" scoped>
.page-box-demo {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__card {
        border-radius: 12px;
    }

    &__actions {
        margin-bottom: 12px;
    }

    &__content {
        padding: 18px 20px 24px;
        color: #444;
        line-height: 1.8;

        h3 {
            margin-bottom: 12px;
            font-size: 18px;
            color: #1f1f1f;
        }

        p {
            margin: 0 0 8px;
        }
    }

    &__content--long {
        min-height: 220px;
    }
}
</style>
