//登录相关中间件
'use strict'
module.exports = {
    checkLogin: function () {
        return (req, res, next) => {
            if (!req.session && !req.session.user) {
                return res.status(400)
            }
            next()
        }
    },
    
}