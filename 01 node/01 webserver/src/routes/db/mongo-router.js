const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;

const c = require('../../libs/code');
const log = require('../../libs/log');
const util = require('../../libs/util')

router.post('/mongo', (req, res) => {
	if(req.body.query && req.body.query.constructor === String) {
		req.body.query = JSON.parse(req.body.query);
	}
	const client = req.app.locals.client;
	const capppedClient = req.app.locals.capppedClient;

	// 예외 1. db,collection,query,action 등 required 요소가 없을 때
	if(req.body.db === undefined || req.body.collection === undefined ||
		 req.body.query === undefined || req.body.query.action === undefined ){
		log.write("ERROR", `[/mongo] one of body data is empty, db=${req.body.db}, collection=${req.body.collection}, \
																									 query=${req.body.query}, action=${req.body.query.action}`);
		return res.status(c.status('1100')).json(c.json('1100',"db, collection, query, action are required keys"));
	}

	var dbname = req.body.db;
	var collectionname = req.body.collection;
	var query = req.body.query;
	var action = query.action;

	//log.write("INFO", `mongo body info, db=${dbname}, collection=${collectionname}, query=${query}, action=${action}`)
	// 예외 2. 정의되지 않은 키 (오타 혹은 임의 추가)
	for (var key in req.body) {
		if(key !== "db" && key !=="collection" && key !== "query" && key !== "capped"){
			log.write("ERROR",`[/mongo] body data include not defined data, key = ${key}`);
			return res.status(c.status('1100')).json(c.json('1100',key + " is not defined"));
			break;
		}
	}
	for (var key in query) {
		if(key !== "action" && key !=="condition" && key !== "find_option" && key !== "allowDiskUse"){
			log.write("ERROR",`[/mongo] body data include not defined data, key = ${key}`);
			return res.status(c.status('1100')).json(c.json('1100',key + " is not defined"));
			break;
		}
	}

	try{
		var exe = req.body.capped? capppedClient.db(dbname).collection(collectionname) :
											 			 	 client.db(dbname).collection(collectionname);

		// 서버에 쿼리 출력용입니다, 불필요 시 queryString 관련 라인 모두 제거해도 무방
		var queryString = "db." + collectionname + "." + query.action;


		// find
		if( query.action === 'find' ){
			// 제어 1. condition === undefined 일 때 {} 또는 []로 변경
			if(query.condition === undefined){
				query.condition = {};
			}
			else if(query.condition.hasOwnProperty("_id")) { // ObjectID를 쓰는 경우, Node 문법에 맞게 변경
				var id = query.condition._id;
				var objectId;

				for(key in id) {
					objectId = new ObjectID.createFromHexString(id[key]);
					id[key] = objectId;
				}
			}

			exe = exe.find(query.condition, {"allowPartialResults":true});
			queryString = queryString + "(" + util.jsonPrint(query.condition)+ ")";

			//find_option 있을 경우 실행 (sort, skip, limit)
			if(query.hasOwnProperty('find_option')){
				var find_option = query.find_option;

				// 예외 3. 정의되지 않은 find_option 키 여부 확인
				for (var key in find_option) {
					if(key !== "sort" && key !=="limit" && key !== "skip"){
						throw c.json('1100' ,key + " is not defined in find_option");
						break;
					}
				}

				if(find_option.hasOwnProperty('sort')){
					exe = exe.sort(find_option.sort);
					queryString = queryString + ".sort(" + util.jsonPrint(find_option.sort)+ ")"
				}

				if(find_option.hasOwnProperty('skip')){
					exe = exe.skip(find_option.skip);
					queryString = queryString + ".skip(" +util.jsonPrint(find_option.skip)+ ")"
				}

				if(find_option.hasOwnProperty('limit')){
					exe = exe.limit(find_option.limit);
					queryString = queryString + ".limit(" +util.jsonPrint(find_option.limit)+ ")"
				}
			}

		// aggregate
		}else if( query.action === 'aggregate' ){
			var aggreOption = {}
			// 예외 4. aggregate 에 find_option 이 있을 때
			if (query.find_option) {
				throw c.json('1100',"'aggregate' can't contain find_option");
			}

			// 제어 1. condition === undefined 일 때 {} 또는 []로 변경
			if(query.condition === undefined){
				query.condition = [];

			// 제어 2. 잘못된 aggregate 조건 ex) {}일 때 수행됨 -> 임의로 에러 발생
			} else if (!Array.isArray(query.condition)){
				throw c.json('1100' ,'aggregate condition needs array []');
			} else if (query.hasOwnProperty("allowDiskUse")) {
				aggreOption.allowDiskUse = true;
			}


			exe = exe.aggregate(query.condition, aggreOption);
			queryString = queryString + "(" + util.jsonPrint(query.condition)+ ")";


		// 예외 5. action에 find / aggregate 외 다른 value가 있을 때
		}else{
			throw c.json('1100' ,'no supported action');
		}
		//log.write("INFO", `mongo queryString = ${queryString}`);
		queryString = queryString + ".pretty()";

		// toArray
		exe.toArray(function(err, results) {
			if(err)	{
				log.write("ERROR",`[/mongo] mongo error, query=${query}, err = ${err}`);
				return res.status(c.status('1101')).json(c.json('1101',err.message));
			}else{
				return res.json({ datas: results });
			}
		});

	}catch(err){
		log.write("ERROR",`[/mongo] mongo query try-catch exception, query=${util.jsonPrint(query)}, err = ${err}`);
		res.status(c.status(200)).json(err);
		return;
	}


});
module.exports = router;
