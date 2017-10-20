const Koa = require('Koa')
const path = require('path')
const router = require('koa-router')()
const Sequelize = require('./config')
const bodyParser = require('koa-bodyparser')
const userCtrl = require('./controllers/user')
const chatCtrl = require('./controllers/chatCtrl')
const starCtrl = require('./controllers/star')
const imgCtrl = require('./controllers/img')
const getStarRandom = require('./controllers/getStarRandom')
const cardsMarking = require('./model/cards_marking')
const WebSocket = require('ws')
const schedule =  require('./schedule/resetUserLuckChance')
const session = require('koa-session-minimal')
const MysqlStore = require('koa-mysql-session')
const config = require('./config')

const sessionMysqlConfig= {
    user: config.username,
    password: config.password,
    database: config.database,
    host: config.host
  }





schedule.resetLuckyTimes()

const WebSocketServer = WebSocket.Server
const app = new Koa()

app.use(session({
    key: 'USER_SID',
    store: new MysqlStore(sessionMysqlConfig),
    cookie: {
        maxage: 1000*60*15
    }
  }))


app.use(async (ctx,next)=>{
    try {
        console.log('正在查询数据....',ctx.request)
        await next()
    }catch(err) {
        console.log(err)
        ctx.response.type = 'json'
        ctx.response.body = {
            status: 500,
            message: err || '获取数据失败',
            data: []
        }
    }  
})
// 不要要验证登录的接口

app.use(bodyParser())
router.post('/user/login/',userCtrl.login)
router.get('/star/allNews/',starCtrl.getAllNews)
//获取图片
router.get('/img/:id',imgCtrl.oneImg)

//用户相关
router.get('/user/one/',userCtrl.getUserById)
router.get('/user/checklogin/',userCtrl.checkLogin)
router.get('/user/logout/',userCtrl.logOut)

// 聊天相关
router.post('/chat/send/',chatCtrl.sendMsg)
router.get('/chat/allmsg/',chatCtrl.getAllMsg)

//球星相关 
router.get('/star/info/',starCtrl.getStarInfo)
router.post('/star/allstar/',starCtrl.getAllStars)
router.post('/star/one/',getStarRandom.getStarRandom)


//查询用户持有的卡片  
router.get('/marketting/card/',cardsMarking.getUserAllCards)
router.post('/marketting/insert/',cardsMarking.insertCardById)

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




