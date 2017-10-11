const Sequelize = require('sequelize')
const url = require('url')
const config = require('../config')
var now = Date.now()

let sequelize =  new Sequelize(config.database,config.username,config.password,{
    host:config.host,
    dialect:'mysql',
    pool:{
        max: 100,
        min: 0,
        idle: 30000
    }
})

var Msg = sequelize.define('msg', {
    // id: {
    //     type: Sequelize.INTEGER(11),
    //     primaryKey: true
    // },
    author: Sequelize.TEXT('tiny'),
    content: Sequelize.INTEGER(11),
    status: Sequelize.INTEGER(11),
    createTime:Sequelize.DATE
}, {
        timestamps: false
    });

//发送消息
let sendMsg = async (ctx ,next) => {
    try {
        let username = ctx.request.body.username || ''
        let content = ctx.request.body.content || ''
        let target = ctx.request.body.target || ''

        if (username&&content) {
            const now = Date.now()
            let msg = await Msg.create({
                author: username,
                content: encodeURIComponent(content),
                status: 0,
                createTime: now,
                target
            })
            console.log('created: '+msg)
            ctx.response.type = 'json'
            ctx.response.body = {
              status: 200,
              message: 'inserted successfully',
              data: {
                msgId: msg.id
              }
            }
        }else {
            //传入参数有误
            ctx.response.type = 'json'
            ctx.response.body = {
                status: 400,
                message: '传入参数不正确'
            }
        }



    }catch(err) {
        console.log(err)
        ctx.response.type = 'json'
        ctx.response.body = {
            status: 400,
            message: 'inserted failed'
        }
    }
}

module.exports = {
    sendMsg
}