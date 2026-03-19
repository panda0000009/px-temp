<template>
    <a-menu-item v-if="!data.children || data.children.length === 0" :key="data.path" :originItemValue="data">
        <template #icon>
            <component v-if="data.meta?.icon" :is="icons[data.meta.icon]" v-bind="$attrs"></component>
        </template>
        {{ $t(`menuList.${data.path}`) }}
        <!-- {{ data.meta?.title }} -->
    </a-menu-item>
   
   <!-- :title="data.meta?.title"   -->
    <a-sub-menu v-if="data.children && data.children.length > 0" :title="t(`menuList.${data.path}`)"  :key="data.path">
        <template #icon>
            <component v-if="data.meta?.icon" :is="icons[data.meta.icon]" v-bind="$attrs"></component>
        </template>
        <sider-menu v-for="item in data.children" :key="item.path" :data="item"></sider-menu>
    </a-sub-menu>
</template>

<script setup>
import * as icons from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
defineOptions({
    name: 'SubMenu'
})

defineProps({
    parentKey: String,
    data: Object
})
</script>
