const Sequelize = require('sequelize')
const url = require('url')
const config = require('../../../config')
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

var UserInfo = sequelize.define('user_more_info', {
    // id: {
    //     type: Sequelize.INTEGER(11),
    //     primaryKey: true
    // },
    uid: Sequelize.INTEGER,
    nick_name: Sequelize.TEXT,
    team: Sequelize.TEXT,
    pic: Sequelize.TEXT,
    email: Sequelize.TEXT,
    phone: Sequelize.TEXT,
    desc: Sequelize.TEXT,
    birthday: Sequelize.TEXT
}, {
        timestamps: false
    });

    async function updateInfo(ctx) {
       let params = {...ctx.request.body}
       const exist = await UserInfo.findOne({
           where :{
             uid: params.uid
           }
       })
       if (exist === null) {
        let user = await UserInfo.create(
            {
             ...params
            })
       }else {
         await UserInfo.update(
            {
                ...params
               },
               {
                where: {
                   uid : params.uid
            }})
       }
       ctx.response.type = 'json'        
       ctx.response.body = {
           data: 'update successfully',
           message: '更新成功！',
           status: 200
       }        
    }
    async function getUserInfo(ctx) {
       let uid = ctx.request.url.split('=')[1]
       const user = await UserInfo.findOne({
           where :{
             uid: uid
           }
       })
       if (user !== null) {
        ctx.response.type = 'json'        
        ctx.response.body = {
            data: user,
            message: 'query successfully',
            status: 200
        }        
       }else {
        ctx.response.type = 'json'        
        ctx.response.body = {
            data: {},
            message: '委查找到用户',
            status: 201
        }       
       }
      
    }

    module.exports = {
        updateInfo,
        getUserInfo
    }