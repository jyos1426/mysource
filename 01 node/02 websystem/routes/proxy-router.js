//프록시 라우팅 파일
//요청을 비롯한 콘솔에서 요청하는 모든파일들을 라우팅한다.
//세션체크를 하기전에 수행한다.

var router 			= require('express').Router();
var config = require('../config');
var sensor = require('../libs/sensor')
var path = require('path');
var fs = require('fs');
var https = require('https');
var http = require('http');
var e = require('../libs/error');

router.all('*', (req, res, next) => {
	var url = req.url;

	if (url.toLowerCase().indexOf('main.a?') >= 0) {		
			var data = '';
			req.on('data', (chunk) => { data += chunk });			
			req.on('error', (err) => { console.log(err.stack); });
			req.on('end', () => {	
		
				const options = {
					host: sensor.location.host,
					port: sensor.location.s_port,
					path: url,
					method: req.method
				};			
				if (sensor.location.ssl) options['rejectUnauthorized'] = false;
				//console.log(options)					;
				//GET Method인데 Post 통신을 하는 인터페이스가 존재하여 해당처리 필요.

				if (data != '') { 					
					options.method = 'POST'; 														
				}
				//콘솔에서 넘겨주는 헤더를 그대로 사용.			
			  //헤더를 똑같이 만들지 않으면 통신상 문제가 발생함.
				options.headers = req.headers;
								
				if (sensor.location.ssl) {
					var _req = https.request(options, (_res) => {			
						var body = '';
						_res.on('data', (chunk) => { body += chunk; });
						_res.on('end', () => { res.end(body); });					
						_res.on('error', (err) => { res.sendStatus(500); });
					});				
					_req.on('error', (err) => { 					
						//이지점에서 에러가 아주가끔 발생함.						
						e.printError('[proxy-router.js] https.request on error. ', err);										
						res.sendStatus(500); 					
					});
					if (options.method == 'POST') {	_req.write(data);	}				
					_req.end();
				} else {
					var _req = http.request(options, (_res) => {			
						var body = '';
						_res.on('data', (chunk) => { body += chunk; });
						_res.on('end', () => { res.end(body); });					
						_res.on('error', (err) => { res.sendStatus(500); });
					});				
					_req.on('error', (err) => { 					
						//이지점에서 에러가 아주가끔 발생함.						
						e.printError('[proxy-router.js] https.request on error. ', err);										
						res.sendStatus(500); 					
					});
					if (options.method == 'POST') {	_req.write(data);	}				
					_req.end();
				}
			});		
	} else if (url == '/launcher') {		
		var filePath = path.resolve(config.path.sniper + '/activex/login/index.html');					
		fs.readFile(filePath, (err, content) => {
			res.writeHead(200, {'Content-Type':'text/html'});
			res.end(content);
		});
	} else if (url.indexOf('activex/') >= 0 || url.indexOf('help/') >= 0) {			
		var filePath = path.resolve(config.path.sniper + '/' + req.url);		
		fs.exists(filePath, (exists) => {
			if (exists) {
				fs.readFile(filePath, (err, content) => {
					var ext = path.extname(filePath);					
					if (ext == '.css') res.writeHead(200, {'Content-Type':'text/css'});
					res.end(content);
				});
			} else {
				res.sendStatus(404);
			}
		});					
	} else {						
		//*********************************************************************************
		//*
		//*	나머지 요청은 처리하지 않음.
		//*	나머지 요청처리는 SWF 인터페이스 요청으로 간주하고 그대로 하부미들웨어로 전달.
		//*
		//*********************************************************************************

		next();
	}	
});

module.exports = router;
