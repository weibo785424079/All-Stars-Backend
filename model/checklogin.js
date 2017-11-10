module.exports =  (ctx, next) => {
    if (ctx.session && ctx.session.username && ctx.session.uid) {
        return true
    } else {
        console.log('session失效')
        ctx.response.type = 'json'
        ctx.response.body = {
            status: 10001,
            message: 'session,需要重新登录',
            data: []
        }
        return false
    }
}