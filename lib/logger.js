const bunyan = require('bunyan');

let logPath;
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
	logPath = '/var/log/texas/clog.txt'; //clog.txt应用端  log.txt游戏 日志
} else {
	logPath = 'log/clog.txt';
}

const bunyanLog = bunyan.createLogger({
	name: 'fundation',
	level: 'info',
	streams: [{
		type: 'rotating-file',
		path: logPath,
		period: '1d', // daily rotation
		count: 10 //应用端日志记录10天
	}]
});

const logger = {
	info: (msg) => {
		const time = new Date().toLocaleString();
		const logData = { time };
		bunyanLog.info(logData, msg);
	},
	error: (msg) => {
		const time = new Date().toLocaleString();
		const logData = { time };
		bunyanLog.error(logData, msg);
	}
};

// 导出全局
global.logger = logger;

module.exports = logger;
