const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

var DailyRotateFile = require('winston-daily-rotate-file');
const moment = require('moment');
const fse = require('fs-extra');
const logDir = 'log';

const myFormat = printf(log => {
  return `[${moment().format('YYYY-MM-DD HH:mm:ss')}][${log.level.toUpperCase()}][${log.message}]`;
});

const logger = createLogger({
  format: myFormat,
  transports: [
    new (transports.Console)({ level: 'info' }),
    new transports.DailyRotateFile({
    filename: `${logDir}/${moment().format('YYYY')}/${moment().format('MM')}/log`,
    datePattern : 'YYYYMMDD'
  })]
});


module.exports.write = function (level, data) {
  const dir = `${logDir}/${moment().format('YYYY')}/${moment().format('MM')}`;
  fse.ensureDirSync(dir);

  switch(level) {
    case "INFO"  : logger.info(data); break;
    case "WARN"  : logger.warn(data); break;
    case "ERROR" : logger.error(data); break;
  }
};

//error.js에 넣어도 될 것 같음
