<template>
    <div class="login">
        <div class="login-container">
            <div class="logo">
                <!-- <img src="@/assets/logo.png" alt="" /> -->
                <span>活动管理平台</span>
            </div>
            <a-form
                :model="formState"
                name="basic"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 16 }"
                autocomplete="off"
                @finish="onFinish"
                @finishFailed="onFinishFailed"
            >
                <a-form-item
                    label="用户名"
                    name="account"
                    :rules="[{ required: true, message: 'Please input your account!' }]"
                >
                    <a-input v-model:value="formState.account" placeholder="请输入账号" />
                </a-form-item>

                <a-form-item
                    label="密码"
                    name="password"
                    :rules="[{ required: true, message: 'Please input your password!' }]"
                >
                    <a-input-password v-model:value="formState.password" placeholder="请输入密码" />
                </a-form-item>
                <a-form-item :wrapper-col="{ offset: 6, span: 16 }">
                    <a-button class="login-form-button" type="primary" html-type="submit" :loading="loading"
                        >登录</a-button
                    >
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useUserStore from '@/stores/modules/userStore'
import { loginApi } from '@/apis/index'
import { message } from 'ant-design-vue'

const router = useRouter()
const { setUserInfo, getUserPermission } = useUserStore()

const formState = reactive({
    account: '', // 用户名
    password: '' // 密码
})
const loading = ref(false)
const onFinish = async (values) => {
    try {
        loading.value = true
        const res = await loginApi.loginHandler({ ...formState, ...values })
        // 判断是否新用户（普通用户没有权限）
        const isNewUser =
            !res.isSuper &&
            (!res.menus || res.menus.length === 0) &&
            (!res.roles || res.roles.length === 0 || res.roles[0]?.menus.length === 0)

        if (isNewUser) {
            return message.error('该账户没有权限,请联系管理员')
        }
        // 保存用户信息和 token
        setUserInfo(res)
        localStorage.setItem('token', res.jwtToken)
        sessionStorage.setItem('menus', JSON.stringify(res.roles?.[0]?.menus || []))
        // 计算首页路由
        let firstRoutePath = '/'
        if (res.isSuper) {
            // 超管默认跳工作台
            firstRoutePath = import.meta.env.VITE_APP_INDEX_HOME_URL || '/workbench'
        } else {
            // 普通用户，找第一个有权限的路由
            const menus = res.roles?.[0]?.menus || []
            firstRoutePath = menus?.[1]?.route || import.meta.env.VITE_APP_INDEX_HOME_URL || '/'
        }
        // 登录成功跳转
        router.replace(firstRoutePath)
        message.success('登录成功')
    } catch (error) {
        console.log(error)
        message.error(error)
    } finally {
        loading.value = false
    }
}

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
}
</script>
<style lang="scss" scoped>
.login {
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(-50deg, #23d5ab, #ee7752, #e73c7e, #23a6d5, #e73c7e);
    background-size: 400% 400%;
    animation: gradientFlow 15s ease infinite;

    &-container {
        background: #fff;
        padding: 10px 20px;
        border-radius: 10px;
        color: #000;
        width: 290px;

        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px 0;

            img {
                width: 50px;
                height: 50px;
                border-radius: 5px;
                margin-right: 10px;
            }

            span {
                font-weight: 900;
                font-size: 16px;
            }
        }

        .login-form-button {
            width: 100%;
        }
    }
}

@keyframes gradientFlow {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>
