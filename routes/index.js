
const userAct = require('../models/user');
const produceAct = require('../models/product');
const tools = require('../lib/tools');
const middlewares = require('../middlewares')

const checkCode = async function (req, res, phone, code) {
    const key = 'sms_last_send_cont:#' + phone;
    const str = await REDIS.getAsync(key);
    if (str) {
        let [rdsCode, rdsPhone, errorCount, time] = str.split('|');

        if (time && new Date().getTime() - time > 600 * 1000) {
            res.status(400).json('短信验证码已过期');
            return false;
        }

        if (rdsPhone && rdsPhone != phone) {
            res.status(400).json('手机号和接收号码不一致');
            return false;
        }

        if (rdsCode && rdsCode != code) {
            errorCount++;
            await (REDIS.setAsync(key, rdsCode + '|' + rdsPhone + '|' + errorCount + '|' + time));
            res.status(400).json('验证码错误');
            return false;
        }

        await (REDIS.setAsync(key, '-1|' + rdsPhone + '|' + errorCount + '|' + time));
        return true;
    } else {
        res.status(400).json('尚未获取短信验证码');
        return false;
    }
};

//检查输入手机号是否存在
router.get('/check-phone', async (req, res, next) => {
    let phone = req.query.phone;
    let type = +req.query.type || 0; //0个人 1机构
    let result;
    result = await userAct.existAccount(phone, type);
    return res.send({ code: 0, msg: result });
})

//退出登录
router.post('/login-out', async (req, res, next) => {
    req.session.user = null;
    return res.send({ code: 0, msg: 'ok' });
})

//登录
router.post('/login', async (req, res, next) => {
    let phone = req.body.phone;  //用户手机号
    let password = req.body.password; //用户密码，前端加密
    let type = +req.body.type || 0; //类型 0个人 1机构
    if (!phone || !password) {
        return res.send({ code: 1, msg: '请输入帐号和密码' });
    }
    phone = phone.trim();
    password = password.trim();

    let check = await userAct.checkLogin(phone, password, type);
    if (check && check.length === 1) {
        let user = {};
        if (type === 0) {
            user = {
                type,
                id: check[0].client_ID,
                telphone: check[0].telphone,
                pinyin_name: check[0].pinyin_name,
                chinese_name: check[0].chinese_name,
            }
        } else {
            user = {
                type,
                id: check[0].sale_ID,
                telphone: check[0].telphone,
                pinyin_name: check[0].pinyin_name,
                chinese_name: check[0].chinese_name,
            }
        }
        req.session.user = user;
        return res.send({ code: 0, msg: user })
    } else {
        return res.send({ code: 2, msg: '账号或密码错误' })
    }
})

//注册
router.post('/register', async (req, res) => {
    let phone = req.body.phone;
    let password = req.body.password; //加密
    let code = req.body.code;
    let type = +req.body.type || 0; //0个人 1机构
    let invite_code = req.body.invite_code; //邀请码
    if (!phone || !password || !code) {
        return res.send({ code: 2, message: '没有必要参数' })
    }
    //检查验证码
    const result = await checkCode(req, res, phone, code);

    if (result) {
        let result = await userAct.existAccount(phone, type);
        if (result) {
            return res.send({ code: 1, msg: '已经注册过' });
        }
        await userAct.register(phone, password, type, invite_code);
        return res.send({ code: 0, msg: 'ok' });
    }
})

//产品列表
router.get('/products-list', middlewares.check(), async (req, res) => {
    const class_id = req.query.class_id; //类型id；
    const sub_class_id = req.query.sub_class_id; //子类id
    if (!class_id) {
        return res.send({ code: 2, message: '没有必要参数' });
    }
    let data;
    if (sub_class_id) {
        data = await produceAct.getProduct(class_id, sub_class_id);
    } else {
        data = await produceAct.getProductById(class_id);
    }
    res.send({ code: 0, message: data })

})

//发送短信
router.get('/send-code', async (req, res) => {
    const args = req.query;
    const phone = args.phone; //手机号
    const type = +args.type || 0; //类型0个人 1机构
    const code_type = args.code_type; //发送短息验证码类型

    if (!phone || !code_type) {
        return res.send({ code: 1, msg: 'phone不能为空' });
    }

    //检测手机号：格式
    const reg = /^1\d{10}$/;
    if (!reg.test(phone)) {
        return res.send({ code: 1, msg: '手机号码格式错误' });
    }

    //是否已注册
    const phoneUsed = await userAct.existAccount(phone, type);
    if (phoneUsed) {
        return res.send({ code: 1, msg: '手机号码已经注册' });
    }

    //根据sms_last_send_cont判断上一次发送时间
    const key = 'sms_last_send_cont:#' + phone;

    let str = await REDIS.getAsync(key);
    if (str) {
        let [code, tel, errorCount, time] = str.split('|');
        if (time && new Date().getTime() - time < 60 * 1000) {
            return res.send({ code: 1, msg: '短信验证码已发送' });
        }
    }

    //生成6位数字验证码
    const rdmCode = tools.getRandomCode(6);
    let content = '';
    switch (code_type) {
        case 1:
            content = '您注册账户的验证码是：' + rdmCode + '，感谢您的支持！';
            break;
        case 2:
            content = '您找回密码的验证码是：' + rdmCode + '';
            break;
    }

    const result = await tools.sendAsync({ phone: phone, content: content })
    if (result < 0) {
        logger.error(`[${phone}]短信发送失败，错误码：${result}`);
        return res.send({ code: 1, msg: '发送失败' });
    }

    //记录验证码到redis，1天过期时间
    await (rds.setexAsync(key, 86400, rdmCode + '|' + phone + '|0|' + new Date().getTime()));
    str = await (rds.getAsync(key));

    return res.send({ code: 0, msg: 'ok' });
})
