const fs = require('fs')
const path = require('path')

let oneImg = async (ctx,next) => {
    ctx.cacheControl = {
        maxAge: 6000000
    }
    let id = ctx.params.id;
    ctx.response.type = 'image/jpeg'
    ctx.response.body = fs.createReadStream(path.join(__dirname,'../assets','stars',id));
}

module.exports =  {
    oneImg
}