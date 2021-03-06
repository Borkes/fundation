const redis = require('redis');
const bluebird = require('bluebird');
//redis支持同步
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const conf = require('../config/config.js');
redis.createClient(conf.redisConfig.port, conf.redisConfig.host, {
    auth_pass: conf.redisConfig.opt.passwd, password: conf.redisConfig.opt.passwd
});

module.exports = redis;