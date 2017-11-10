
const path = require('path')
const content = require('./util/content')
const mimes = require('./util/mimes')
const fs = require('fs')

const staticPath = '../../assets/curry'

// 解析资源类型
function ParseMime (url) {
  let extName = path.extname(url)
  extName = extName ? extName.slice(1) : 'unknown'
  return mimes[extName]
}

async function staticServer(ctx) {
    // 静态资源目录在本地的绝对路径 
    let fullStaticPath = path.join(__dirname, staticPath)
    // 获取静态资源内容，有可能是文件内容、目录、或者404
    let _content = await content(ctx, fullStaticPath)
    // 解析请求内容的类型
    let _mime = ParseMime(ctx.url)
    // 如果有对应的文件类型、就配置上下文的类型
    if (_mime) {
        ctx.type = _mime
    }
    if (_mime && _mime.indexOf('image/') >= 0) {
      // 如果是图片、则用node原生res、输出二进制数据
      // ctx.res.writeHead(200)
      // ctx.res.write(_content, 'binary')
      ctx.response.type = 'image/jpeg'
      ctx.response.body = await fs.createReadStream(fullStaticPath+ctx.request.url)
      // ctx.res.end()
    } else {
      ctx.body = _content
    }
} 

module.exports = staticServer