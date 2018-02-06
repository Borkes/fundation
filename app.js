const path = require('path');
const fs = require('fs')
const express = require('express');
const logger = require('./lib/logger');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const middle = require('./middlewares')
const app = express();

global.DB = require('./util/db');

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

//路由前的处理
app.use('/', (req, res, next) => {

})

// 自动路由
const routers = app.get('routes');
function runRouter(root, routers) {
    fs.readdirSync(routers).forEach(function (fileName) {
        let filePath = routers + '/' + fileName;
        let rname = fileName.substr(0, fileName.lastIndexOf("."));
        //console.log(1,rname,2, fileName,3, filePath)
        if (!fs.lstatSync(filePath).isDirectory()) {
            if (rname === 'index') {
                app.use(root + '/', require(filePath));
            }
            app.use(root + '/' + rname, require(filePath));
        } else {
            let path = root + '/' + fileName;
            runRouter(path, filePath);
        }
    })
}
runRouter('', routers);

//错误传递下来未处理
app.use(function (err, req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    logger.error(req.url + '\n' + err.stack);
    return res.send(err.message)
})

//监听未捕获错误
process.on('uncatchException', (err) => {
    console.log(err);
    logger.error(`Caught exception: ${err.stack}`);
})

//监听8088端口
app.listen(8088, function () {
  console.log('server start in port 80888');
});
