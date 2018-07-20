/**
 * Model - Utilities
 */

var moment		= require('moment');
var fs			= require('fs');
var http       = require('http');
// var utils		= require('./util');

// ============================================================================

/**
 * [For defence replay attack]
 *  acceess time range(server time) : +10m ~ -10m
 */
function checkResponseTime(ts)
{
	/**
	 * date format
	 *  .format("YYYY-MM-DD HH:mm:ss")
	 *  .format('x') // unix milisecond
	 */

	var reqts = moment(parseInt(ts));

	var beforets = moment().add(-10, 'm').format('x');
	var afterts = moment().add(10, 'm').format('x');

	if( ( beforets <= reqts ) && (reqts <= afterts) ){
		return true;
	} else {
		return false;
	}
}

/**
 * [minifize description] :  Minimize Query string
 * @param  {[string]} query [full query string]
 * @return {[string]}       [minimize query string]
 */
function minifize(query)
{
	var res = query.replace(/(\t*)/, ' ').replace(/(\s+)/g, ' ').trim();
	return res;
}

/**
 * [GetAuthText description] : authority number to string
 * @param {[int]} auth [0:superadmin, 1:admin, 2:user]
 */
function getAuthText(auth)
{
	var idx = parseInt(auth);
	var res = "";

	switch(idx){
		case 0:
			res = "최고관리자";
			break;
		case 1:
			res = "관리자";
			break;
		case 2:
			res = "사용자";
			break;
	}
	return res;
}

/**
 * [getUserIP description] : request IP
 * @param  {[object]} req [request object]
 * @return {[string]}     [user ip]
 */
function getUserIP(req)
{
	var userIP = req.headers['x-forwarded-for'] ||
 				req.connection.remoteAddress ||
 				req.socket.remoteAddress ||
 				req.connection.socket.remoteAddress;

	// ::ffff 입력시
	if (userIP.length > 15){
		userIP = userIP.slice(7);
	}
	return userIP;
}

// dev-conf
function parseConf(path, charset)
{
	charset = (charset === undefined) ? 'utf8' : charset;

	var lines = fs.readFileSync(path, charset).toString().split(/\r?\n/);
	var config = new Object();

	var matchs;

	lines.forEach(function(line){
	 	// matchs = line.match(/^(?P<key>\w+)\s+(?P<value>.*)/);
	 	console.log(matchs);
	})

	return config;

	// foreach ($lines as $l) {
	    // preg_match("/^(?P<key>\w+)\s+(?P<value>.*)/", $l, $matches);
	//     if (isset($matches['key'])) {
	//         $config[$matches['key']] = $matches['value'];
	//     }
	// }
}

function join()
{
	var args = Array.prototype.slice.call(arguments, 0);
    var res = args.join(' ');

	return res;
}

function checkAfterLogin(req, res, next)
{
	/**
	 * publish-mode
	 */
	if(req.isAuthenticated()) {
		if(req.user){
			res.locals.usercard = {
				id: (req.user) ? req.user.id : 'UNKNOWN',
				name: req.user.name,
				authority: req.user.authority,
				auth: getAuthText(req.user.authority),
				ip: getUserIP(req)
			};
		} else {
			res.locals.usercard = null;
		}
		return next();
	}
	return res.redirect('/login');

	/**
	 * dev-mode
	 */
	// console.log(req.user)
	// if(req.user){
	// 	res.locals.usercard = {
	// 		id: (req.user) ? req.user.id : 'UNKNOWN',
	// 		name: req.user.name,
	// 		authority: req.user.authority,
	// 		auth: utils.getAuthText(req.user.authority),
	// 		ip: utils.getUserIP(req)
	// 	};
	// } else {
	// 	res.locals.usercard = null;
	// }
	// console.log({
	// 		id: (req.user) ? req.user.id : 'UNKNOWN',
	// 		name: req.user.name,
	// 		auth: utils.getAuthText(req.user.authority),
	// 		ip: utils.getUserIP(req)
	// 	});

	// return next();
}

function checkBeforeLogin(req, res, next)
{
	/**
	 * publish-mode
	 */
	if(req.isAuthenticated()) {
		return res.redirect('/dashboards/dashboard');
	}
	return next();
}

