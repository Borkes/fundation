const path = require('path');
const express = require('express');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const _ = require('lodash');
const middle = require('./middlewares')
const logger = require('./lib/logger');
const glob = require("glob");
const app = express();
router = new express.Router();
app.use(router);

global.DB = require('./util/db');
global.REDIS = require('./util/redis');
app.use(cookieParser()); //使用cookie

// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为 ejs
app.set('view engine', 'ejs');
app.set('routes', path.join(__dirname, 'routes'))

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'dist')));

//解析body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded

// session 中间件
app.use(middle.session(redisStore));


glob.sync('routes/*.js').forEach(file => {
    app.use('/', require(path.resolve(file)));
})

//错误传递下来未处理
app.use(function (err, req, res, next) {
    var new_err = new Error('系统繁忙');
    new_err.status = 404;
    console.log(err);
    logger.error(req.url + '\n' + (err || {}).stack);
    return res.send({code: 1001, msg: new_err.message})
})

//监听未捕获错误
process.on('uncatchException', (err) => {
    console.log(err);
    logger.error(`Caught exception: ${err.stack}`);
})

//统一处理async/await中抛出的错误
//不是很好的方式，比起在每个路由总try catch要简洁
process.on('unhandledRejection', (err) => {
    console.log(err);
    logger.error(`Caught exception: ${err.stack}`);
})

//监听8088端口
app.listen(8088, function () {
    logger.info(`server start in port 8088`)
    console.log('server start in port 8088');
});