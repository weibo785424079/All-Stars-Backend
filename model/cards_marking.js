const Sequelize = require('sequelize')
const url = require('url')
const config = require('../config')
const { User } = require('../controllers/user')

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

var CardsMarketting = sequelize.define('cards_marketting', {
    // id: {
    //     type: Sequelize.INTEGER(11),
    //     primaryKey: true
    // },
    uid: Sequelize.INTEGER,
    cid: Sequelize.INTEGER,
    create_time: Sequelize.DATE,
    update_time: Sequelize.DATE,
    status: Sequelize.INTEGER
}, {
        timestamps: false
    })

   const  getUserAllCards = async (ctx , next) => {
        // const uid  = ctx.request.body.id
        const uid  = ctx.request.query.id
        console.log('uid',uid)
        let cards = await CardsMarketting.findAll({
            where : {
                uid
            }
        })
        ctx.response.type = 'json'
        ctx.response.body = {
            status: 200,
            message: '成功',
            data: cards
        }
   }
   const  insertCardById = async (ctx , next) => {
        // const uid  = ctx.request.body.id
        const uid  = ctx.request.query.uid
        const cid  = ctx.request.query.cid
        console.log('uid',uid,cid)
        let cards = await CardsMarketting.create({
            ...ctx.request.body,
            create_time: Date.now()
        })
        ctx.response.type = 'json'
        ctx.response.body = {
            status: 200,
            message: '成功',
            data: []
        }
   }

    module.exports = {
        getUserAllCards,
        insertCardById,
        CardsMarketting
    }