ConvertToJson = (s, delimeter) => {

	getProperty = (col, row) => {
		var index = row * columns.length + col;
		var val =  arrProperty[index];

		return val == undefined ? "" : val;
	}

	//console.log(s);
	var result={};

	if (s.indexOf('SUCCESS_') == 0) {
		result['message'] = s;
		return result;
	}

	if (s[0]=="\u0002")
	{
		var len = s.length;

		for (var i=1; i<len; i++)
		{
			if (s[i]=="\u0004") sah = i
			else if (s[i]=="\u0005") std = i
			else if (s[i]=="\u0006") sfd = i
			else if (s[i]=="\u0007") srd = i
		}

		var header_len = std - sah - 1;
		var s1 = s.slice(sah+1, len);
		var header = [];
		header = s1.slice(0, header_len);

		var column_len = sfd - std - 1;
		s1 = s.slice(std+1, len);
		var column = s1.slice(0, column_len);

		var padding_len = srd - sfd - 1;
		s1 = s.slice(sfd+1, sfd + padding_len);

		var arrProperty = [];
		if (padding_len > 0) {
			for (var i=0; i<padding_len-1; i++)	{
				arrProperty.push(s1[i]);
			}
		}

		var value_len = len - srd;
		s1 = s.slice(srd+1, len);
		var value = s1.slice(0, value_len).split('\u0010');

		var columns = [];
		var step = 0;
		var s2 = '';
		for (var i=0; i<column_len; i++) {
			if (column[i] == "\u0010") {
				if (step % 3 == 1) columns.push(s2);
				s2 = '';
				step++;
			} else {
				s2 = s2 + column[i];
			}
		}

		var data = [];
		var row = 0;
		for (var i=0; i<value.length; i++)	{
			if (i % columns.length != 0) continue;
			var t = value.slice(i, i+columns.length);
			if (t.length != columns.length) break;
			var item = new Object();
			for (var j=0; j<t.length; j++) {
				if ((columns[j] == 'raw') ||
						(columns[j] == 'action2') ||
						(columns[j] == 'action3')) {
					item[columns[j]]=getProperty(j, row);
				}	else {
					item[columns[j]]=t[j].trim();
				}
			}
			data.push(item);
			row++;
		}

		if (header.length > 0) {
			result['header'] = header.split("\u0010");
			result['header'].pop();
		}
		result['datas'] = data;

		return result;

		// var objResult = new Object();
		// objResult.col = columns.length;
		// objResult.row = row;
		// objResult.columns = columns;
		// objResult.data = data;

		// //result = JSON.stringify(objResult, null, 4);
		// result = objResult;
	} else {

		if (delimeter==null) return '[Error] Invalid delimeter character.';

		var objArr = [];
		var arrStr = s.split('\n');

		while (arrStr.length > 1)
		{
			var col = Number(arrStr[0].split(',')[0]);
			var row = Number(arrStr[0].split(',')[1]);
			var columns = [];
			var t = arrStr[1].split(delimeter);
			for (var i=0; i<t.length; i++)	columns.push(t[i].toString());

			var data = [];
			for (var i=2; i<2+row; i++)	{
				t = arrStr[i].split(delimeter);
				var item = new Object();
				for (var j=0; j<t.length; j++)	{
					item[columns[j]]=t[j];
				}
				data.push(item);
			}
			arrStr = arrStr.slice(i);

			var objResult = new Object();
			objResult.col = col;
			objResult.row = row;
			objResult.columns = columns;
			objResult.datas = data;

			objArr.push(objResult);
		}

		//result = JSON.stringify(objArr, null, 4);
		result = objArr;
	}

	return result;
}



function getRoot(param, cb) {
  const options = {
      host: param.ip,
      port: param.port,
      path: '/main.a?act=auth&order=ivs_info',
      method: 'GET',
      rejectUnauthorized: false,
      headers: {
          "Accept": "text/html, */*",
          "User-Agent": "MSIE",
          "Connection": "Keep-Alive",
          "Content-Type": "application/x-www-form-urlencoded",
      }
  };
//   console.log(options);
//   console.log('=>' + options.path);
  var _req = http.request(options, (_res) => {
      var body = '';
      _res.on('data', (chunk) => {
          body += chunk;
      });
      _res.on('end', () => { 
		  
			console.log('\n\n********************************************************');
			console.log('  QUERY START | getRoot');
			console.log('--------------------------------------------------------');
			console.log(options);
			console.log('--------------------------------------------------------');
			console.log('path =>' + options.path);     
			console.log('result =>' + body);     
			console.log('--------------------------------------------------------');
			console.log('  QUERY END | getRoot');
			console.log('********************************************************\n');    

          return cb(null, body);
      });
      _res.on('error', (err) => {
          callback(err);
      });
  });
  _req.end();
  _req.on('error', (err) => {
      console.log(err);
  });
}

// ============================================================================

/**
 * Export Module
 */
module.exports = {
	checkResponseTime: checkResponseTime,
	minifize: minifize,
	getAuthText: getAuthText,
	getUserIP: getUserIP,
	parseConf: parseConf,
	join: join,
  checkAfterLogin: checkAfterLogin,
  checkBeforeLogin: checkBeforeLogin,
	ConvertToJson: ConvertToJson,
	getRoot: getRoot
};
