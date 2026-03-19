<template>
    <a-config-provider :locale="zhCN">
        <router-view v-slot="{ Component }">
            <keep-alive v-if="$route.meta.keepAlive">
                <component :is="Component" />
            </keep-alive>
            <component :is="Component" v-if="!$route.meta.keepAlive" />
        </router-view>
    </a-config-provider>
</template>

<script setup>
import { RouterView } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
if (import.meta.env.VITE_APP_ENV === 'test') {
    const root = document.documentElement
    root.style.setProperty('--sidebar-bg', '#bf8844')
    root.style.setProperty('--sidebar-hover', '#ffa940')
    root.style.setProperty('--sidebar-active', '#ffa940')
}
</script>
