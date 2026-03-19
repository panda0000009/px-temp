<template>
    <a-layout-header class="header">
        <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
                <a-avatar size="small" class="avatar">
                    <template #icon>
                        <UserOutlined v-if="!userInfo.value.avatar" />
                        <img v-else :src="userInfo.value.avatar" />
                    </template>
                </a-avatar>
                <!-- <DownOutlined /> -->
            </a>
            <template #overlay>
                <a-menu>
                    <a-menu-item>
                        <a href="javascript:;" @click="changeLang">{{ localetext }}</a>
                    </a-menu-item>
                    <a-menu-item>
                        <a href="javascript:;" @click="handleChangePassword">修改资料</a>
                    </a-menu-item>
                    <a-menu-item>
                        <a href="javascript:;" @click="handleLogout('退出成功')">退出登录</a>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </a-layout-header>

    <change-password-modal v-model:value="visible" />
</template>

<script setup>
import { ref } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import ChangePasswordModal from '@/components/editModal/index.vue'
import useUserStore from '@/stores/modules/userStore'
import { useLogout } from '@/hooks/usehandlogout'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
const { handleLogout } = useLogout()
const localetext = ref(localStorage.getItem('LANG') === 'zhCN' ? 'English' : '简体中文')
const { userInfo } = useUserStore()
const visible = ref(false)
const handleChangePassword = () => {
    visible.value = true
}

// 语言切换
const changeLang = () => {
    const lang = locale.value === 'enUS' ? 'zhCN' : 'enUS'
    localetext.value = lang === 'zhCN' ? 'English' : '简体中文'
    locale.value = lang
    // English
    localStorage.setItem('LANG', lang)
}
</script>

<style lang="scss" scoped>
.header {
    background: #fff;
    padding: 0 20px;
    display: flex;
    justify-content: flex-end;

    .avatar {
        margin-right: 10px;
    }
}
</style>
