<template>
    <div class="slid">
        <div class="tags">
            <a-tag
                :closable="tabList.length === 1 && (item.path === '/workbench' || item.path === '/') ? false : true"
                :color="ischecked(item)"
                v-for="(item, index) in tags"
                :key="item.path"
                @close="del(item.path, index)"
                @click="router.push(item.path)"
                class="a-tag"
            >
                {{ t(`menuList.${item.path}`) }}
            </a-tag>
        </div>
    </div>
</template>
<script setup>
import { watch, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { commonStore } from '@/stores'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const router = useRouter()
const common = commonStore()

const tags = ref([])
// 颜色选中
const ischecked = (item) => {
    return router.currentRoute.value.path === item.path ? '#1677ff' : ''
}
// 监听路由变化
watch(
    () => router.currentRoute.value,
    (newRoute, oldRoute) => {
        if (newRoute.path !== '/') {
            common.useTab({ name: newRoute.meta.title, path: newRoute.path })
            tags.value = common.tab
        }
    },
    { deep: true, immediate: true }
)

// 删除头部标签
const del = (path, index) => {
    common.delTags(path)

    if (path === router.currentRoute.value.path) {
        if (common.tab.length) {
            router.push({
                path: common.tab[index - 1].path
            })
        } else {
            router.push({
                path: '/'
            })
        }
    }
    tags.value = [...common.tab]
}

const tabList = computed(() => common.tab)
tags.value = tabList.value
</script>

<style lang="scss" scoped>
.slid {
    width: 100%;
    box-sizing: border-box;
    padding: 20px 0;
    .tags {
        display: flex;
        cursor: pointer;
        box-sizing: border-box;
    }
}
</style>
