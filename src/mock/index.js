const jsonServer = require('json-server')
const db = require('./db.js')
// 创建http服务
const server = jsonServer.create()
// 路由匹配的js数据
const router = jsonServer.router(db)
// 使用默认中间件
const middleWares = jsonServer.defaults()

// server.use(jsonServer.bodyParser)
server.use(middleWares)
server.use(router)

// 监听http服务
server.listen({host: 'localhost', port: 3000}, () => {
  console.log('JSON Server is running')
})
