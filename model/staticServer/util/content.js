const path = require('path')
const fs = require('fs')
const file = require('./file')

// 封装读取目录内容的方法
const dir = require('./dir')

// 封装读取内容方法


/**
 * 获取静态资源内容
 * @param 
 */

 async function content (ctx, funllStaticPath) {
   // 封装请求资源的绝对路径
   let reqPath = path.join(funllStaticPath, ctx.url)  
   // 判断请求路径是否为存在的目录或者文件
   let exist = fs.existsSync(reqPath)
   
   // 返回请求内容、默认为空
   let content = ''

   if (!exist) {
     // 如果请求不存在，返回404
     content = '404 NOT FOUND!'
   } else {
     // 判断访问地址是文件夹还是文件
     let stat = fs.statSync(reqPath)  
     if (stat.isDirectory()) {
       // 如果是目录、则先读取目录内容
       content = dir(ctx.url, reqPath) 
     } else {
       // 如果请求是文件、则读取文件内容
       content = await file(reqPath)  
     }
   }
   return content
 }

 module.exports = content