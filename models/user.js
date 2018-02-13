'use strict'
const Bluebird = require('bluebird');
//const db = Bluebird.promisify(DB);
const db = Bluebird.promisify(DB.query.bind(DB))

/**
 * 检查对应用户是否存在
 * @param {string} phone 
 */
function existAccount(phone, type) {
    let sqlStr = '';
    if (type === 0) {
        sqlStr = 'SELECT 1 FROM fw_clients WHERE telphone=?';
    } else {
        sqlStr = 'SELECT 1 FROM fw_channel_consultant WHERE telphone=?';
    }
    return new Promise((resolve, reject) => {
        db(sqlStr, [phone]).then((err, result) => {
            resolve(!!result && result.length > 0);
        })
    })
}

/**
 * 检查用户是否登录成功
 * @param {string} phone 
 * @param {string} password 
 */
function checkLogin(phone, password, type) {
    let sqlStr = '';
    if (type === 0) {
        sqlStr = 'SELECT client_ID telphone pinyin_name chinese_name ID_No FROM fw_clients WHERE telphone=? AND password=?'
    } else {
        sqlStr = 'SELECT sale_ID telphone pinyin_name chinese_name FROM fw_channel_consultant WHERE telphone=? AND password=?'
    }
    return db(sqlStr, [phone, password]);
}

/**
 * 注册用户
 * @param {object} info 
 */
function register(phone, password, type, invite_code = null) {
    let sqlStr = '';
    if (type === 0) {
        sqlStr = 'INSERT INTO fw_clients (phone, password, invitedBy_saleID) VALUES(?,?,?)';
    } else {
        sqlStr = 'INSERT INTO fw_consultant (phone, password, invitedBy_clientID) VALUES(?,?,?)';
    }
    let variable = [phone, password, invite_code];
    return db(sqlStr, variable);
}





module.exports = {
    register,
    existAccount,
    checkLogin,
}