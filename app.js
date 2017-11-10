const Koa = require('koa')
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

// 上传文件
const upload = require('./model/upload')
const { uploadFile } = require('./model/asyncupload')

// 静态资源
// const staticServer = require('./model/staticServer/index')
const static = require('koa-static')
// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './static'
// 由于koa-static目前不支持koa2
// 所以只能用koa-convert封装一下

// 设置缓存
var cacheControl = require('koa-cache-control')

// 用户新增信息
var userMoreInfo = require('./model/account/info')


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
        maxAge: 1000*60*15
    }
  }))
  // 设置静态服务器
  app.use(static(
    path.join( __dirname,  staticPath)
  ))
  
  // 设置缓存
  app.use(cacheControl({
    maxAge: 0
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

// app.use(async (ctx, next) => {
//     if (/\/image\//.test(ctx.request.url)) {
//         console.log('请求的图片')
//         await next()
//     }
// })
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
router.post('/createStar/',starCtrl.createStar)


//查询用户持有的卡片  
router.get('/marketting/card/',cardsMarking.getUserAllCards)
router.post('/marketting/insert/',cardsMarking.insertCardById)

// 上传文件路由 这个是koa-multer 这是只完成了表单上传 相对实现简单
router.post('/upload/', upload.single('file'), async (ctx, next) => {
    ctx.body = {
        filename: 'back'
    }
})
// 这个是busboy 相对复杂 实现逻辑还需要看一看
router.post('/asyncuplod/', asyncupload)

async function asyncupload (ctx) {
    let result = { success: false }
    let serverFilePath = path.join( __dirname, 'static/image' )

    // 上传文件事件
    result = await uploadFile( ctx, {
      fileType: 'album',
      path: serverFilePath
    })
    ctx.body = result
}
// 静态资源
// router.get('/static/:name', staticServer)

// 用户新增信息
router.post('/userMoreInfo/update/', userMoreInfo.updateInfo)
router.get('/getUserInfo/', userMoreInfo.getUserInfo)
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




