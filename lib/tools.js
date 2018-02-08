const _ = require('lodash');


function createCode(user_id) {
    const source_string = 'E5FCDG3HQA4B1NOPIJ2RSTUV67MWX89KLYZ';
    let num = user_id + 45000;
    let code = '';
    while (num > 0) {
        let mod = num % 35;
        num = (num - mod) / 35;
        console.log(mod)
        code += source_string[mod];
        console.log(code)
    }
    return code;
}


function decode(code) {
    const source_string = 'E5FCDG3HQA4B1NOPIJ2RSTUV67MWX89KLYZ';
    code = code.split('').reverse().join(''); //反转
    num = 0;
    for (let i = 0; i < code.length; i++) {
        num += (source_string.indexOf(code[i]) + 1) * Math.pow(35, i);
    }
    return num;
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