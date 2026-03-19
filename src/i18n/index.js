import { createI18n } from "vue-i18n";
import enUS from "./locales/en-US/index.js";
import zhCN from "./locales/zh-CN/index.js";


const message = {
    enUS: {
        ...enUS,
    },
    zhCN: {
        ...zhCN,
    },
};

const i18n = createI18n({
    locale: localStorage.getItem('LANG') || "zhCN", // 设置语言类型
    legacy: false, // 如果要支持compositionAPI，此项必须设置为false;
    globalInjection: true, // 全局注册$t方法
    fallbackLocale: 'zhCN',
    messages: message,
});

export default i18n;