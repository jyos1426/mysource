var fs = require('fs');

module.exports.append_string = function(){
	var str = '';
	for(var i =0; i < arguments.length; i++){
		str += arguments[i];
	}
	return str;
}

module.exports.getFormatDate = function(date){
	if(date == undefined)
		var date = new Date();
	else
		this.date = date;

	var year = date.getFullYear();//yyyy
	var month = (1 + date.getMonth());//M
	var day = date.getDate();//d
	var hour = date.getHours();
	var minit = date.getMinutes();
	var sec = date.getSeconds();

	var timeInfo = new Object();

	month = month >= 10 ? month : '0' + month;// month 두자리로 저장
	day = day >= 10 ? day : '0' + day;//day 두자리로 저장

	timeInfo.type1 = year + '' + month + '' + day;
	timeInfo.type2 = year + '/' + month + '/' + day +' ' +hour+':'+minit+':'+sec;

	return timeInfo;
}

module.exports.logoutUser = function(req, res){
    if(!req.user){
        req.logout();
        req.session.save(function(){
            res.send({redirect:'/login'});
        });
        return true;
    }
}

module.exports.makeLog = function(serial, req, timeInfo){

	var ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var log = "\n=============================================================\n";
	log += '[' + timeInfo.type2 + '] : ' + req.headers.referer + "\n";
	log += '[baseUrl] : ' + req.baseUrl + "\n";
	log += '[originalUrl] : ' + req.originalUrl + "\n";
	log += '[ID] : ' + req.user.id + "\n";
	log += '[IP] : ' + ip_address + "\n";
	log += '[Body] : ' + JSON.stringify(req.body) + "\n";
	log += '[serial]  : ' + serial + "\n";

	return log;
}

module.exports.writeLog = function(path, log){
	fs.appendFile(path, log, 'utf8', function(err){
        if(err){
            console.log(err);
        }
        console.log('wirte log : ' + path);
    });
}
