<template>
    <div class="editor__container">
        <Editor
            :id="id"
            :modelValue="value"
            licenseKey="gpl"
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            :init="init"
            :disabled="disabled"
        />
        <div v-if="visible" class="editor__container__mask"></div>
    </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'

// 引入编辑器所需的插件
import 'tinymce/themes/silver' //编辑器主题，不引入则报错
import 'tinymce/icons/default' //引入编辑器图标icon，不引入则不显示对应图标

// 引入编辑器插件
import 'tinymce/plugins/advlist' //高级列表
import 'tinymce/plugins/anchor' //锚点
import 'tinymce/plugins/autolink' //自动链接
//import "tinymce/plugins/autoresize"; //编辑器高度自适应,注：plugins里引入此插件时，Init里设置的height将失效
import 'tinymce/plugins/autosave' //自动存稿
import 'tinymce/plugins/charmap' //特殊字符
import 'tinymce/plugins/code' //编辑源码
import 'tinymce/plugins/codesample' //代码示例
import 'tinymce/plugins/directionality' //文字方向
import 'tinymce/plugins/fullpage' //文档属性
import 'tinymce/plugins/fullscreen' //全屏
import 'tinymce/plugins/help' //帮助
import 'tinymce/plugins/hr' //水平分割线
import 'tinymce/plugins/image' //插入编辑图片
import 'tinymce/plugins/importcss' //引入css
import 'tinymce/plugins/insertdatetime' //插入日期时间
import 'tinymce/plugins/link' //超链接
import 'tinymce/plugins/lists' //列表插件
import 'tinymce/plugins/media' //插入编辑媒体
import 'tinymce/plugins/nonbreaking' //插入不间断空格
import 'tinymce/plugins/pagebreak' //插入分页符
import 'tinymce/plugins/paste' //粘贴插件
import 'tinymce/plugins/preview' //预览
import 'tinymce/plugins/print' //打印
import 'tinymce/plugins/quickbars' //快速工具栏
import 'tinymce/plugins/save' //保存
import 'tinymce/plugins/searchreplace' //查找替换
import 'tinymce/plugins/tabfocus' //切入切出，按tab键切出编辑器，切入页面其他输入框中
import 'tinymce/plugins/table' //表格
import 'tinymce/plugins/template' //内容模板
import 'tinymce/plugins/textcolor' //文字颜色
import 'tinymce/plugins/textpattern' //快速排版
import 'tinymce/plugins/toc' //目录生成器
import 'tinymce/plugins/visualblocks' //显示元素范围
import 'tinymce/plugins/visualchars' //显示不可见字符
import 'tinymce/plugins/wordcount' //字数统计

const props = defineProps({
    id: {
        type: String,
        default: function () {
            return 'tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
        }
    },
    value: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: '请输入内容...'
    },
    height: {
        type: Number,
        default: 400
    },
    disabled: {
        type: Boolean,
        default: false
    },
    valid: {
        type: Boolean,
        default: false
    },
    plugins: {
        type: [String, Array],
        default:
            'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave'
    },
    toolbar: {
        type: [String, Array],
        default:
            'undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold indent2em italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent indent2em lineheight formatpainter axupimgs | \
                formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat fullscreen | \
                table image media charmap hr pagebreak | selectall searchreplace visualblocks'
    },
    fontTypes: {
        type: String,
        default:
            '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;'
    },
    fontSizes: {
        type: String,
        default: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px'
    },
    LineHighs: {
        type: String,
        default: '0.5 0.8 1 1.2 1.5 1.75 2 2.5 3 4 5'
    },
    contentStyle: {
        type: String,
        default:
            'body {margin:8px 11px;} body::before {font-size: 15px; color: #bfbfbf!important;} img {max-width:100%;}'
    }
})

watch(
    () => props.value,
    (value) => {
        valid(value)
    }
)

const emit = defineEmits(['update:value', 'onChange'])
const visible = ref(true)
const init = reactive({
    selector: `#${props.id}`,
    language_url: '/tinymce/langs/zh_CN.js',
    language: 'zh_CN',
    skin_url: '/tinymce/skins/ui/oxide',
    content_css: 'skins/ui/oxide/content.min.css',
    height: props.height || 400,
    plugins: props.plugins,
    toolbar: props.toolbar,
    toolbar_mode: 'sliding',
    fontsize_formats: props.fontSizes,
    font_formats: props.fontTypes,
    lineheight_formats: props.LineHighs, //行高配置，也可配置成"12px 14px 16px 20px"这种形式
    menubar: false, // 隐藏菜单栏
    placeholder: props.placeholder,
    branding: false, // 隐藏底部信息
    resize: false,
    statusbar: false, // 隐藏状态栏
    elementpath: false, // 隐藏元素路径
    content_style: props.contentStyle,
    image_advtab: true, // 为上传图片窗口添加高级属性
    paste_data_images: true, // 图片是否可粘贴
    init_instance_callback: (editor) => {
        // 编辑器初始化完成后执行的函数
        if (props.value) {
         
            editor.setContent(props.value)
        }

        editor.on('Input undo redo Change SetContent', () => {
            const content = editor.getContent()
            emit('update:value', content)
            emit('onChange', content)
        })
    },
    images_upload_handler: (blobInfo, success, failure) => {
        const file = blobInfo.blob() // 转化为易于理解的file对象
        const isLt10M = file.size / 1024 / 1024 < 4
        if (!isLt10M) {
            failure('上传图片大小不能超过5MB!')
            return
        }

        const img = `data:${blobInfo.blob().type};base64,${blobInfo.base64()}`
        success(img)
    } // 图片上传函数
})

const valid = (value) => {
    if (!props.valid) return
    const dom = document.querySelector('.tox-tinymce')
    if (dom) {
        if (!value) {
            dom.classList.add('valid')
        } else {
            dom.classList.remove('valid')
        }
    }
}

defineExpose({ valid })

onMounted(() => {
    tinymce.init({}).then(() => {
        setTimeout(() => {
            visible.value = false
        }, 10)
    })
})
</script>

<style lang="scss" scoped>
.editor__container {
    position: relative;

    :deep(.tox-tinymce) {
        border: 1px solid #d9d9d9;
        border-radius: 6px;

        &.valid {
            border-color: #ff4d4f;
        }
    }

    &__mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #fff;
        z-index: 9999;
    }
}
</style>
