'use strict'
const Bluebird = require('bluebird');
//const db = Bluebird.promisify(DB);
const db = Bluebird.promisify(DB.query.bind(DB))

/**
 * 检查对应用户是否存在
 * @param {string} name 
 */
function existAccount(name) {
    let sqlStr = 'SELECT 1 FROM register WHERE name=?';
    return new Bluebird(function (resolve, reject) {
        db(sqlStr, [name]).then((err, result) => {
            resolve(!!result && result.length > 0);
        })
    })
}

/**
 * 注册用户
 * @param {object} info 
 */
function register(info) {
    let variable = [info.name, info.password, info.gender || '', info.bio || '', info.avatar || ''];
    let sqlStr = 'INSERT INTO register (name, password, gender, bio, avatar) VALUES(?,?,?,?,?)';
    return db(sqlStr, variable);
}

/**
 * 登录
 * @param {string} name 
 * @param {string} password 
 */
function login(name) {
    let sqlStr = 'SELECT password FROM register WHERE name = ?';
    return db(sqlStr, [name]);
}

module.exports = {
    register,
    existAccount,
    login,
}