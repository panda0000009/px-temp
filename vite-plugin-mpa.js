// vite-plugin-mpa.js
export default function mpaPlugin() {
  return {
    name: 'mpa-plugin',
    configureServer(server) {
      // 开发服务器中间件，处理多页面应用的路由
      server.middlewares.use((req, res, next) => {
        const url = req.url
        // 处理管理后台路由
        if (url.startsWith('/distributor') && !url.includes('.') && !url.startsWith('/distributor/assets')) {
          req.url = '/distributor.html'
        }
        next()
      })
    }
  }
}