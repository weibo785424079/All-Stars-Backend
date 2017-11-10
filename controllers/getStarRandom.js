const { User } = require('./user')
const { StarInfo } = require('./star')
// const  Rx =  require('rxjs-es') 
const Probability = require('./probability')
const Sequelize = require('sequelize')
const config = require('../config')
const checklogin = require('./../model/checklogin')
const { CardsMarketting } = require('../model/cards_marking')

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

const getStarRandom = async (ctx, next) => {
    if (!checklogin(ctx)) {
        return
    }
    const uid = ctx.request.body.id
    var user = await User.findOne({
        where: {
            id: uid
        }
    })
    user = user.dataValues || {}
    let ltimes = user.leftTimes
    if (user.leftTimes > 0) {
        await User.update({
            leftTimes: --ltimes
        },{
            where: {
                id : user.id
            }
        })
        if (Math.random() < 0.7) {
            ctx.response.type = 'json'
            ctx.response.body = {
                status: 100,
                message: '非常可惜，没有抽中，继续努力吧！！',
                data: {}
            }
            return
        } else {
            var stars = await StarInfo.findAll({})
            stars = stars.map((ele, index) => {
                ele = ele.dataValues
                return ele
            })
            var one = Probability.choseOne(stars)
             await CardsMarketting.create({
                uid,
                cid: one.id,
                create_time: Date.now()
            })
            ctx.response.type = 'json'
            ctx.response.body = {
                status: 200,
                message: '成功',
                data: one
            }

        }
    } else if (user.leftTimes <= 0) {
        ctx.response.type = 'json'
        ctx.response.body = {
            status: 1000,
            message: '没有抽奖次数了，明天再来吧！！',
            data: {}
        }
    }
}

module.exports = {
    getStarRandom
}



