<template>
    <a-layout-sider class="sider" v-model:collapsed="collapsed" collapsible>
        <div class="sider__logo">
            <!-- <img src="@/assets/logo.png" /> -->
            <span v-if="!collapsed">{{ title }}</span>
        </div>
        <div class="sider__menu">
            <a-menu
                v-model:openKeys="openKeys"
                v-model:selectedKeys="selectedKeys"
                mode="inline"
                theme="dark"
                @select="handleMenuSelect"
            >
                <sider-menu v-for="item of menus" :key="item.path" :data="item" />
            </a-menu>
        </div>
    </a-layout-sider>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useUserStore from '@/stores/modules/userStore'
import SiderMenu from './components/SiderMenu.vue'

const router = useRouter()
const { userInfo } = useUserStore()

const collapsed = ref(false)
const currentRoute = useRoute()
const openKeys = ref([])
// 当前选中菜单项
const selectedKeys = ref([currentRoute.path])
const menus = computed(() => {
    return userInfo.value?.menus || []
})
const title = computed(() => {
    return import.meta.env.VITE_APP_ENV === 'test' ? '测试中台后台管理系统' : '正式中台后台管理系统'
})
// 菜单点击处理
const handleMenuSelect = ({ item }) => {
    const { path } = item.originItemValue || {}
    selectedKeys.value = [path]
    router.push(path)
}
</script>

<style lang="scss" scoped>
.ant-layout-sider,
.ant-menu-dark {
    background-color: var(--sidebar-bg) !important;
}

.ant-menu-dark .ant-menu-item:hover {
    background-color: var(--sidebar-hover) !important;
}

.ant-menu-dark .ant-menu-item-selected {
    background-color: var(--sidebar-active) !important;
}

.sider__logo {
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 0;
    img {
        margin-right: 5px;
        width: 45px;
        height: 45px;
        border-radius: 10px;
    }
    span {
        font-size: 16px;
    }
}

.sider__menu {
    width: 100%;
    height: calc(100% - 61px);
    overflow: hidden auto;
}
/* 子菜单容器背景 */
:deep(.ant-menu-dark .ant-menu-sub.ant-menu-inline) {
  background-color: var(--sidebar-bg) !important;
}

/* 子菜单 item */
:deep(.ant-menu-dark .ant-menu-sub .ant-menu-item) {
  background-color: transparent;
}

/* 子菜单 hover */
:deep(.ant-menu-dark .ant-menu-sub .ant-menu-item:hover) {
  background-color: var(--sidebar-hover) !important;
}

/* 子菜单选中 */
:deep(.ant-menu-dark .ant-menu-sub .ant-menu-item-selected) {
  background-color: var(--sidebar-active) !important;
}
</style>
