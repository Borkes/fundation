//日志相关中间件
'use strict'
const logger = require('../lib/logger');

module.exports = {
    logUrl: function () {
        return (req, res, next) => {
            const time = new Date().toLocaleString();
            console.log(time + " " + req.method + " " + req.url);
            logger.info(req.method + " " + req.url);
            next()
        }
    },
    
}