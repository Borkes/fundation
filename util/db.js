const mysql = require('mysql');
const dbconfig = require('../config/config').dbConfig;

//类的方式创建数据库mysql连接
class Mysql {
    constructor(dbconfig) {
        this.pool = null;
        this.Init(dbconfig);
    }
    Init(dbconfig) {
        if (!this.pool) {
            this.pool = mysql.createPool(dbconfig);
        }
    }
    query(sql, variable, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err);
            } else {
                connection.query(sql, variable, (err, data) => {
                    callback(err, data);
                })
                if (connection) {
                    connection.release();
                }
            }
        })
    }
}

module.exports = new Mysql(dbconfig); //返回一个mysql实例

//直接创建mysql连接,返回查询接口
/*const pool = mysql.createPool(dbconfig);

function query(sql, variable, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            if (arguments.length === 2) {
                callback = variable;
            }
            callback(err);
        } else {
            if (arguments.length === 2) {
                callback = variable
                connection.query(sql, (err, results) => {
                    callback(err, results);
                })
            } else {
                connection.query(sql, variable, (err, results) => {
                    callback(err, results);
                })
            }
        }
        if (connection) {
            connection.release();
        }
    })
}

module.exports = query;*/



