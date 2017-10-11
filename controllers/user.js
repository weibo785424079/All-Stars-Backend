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
    createTime:Sequelize.STRING(11)
}, {
        timestamps: false
    });


// (async function(){
//     var person = await User.create({
//         id:2,
//         name:'six',
//         level:2,
//         status:1,
//         org:'中国',
//         password:'weibo0719'
//     }).then(function(){
//         console.log('created: '+JSON.stringify(person))       
//     }).catch(e=>{
//             console.log(e)
//     })
// })()



//获取status 1 的用户
 let getStatus1 = async (ctx,next) => {
     try {
         var [id,value] = url.parse(ctx.request.url).query.split('=')
         let users = await User.findAll({
             where: {
                 id : value
             }
         })
         users.forEach(function(element) {
            element.org = decodeURIComponent(element.org)   
         });
         ctx.response.type = 'json'
         ctx.response.body = {
            status:200,
            message:'成功',
            data:users
        }
     }catch(e) {
         console.log(e)
         ctx.response.type = 'json'
         ctx.response.body = {
             status:400,
             message:err || '获取数据失败',
             data:[]
         }
     }
 }
 // 登录接口
 let login = async (ctx,next) => {
     try {
         let params = url.parse(ctx.request.url).query || ''
         console.log(ctx.request.body)
        //  if (params) {
        //  }
         let user = await User.find({
             where: {
                ...ctx.request.body
             }
         })
         console.log('user'+ user)
         if (user!==null) {
            ctx.response.type = 'json'
            ctx.response.body = {
               status:200,
               message:'成功',
               data:user
           }
         }else {
             throw new Error('没有查找到成员')
         }
     }catch(e) {
         console.log(e)
         ctx.response.type = 'json'
         ctx.response.body = {
             status:400,
             message:'获取数据失败',
             data:[]
         }
     }
 }
module.exports = {
    getStatus1,
    login
}