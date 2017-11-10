const Sequelize = require('sequelize')
const url = require('url')
const config = require('../config')
const checklogin = require('./../model/checklogin')
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

var StarNews = sequelize.define('starnew', {
    // id: {
    //     type: Sequelize.INTEGER(11),
    //     primaryKey: true
    // },
    title: Sequelize.TEXT,
    imgUrl: Sequelize.TEXT,
    detail: Sequelize.TEXT,
    date: Sequelize.DATE,
}, {
        timestamps: false
    });
var StarInfo = sequelize.define('starinfo', {
    // id: {
    //     type: Sequelize.INTEGER(11),
    //     primaryKey: true
    // },
    name: Sequelize.TEXT,
    nick_name: Sequelize.TEXT,
    school: Sequelize.TEXT,
    height: Sequelize.INTEGER(11),
    weight: Sequelize.INTEGER(11),
    position: Sequelize.TEXT,
    team_name: Sequelize.TEXT,
    country: Sequelize.TEXT,
    birth_day: Sequelize.TEXT,
    desc: Sequelize.TEXT,
    desc_detail: Sequelize.TEXT,
    pic: Sequelize.TEXT,
    grade: Sequelize.INTEGER,    
    rating: Sequelize.INTEGER
}, {
        timestamps: false
    });
// 获取全部球星趣闻
let getAllNews = async (ctx, next) => {
    // try {
        // let params = url.parse(ctx.request.url).query || ''
        // console.log(ctx.request.body)
        //  if (params) {
        //  }
        console.log(ctx.session , ctx.session.username , ctx.session.uid)
        let news = await StarNews.findAll({
            // where: {
                // ...ctx.request.body
                // id :3
            // }
        })
        if (news !== null) {
            ctx.response.type = 'json'
            ctx.response.body = {
                status: 200,
                message: '成功',
                data: news
            }
            } else {
                throw new Error('没有查找消息')
            }
    }
// 获取球星信息
let getStarInfo = async (ctx, next) => {
        let info = await StarInfo.findAll({
            where: {
                id : [1,2,3]
            }
        })
        if (info !== null) {
            ctx.response.type = 'json'
            ctx.response.body = {
                status: 200,
                message: '成功',
                data: info
            }
            } else {
                throw new Error('没有查找消息')
            }
    }
// 获取用户全部球星
let getAllStars = async (ctx, next) => {
        const list = ctx.request.body
        if (!checklogin(ctx)) {
            return
        }
        let stars = await StarInfo.findAll({
            where: {
                id:list
            }
        })
            ctx.response.type = 'json'
            ctx.response.body = {
                status: 200,
                message: '成功',
                data: stars
            }
    }
let createStar = async (ctx, next) => {
        const list = ctx.request.body
        let stars = await StarInfo.create({
           ...list
        })
            ctx.response.type = 'json'
            ctx.response.body = {
                status: 200,
                message: '创建球星卡成功！',
                data: {}
            }
    }

module.exports = {
    StarInfo,
    getAllNews,
    getStarInfo,
    getAllStars,
    createStar
}