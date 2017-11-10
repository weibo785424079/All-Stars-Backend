const Sequelize = require('sequelize')
const url = require('url')
const config = require('../config')
const checklogin = require('./../model/checklogin')
const crypto = require('crypto')
function cryptoPwd(password) {
    var md5 = crypto.createHash('md5')
    return md5.update(password).digest('hex')
}
var now = Date.now()

let sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 100,
        min: 0,
        idle: 30000
    },
    timezone: '+08:00'
})

var User = sequelize.define('user', {
    // id: {
    //     type: Sequelize.INTEGER(11),
    //     primaryKey: true
    // },
    name: Sequelize.STRING(11),
    level: Sequelize.INTEGER(11),
    status: Sequelize.INTEGER(11),
    org: Sequelize.STRING(11),
    password: Sequelize.STRING(11),
    account: Sequelize.STRING(11),
    gender: Sequelize.STRING(11),
    leftTimes: Sequelize.INTEGER,
    createTime: Sequelize.STRING(11)
}, {
        timestamps: false
    });


let getUserById = async (ctx, next) => {
    if (!checklogin(ctx)) {
        return
    }
    var [id, value] = url.parse(ctx.request.url).query.split('=')
    let user = await User.findOne({
        where: {
            'id': value
        }
    })
    ctx.response.type = 'json'
    ctx.response.body = {
        status: 200,
        message: '成功',
        data: user
    }
}

// 登录接口
let login = async (ctx, next) => {
    try {
        let params = {
            ...ctx.request.body
        }
        var password = cryptoPwd(params.password)
        params['password'] = password
        console.log(params)
        //  if (params) {
        //  }
        let user = await User.find({
            where: {
                ...params
            }
        })
        console.log('user' + user)
        if (user !== null) {
            let session = ctx.session
            session.isLogin = true
            session.username = user.account
            session.uid = user.id

            ctx.response.type = 'json'
            ctx.response.body = {
                status: 200,
                message: '成功',
                data: user
            }
        } else {
            let account = await User.find({
                where: {
                    account: ctx.request.body.account
                }
            })
            if (account === null) {
                let user = await User.create({
                    ...params,
                    name: ctx.request.body.account,
                    leftTimes: 10
                })
                if (user !== null) {
                    console.log('created: successfully')
                    let session = ctx.session
                    session.isLogin = true
                    session.username = user.name
                    session.uid = user.id
                    session.password = user.password
                    ctx.response.type = 'json'
                    ctx.response.body = {
                        status: 200,
                        message: '成功',
                        data: user
                    }
                }
            } else {
                throw new Error('没有查找到成员')
            }
        }
    } catch (e) {
        console.log(e)
        ctx.response.type = 'json'
        ctx.response.body = {
            status: 400,
            message: '忘记密码？ 或者换个账号直接登录',
            data: []
        }
    }
}

const checkLogin = async (ctx, next) => {
    if (ctx.session && ctx.session.username && ctx.session.uid) {
        let user = await User.findOne({
            where: {
                id: ctx.session.uid
            }
        })
        user = user.dataValues || {}
        console.log(user)
        ctx.response.type = 'json'
        ctx.response.body = {
            status: 200,
            message: '登录成功！',
            data: user
        }
    } else {
        ctx.response.type = 'json'
        ctx.response.body = {
            status: 10001,
            message: 'session,需要重新登录',
            data: []
        }
    }
}
const logOut = async (ctx, next) => {
    ctx.session = null
    ctx.response.type = 'json'
    ctx.response.body = {
        status: 200,
        message: 'session实效,退出成功！',
        data: []
    }
}
module.exports = {
    User,
    getUserById,
    login,
    checkLogin,
    logOut
}

