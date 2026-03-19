<template>
    <div class="page-not-found">
        <a-result status="404" title="404" sub-title="找不到该页面，是否没有权限访问.">
            <template #extra>
                <a-button type="primary" @click="goHome">返回首页</a-button>
            </template>
        </a-result>
    </div>
</template>


<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const goHome = () => {
    router.push('/')
}
</script>
<style lang="scss" scoped>
.page-not-found {
    background: #fff;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>