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
    target: Sequelize.TEXT,
    createTime:Sequelize.DATE
}, {
        timestamps: false
    });

//发送消息
let sendMsg = async (ctx ,next) => {
    try {
        let content = ctx.request.body.content || ''
        let author = ctx.request.body.author || ''
        let target = ctx.request.body.target || ''

        if (author&&content) {
            const now = Date.now()
            let msg = await Msg.create({
                author,
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
//发送消息
let getAllMsg = async (ctx ,next) => {
    try {
            let msg = await Msg.findAll({
                   status: 0,
            })
            if (msg&&msg.length) {
                for (let item of msg) {
                    item.content = decodeURIComponent(item.content)
                }
                ctx.response.type = 'json'
                ctx.response.body = {
                  status: 200,
                  message: 'successfully',
                  data: {
                    msg
                  }
                }
        } else {
            //传入参数有误
            ctx.response.type = 'json'
            ctx.response.body = {
                status: 400,
                message: '没有查询到数据'
            }
        }
    }catch(err) {
        console.log(err)
        ctx.response.type = 'json'
        ctx.response.body = {
            status: 400,
            message: 'search failed'
        }
    }
}

module.exports = {
    sendMsg,
    getAllMsg
}