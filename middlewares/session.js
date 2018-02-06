'use strict'
const session = require('express-session')
const config = require('../config/config');

let middleware = function(redisStore) {

    let session_config = {
        host: config.redisConfig.host,
        port: config.redisConfig.port,
        opt: config.redisConfig.opt,
        pass: config.redisConfig.opt.auth_pass,
        db: 1
    }
    let redisStoreClient = new redisStore(session_config);
    let setting = {
        key: 'cookie-key',// 设置 cookie 中保存 session id 的字段名称
        secret: 'session.secret',// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
        resave: true,// 强制更新 session
        store: redisStoreClient,  //用redis存储session
        saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
        cookie: {
            maxAge: 2 * 60 * 60// 过期时间2小时，过期后 cookie 中的 session id 自动删除
        }
    }
    return session(setting);
}
module.exports = middleware;