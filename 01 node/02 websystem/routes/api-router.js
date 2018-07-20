//Rest-API 라우팅 파일
var express         = require('express');
var router          = express.Router();
var apis						= require('../libs/api');
var validator				= require('../libs/validator');
var e 							= require('../libs/error');
var sensor					= require('../libs/sensor');
var async 					= require('async');

router.get('/api/list', (req, res, next) => {	
	res.json(apis);
});

//rest-api 들에 공통적으로 처리해야할 부분 구현 (예: validation 처리)
router.all('/api/*', (req, res, next) => {
	//get api object
	var api = apis.getObject(req.path.toLowerCase(), req.method.toUpperCase());	
	if (!api) {		
		res.status(e.status('001')).json(e.json('001')); //정의되지 않은 api
		return;
	} else {
		//engine_ver 체크
		if (validator.isSupported(api)) {
			//validation check
			//※ url parameter와 body parameter는 동시에 지원하지 않는다.
			//api가 url parameter이면 req.query를 전달
			//api가 body parameter이면 req.body를 전달
			if (api.parameters) {
				validator.check(api, req.query, 
					(success) => {											
						req['api'] = api; //api 객체 하부 미들웨어로 전달
						next();				
					},
					(fail) = (err) => {						
						res.status(e.status(err.error_code)).json(err); //validation 체크 에러		
					}
				);
			} else if (api.body) {
				var bodyParams;
				if ( !Array.isArray(req.body) ) bodyParams = [req.body];
				else														bodyParams = req.body;

				var asyncTasks = [];
				bodyParams.forEach( (param, i) => {
					asyncTasks.push( (callback) => {
						validator.check(api, param, 
							(success) => { callback(); },
							(fail) = (err) => { 
								var errorObj;
								errorObj = err;
								errorObj.detail = `[index:${i}] ${errorObj.detail}`
								callback(errorObj, []);
							}
						);
					})
				});

				async.series(
					//비동기 작업함수들 순차적으로 실행
			  	asyncTasks,

			  	(err, results) => {
			  		if (err) {
			  			res.status(e.status(err.error_code)).json(err);
			  		} else {
			  			req['api'] = api; //api 객체 하부 미들웨어로 전달
							next();
			  		}
			  	}
				)
			} else {
				req['api'] = api; //api 객체 하부 미들웨어로 전달
				next();
			}
		} else {
			res.status(e.status('007')).json(e.json('007', 'this api supported engine version is ' + api['engine_ver'])); //잘못된 요청
		}
	}	
});

module.exports = router;