
const userAct = require('../models/user');

//自动路由
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.redirect('/login');
})

//登录
router.post('/login', (req, res) => {
    let name = req.body.name.trim();
    let password = req.body.password.trim();
    if (!name || !password) {
        return res.send({ code: 1, message: '请输入帐号和密码' });
    }

    userAct.login(name).then((result) => {
        if (result.length === 0) {
            return res.send({ code: 0, message: '帐号未注册' });
        } else if (result[0].password === password) {
            return res.send({ code: 0, message: '登录成功' });
        } else {
            return res.send({ code: 1, message: '密码错误' });
        }
    }).catch((err) => {
        console.error('login error:', err);
        res.send({ code: 1, message: '登录失败' });
    })

})

//注册,应该还有其他考虑,注册帐号频率,ip频率
router.post('/register',  (req, res) => {
    let name = req.body.name;
    let password = req.body.password; //加密
    if (!name || !password) {
        return res.send({ code: 2, message: '没有必要参数' })
    }
    let info = { name, password };
    userAct.existAccount(name).then((exist) => {
        if (exist) {
            return 1;
        } else {
            return userAct.register(info);
        }
    }).then((data) => {
        if (data === 1) {
            return res.send({ code: 0, message: '帐号已经被注册' });
        } else {
            return res.send({ code: 0, message: '注册成功' });
        }
    }).catch((err) => {
        console.error('register error:', err);
        return res.send({ code: 1, message: '注册失败' });
    })
})

router.get('/products-list', (req, res) => {

})

module.exports = router;
