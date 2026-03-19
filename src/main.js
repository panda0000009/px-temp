import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import pinia from '@/stores/store'
import router from './router'
import { Modal, message } from 'ant-design-vue'
import { lazyVxeUI, lazyVxeTable } from '@/utils/lazyVxe'
import { lazyEcharts } from '@/utils/lazyEcharts'
import { lazyCommonComp } from '@/utils/lazyCommonComp'
import i18n from '@/i18n/index.js'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
import './permission'
const app = createApp(App)
app.config.globalProperties.$modal = Modal
app.config.globalProperties.$message = message
app.config.globalProperties.$dayjs = dayjs
app.use(pinia).use(router).use(i18n).use(lazyVxeUI).use(lazyVxeTable).use(lazyEcharts).use(lazyCommonComp).mount('#app')
