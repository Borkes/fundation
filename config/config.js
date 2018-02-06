'use strict'
//redis 配置
const localhostRedisConfig = {
    host: '127.0.0.1',
    port: 6379,
    opt: {
        auth_pass: 123456
    }
}
const developmentRedisConfig = {}
const productionRedisConfig = {}

//mysql数据库配置
const localhostDbConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'myblog',
    connectTimeout: 5000,
    connectionLimit: 5,
    waitForConnctions: true
}
const developmentDbConfig = {}
const productionDbConfig = {}

const config = {};
if (process.env.NODE_ENV === 'production') {
    config.redisConfig = productionRedisConfig;
    config.dbConfig = productionDbConfig;
} else if (process.env.NODE_ENV === 'development') {
    config.redisConfig = developmentRedisConfig;
    config.dbConfig = developmentDbConfig;
} else { //本地配置
    config.redisConfig = localhostRedisConfig;
    config.dbConfig = localhostDbConfig;
}

module.exports = config;