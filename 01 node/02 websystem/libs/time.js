const moment = require('moment');

exports.getCurrentUTCDate = () => {
	return moment().format("YYYYMMDDHHmmss");	
}; 

exports.unix = () => {
	return moment().unix();
}

exports.incMinute = (dateStr, numberOfMinutes) => {	
	return moment.utc([dateStr.slice(0,4),
							Number(dateStr.slice(4,6))-1,
							dateStr.slice(6,8),
							dateStr.slice(8,10),
							dateStr.slice(10,12),
							dateStr.slice(12,14)])
				.add(numberOfMinutes, 'm')
				.format("YYYYMMDDHHmmss");
}

exports.toFiveMinuteUnit = (dateStr) => {	
	var m = Number(dateStr.slice(10,12));	
	m = parseInt(m / 5) * 5;	
	var m2 = m < 10 ? "0" + String(m) : String(m);
	return dateStr.slice(0, 10) + m2 + "00";
}

exports.isToday = (dateStr) => {
	return dateStr.slice(0, 8) == moment().format("YYYYMMDD");
}

exports.formatDateStr = (v, format) => {
	
	if (v.length != 14) return v;
	if (typeof v != 'string') return v;
	if (!format) format = 'yyyy/mm/dd hh:nn:ss';

	var res = format;
	var year, month, day, hour, min, sec;
	year = v.slice(0,4);
	month = v.slice(4,6);
	day = v.slice(6,8);
	hour = v.slice(8,10);
	min = v.slice(10,12);
	sec = v.slice(12,14);

	res = res.replace('yyyy', year);
	res = res.replace('mm', month);
	res = res.replace('dd', day);
	res = res.replace('hh', hour);
	res = res.replace('nn', min);
	res = res.replace('ss', sec);

	return res;
}

exports.toDateStr = (year, month, day, hour, minute, second) => {	
	if (String(month).length == 1) month = '0' + month;
	if (String(day).length == 1) day = '0' + day;
	if (String(hour).length == 1) hour = '0' + hour;
	if (String(minute).length == 1) minute = '0' + minute;
	if (String(second).length == 1) second = '0' + second;
	
  return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
}