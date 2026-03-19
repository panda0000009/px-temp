<template>
    <a-layout class="layout">
        <Sider />
        <a-layout>
            <Header />
            <a-layout-content class="layout-content">
                <Breadcrumb />
                <div class="layout-content__container">
                    <router-view v-slot="{ Component }">
                        <!-- <transition name="fade"> -->
                            <keep-alive>
                                <component :is="Component" />
                            </keep-alive>
                        <!-- </transition> -->
                    </router-view>
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup>
import Sider from './components/Sider/index.vue'
import Header from './components/Header/index.vue'
import Breadcrumb from './components/Breadcrumb/index.vue'
</script>

<style lang="scss" scoped>
.layout {
    height: 100%;
    overflow: hidden;

    &-content {
        display: flex;
        flex-direction: column;
        padding: 0 12px 12px;

        &__container {
            flex: 1;
            background: #fff;
            overflow: auto;
        }
    }
}
</style>
