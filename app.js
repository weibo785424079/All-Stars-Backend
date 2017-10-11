const Koa = require('Koa')
const router = require('koa-router')()
const Sequelize = require('./config')
const bodyParser = require('koa-bodyparser')
const userCtrl = require('./controllers/user')
const chatCtrl = require('./controllers/chatCtrl')
const WebSocket = require('ws')
const WebSocketServer = WebSocket.Server
const app = new Koa()

app.use(async (ctx,next)=>{
    console.log('正在查询数据....')
    await next()
})

app.use(bodyParser())

// app.use(async (ctx,next)=>{
//     ctx.response.type = 'json'
//     ctx.response.body = 'hello 你正在尝试连接上数据库!'
//     await next()
// })


router.get('/user/all/',userCtrl.getStatus1)
router.post('/user/login/',userCtrl.login)

router.post('/chat/send/',chatCtrl.sendMsg)


app.use(router.routes())

let server =  app.listen(3000)


const wsServer = new WebSocketServer({server})

wsServer.on('connection', (ws) => {
    console.log('ws: connection')
    ws.on('message',(message) => {
        console.log(`wsServer:received ${message}`)
        wsServer.clients.forEach(client => {
            client.send(JSON.stringify({
                type: 'info',
                data: message
            }))
        })

    })
})




