//登录相关中间件
'use strict'
module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        if (!req.session.user) {
            return res.status(400)
        }
        next()
    },

}