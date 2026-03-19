import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
// import mpaPlugin from './vite-plugin-mpa'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import'
import viteCompression from 'vite-plugin-compression'

/************************************* 路径配置 start ********************************/
import { resolve } from 'path'

const pathResolve = (dir) => {
    return resolve(__dirname, '.', dir)
}

/************************************* 路径配置 end ********************************/

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '') // 加载环境变量

    return {
        // 多页面配置
        pages: {
            index: {
                entry: 'src/main.js',
                template: 'public/index.html',
                filename: 'index.html',
                title: '管理后台系统',
                chunks: ['chunk-vendors', 'chunk-common', 'index']
            }
        },
        plugins: [
            vue(),
            // mpaPlugin(),
            viteCompression({
                verbose: true, // 是否在控制台输出压缩结果
                disable: false, // 默认 false, 设置为 true 来禁用压缩
                threshold: 10240, // 只处理大于此大小的资源（单位：字节）。默认值为 0。
                algorithm: 'gzip', // 使用 gzip 压缩
                ext: '.gz', // 输出文件的扩展名
                deleteOriginFile: false
            }),
            viteCompression({
                verbose: true, // 是否在控制台输出压缩结果
                disable: false, // 默认 false, 设置为 true 来禁用压缩
                threshold: 10240, // 只处理大于此大小的资源（单位：字节）。默认值为 0。
                algorithm: 'brotliCompress', // 使用 brotli 压缩
                ext: '.br', // 输出文件的扩展名
                deleteOriginFile: false
            }),
            Components({
                resolvers: [
                    AntDesignVueResolver({
                        importStyle: false // css in js
                    })
                ]
            }),
            lazyImport({
                resolvers: [
                    VxeResolver({
                        libraryName: 'vxe-table' // 按需加载 'vxe-table'
                    }),
                    VxeResolver({
                        libraryName: 'vxe-pc-ui' // 按需加载 'vxe-pc-ui'
                    })
                ]
            })
        ],
        resolve: {
            alias: {
                // 路径别名配置
                '@': pathResolve('src')
            }
        },
        server: {
            port: 3000, // 开发服务器端口
            open: true, // 启动时自动打开浏览器
            proxy: {
                '/api': {
                    target: env.VITE_API_BASE_URL,
                    changeOrigin: true,
                    secure: false, // 允许自签名证书
                    rewrite: (path) => path.replace(/^\/api/, '')
                }
            }
        },
        // 优化分包
        optimization: {
            splitChunks: {
                cacheGroups: {
                    common: {
                        name: 'chunk-common',
                        chunks: 'initial',
                        minChunks: 2,
                        maxInitialRequests: 5,
                        minSize: 0,
                        priority: 1,
                        reuseExistingChunk: true,
                        enforce: true
                    },
                    vendors: {
                        name: 'chunk-vendors',
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'initial',
                        priority: 2,
                        reuseExistingChunk: true,
                        enforce: true
                    }
                }
            }
        },
        build: {
            // minify: false,
            terserOptions: {
                treeshake: false,
                keep_classnames: true, // 保留类名（若语言包通过类导入）
                keep_fnames: true // 保留函数名
            },
            chunkSizeWarningLimit: 1500, // 修改打包时的警告阈值，超出 1500 KB 时发出警告
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'index.html')
                },
                output: {
                    manualChunks: {
                        'ant-design-vue': ['ant-design-vue'], // 将 'ant-design-vue' 分为单独的 chunk
                        'vxe-table': ['vxe-table'], // 将 'vxe-table' 分为单独的 chunk
                        'vxe-pc-ui': ['vxe-pc-ui'], // 将 'vxe-pc-ui' 分为单独的 chunk
                        i18n: ['vue-i18n']
                    }
                }
            },
            commonjsOptions: {
                exclude: ['vue-i18n'] // 若使用 CommonJS 版本，排除处理
            }
        },
        optimizeDeps: {
            exclude: ['vue-i18n'] // 避免预构建 vue-i18n
        }
    }
})
