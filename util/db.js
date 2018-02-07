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
                if (!callback) {
                    callback = variable
                    connection.query(sql, (err, results) => {
                        callback(err, results);
                    })
                } else {
                    connection.query(sql, variable, (err, data) => {
                        callback(err, data);
                    })
                }
                if (connection) {
                    connection.release();
                }
            }
        })
    }
}

module.exports = new Mysql(dbconfig); //返回一个mysql实例



