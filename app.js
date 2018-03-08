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
global.DB = require('./util/db');
global.REDIS = require('./util/redis');
const app = express();
const router = new express.Router();
const methods = ['get', 'post', 'put', 'delete'];
router.use(app);
for (let method of methods) {
    router[method] = function (...data) {
        if (method === 'get' && data.length === 1) return app.set(data[0]);
        const params = [];
        for (let item of data) {
            if (Object.prototype.toString.call(item) !== '[object AsyncFunction]') {
                params.push(item);
                continue;
            }
            const handle = function (...data) {
                const [req, res, next] = data;
                item(req, res, next).then(next).catch(next);
            };
            params.push(handle);
        }
        app[method](...params);
        return router
    };
}
global.router = router;

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

glob.sync('routes/*.js').forEach((file) => {
    try {
        require(path.resolve(file))
    } catch (e) {
        logger.error(e.stack);
        console.log(e)
    }
})

//错误传递下来未处理
app.use(function (err, req, res, next) {
    var new_err = new Error('系统繁忙');
    new_err.status = 404;
    console.log(err);
    logger.error(req.url + '\n' + (err || {}).stack);
    return res.send({ code: 1001, msg: new_err.message })
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
