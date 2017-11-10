// var Redis = require('ioredis');  
// var redis = new Redis(6379, '127.0.0.1');  
  
// redis.set('hello', 'node-redis');  
// redis.get('hello', function (err, result) {  
//   console.log(result);  
// });  
var crypto = require('crypto')
// appKey timestamp nonce M4ZUBZzc1W  96702d02f9f4f 1509523130408
const app_secret = '00dc0022c100a6d778b30089f55927d6'
const appKey = 'M4ZUBZzc1W'
const timestamp = Date.now()
const nonce = Math.random().toString(16).slice(2)
let params = {
    appKey:'M4ZUBZzc1W',
    nonce: Math.random().toString(16).slice(2),
    timestamp: Date.now()    
}
console.log(params.timestamp)
var args = JSON.stringify(params);
console.log(args)

var sign = crypto.createHmac('sha1', app_secret).update(args).digest().toString('base64')
console.log(sign)