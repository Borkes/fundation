const _ = require('lodash');


//通过id获取唯一邀请码
function createCode(id) {
    const source_string = 'E5FCDG3HQA4B1NOPIJ2RSTUV67MWX89KLYZ';
    let num = id + 45000;
    let code = '';
    while(num > 0) {
        let mod = num % 35;
        num = (num - mod) / 35;
        code += source_string[mod];
    }
    return code;
}

//通过邀请码解码成id
function decode(code) {
    const source_string = 'E5FCDG3HQA4B1NOPIJ2RSTUV67MWX89KLYZ';
    let num = 0;
    for (let i = 0; i < code.length; i++) {
        num += source_string.indexOf(code[i]) * Math.pow(35, i);
    }
    return num - 45000;
}


/*生成随机数字串
* len: 长度
*/
function getRandomCode(len) {
    const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let result = '';

    for (var i = 0; i < len; i++) {
        const idx = Math.floor(Math.random() * 10);
        result += arr[idx];
    }

    return result;
}

//发送短息验证码
function sendAsync(phone, content) {

}

module.exports = {
    createCode,
    decode,
    getRandomCode,
    sendAsync,
}