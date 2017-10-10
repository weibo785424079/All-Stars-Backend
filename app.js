const Koa = require('Koa')
const router = require('koa-router')()
const Sequelize = require('./config')
const bodyParser = require('koa-bodyparser')
const userCtrl = require('./controllers/user')
const app = new Koa()

app.use(async (ctx,next)=>{
    console.log('第一个async函数')
    await next()
})



app.use(bodyParser())

// app.use(async (ctx,next)=>{
//     ctx.response.type = 'json'
//     ctx.response.body = 'hello 你正在尝试连接上数据库!'
//     await next()
// })


router.get('/user/all/',userCtrl.getStatus1)

app.use(router.routes())

app.listen(3000)