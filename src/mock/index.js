const jsonServer = require('json-server')
// 创建http服务
const server = jsonServer.create()
// 路由匹配的js数据
const router = jsonServer.router('db.js')
// 使用默认中间件
const middleWares = jsonServer.defaults()

server.use(middleWares)
server.use(router)

// 监听http服务
server.listen({host: '192.168.137.1', post: 3000}, () => {
  console.log('JSON Server is running')
})
