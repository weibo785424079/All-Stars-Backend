const multer = require('koa-multer')
const path = require('path')
// 配置
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../','public','uploads') )
    },
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split('.')
        cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
    }
})

var upload = multer({ storage })

module.exports = upload