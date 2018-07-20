const express = require('express');
const router = express.Router();
const fs = require('fs')

const path = require('../../config').path;
const db = require('../../libs/db');
const c = require('../../libs/code');
const log = require('../../libs/log');
const axios = require('../../libs/sensor');
const util = require('../../libs/util')
const async = require('async');

var afMap = {};

router.post('/af-proxy', async (req, res) => {
	const sensorId = req.body.sensorId;
	const url = req.body.url;
	const uId = req.body.userId;
	const uIp = req.body.userIp;
	var data = req.body.data;

	if(!sensorId || !url || !uId || !uIp) {
		log.write("ERROR", `[/af-proxy] af-proxy include empty data, sensorId=${sensorId}, url=${url}, uId=${uId}, uIp=${uIp}`);
		return res.status(200).json(c.json('1003'));
	}
	/*
		HISTORY_NOTE.
		- 현상 : 장비는 다중 쿼리를 날릴경우 첫번째 쿼리의 데이터만 받고 나머지는 짤리는 현상
		- 원인 : 장비는 다중 쿼리에 대한 구분을 LF(LineFeed : '\n')로 하는데 이를 인코딩하여 전달.
		        문제는,  Node가 이를 디코딩 해버려서 에러가 발생, 따라서 \n 이 있을경우 인코딩 처리.
    	- 결과 : \n이 있을 경우 Node가 디코딩을 하기 때문에 아래 encodeURI함수로 인코딩해주면 해결됨.
	*/

	if(data.indexOf('\n') !== -1) {
		data = encodeURI(data);
	}

	log.write("INFO", `[/af-proxy] af-proxy request data, sensorId=${sensorId}, url=${url}, uId=${uId}, uIp=${uIp}, data=${data}`);
	const dbPath = path.tmspath;
	const auditPath = path.auditpath;
	const category = c.getAuditCategory('CATE_MANAGE')
	const type = c.getAuditType('UTM_POLICY')

	if(!category || !type) {
		log.write("ERROR", `[/af-proxy] audit category or type is null, category=${category}, type=${type}`);
		return res.status(200).json(c.json('1018'));
	}
	// sensorId로 DB를 조회하여 ip, port 정보를 얻어온다.
	db.selectAfSensorInfoBySensorId(dbPath, sensorId, async (err, result) => {
		if(err) {
			log.write("ERROR", `[/af-proxy] db error to find sensor, sensorId=${sensorId}, dbPath=${dbPath}, err=${err}`);
			return res.status(200).json({code: err.errno, message: err});
		}

		if(result == null) {
			log.write("ERROR", `[/af-proxy] db has empty data of sensor, sensorId=${sensorId}`);
			return res.status(200).json(c.json('1003'));
		}

		var ip = result.SIP;
		var port = result.NMANAGEPORT;
		var postData = {
			id   : result.SHTTPSID,
			pwd  : result.SHTTPSPWD,
			data : data
		};

		log.write("INFO", `[/af-proxy] sensor ip=${ip}, port=${port}, sensorId=${sensorId}`);
		const auditText = postData.data.substring(4).replace(/%20|%0A/g,' ')	// 요청된 auditlog 에 맞게 변경

		// 이미 통신했던 af장비의 경우 afMap에 있는 데이터로 쿼리 전송
		if(afMap.hasOwnProperty(ip)) {
			postData.sid = afMap[ip];
			try {
				const ret = await axios.afPost(ip, port, url, postData)
				db.insertIntoAuditLog(auditPath, category, type, null, `success, ${auditText}`, uId ,uIp, (err, res) => {
					if(err) log.write("ERROR", `[/af-proxy] af query success, but insert auditlog fail, \
																			sensorId=${sensorId}, auditPath=${auditPath}, err=${err}`);
				});
				return res.send(ret.data)
			}
			catch (err) {
				delete afMap[ip];	// map에서 ip에 해당하는 세션ID제거
				log.write("ERROR", `[/af-proxy] af query fail, try afLoginThenQuery, sensorId=${sensorId}, err=${err}`);
			}
		}

		// afMap에 세션ID가 없거나, 세션이 종료되어 새 로그인이 필요한 경우에만 아래 루틴 수행.
		axios.afLoginThenQuery(ip, port, url, postData, (err, ret) => {
			if( err || ret == false ) {
				db.insertIntoAuditLog(auditPath, category, type, null, `fail, ${auditText}`, uId ,uIp, (err, res) => {
					if(err) {
						log.write("ERROR", `[/af-proxy] afLoginThenQuery fail, and insert auditlog fail, \
																sensorId=${sensorId}, auditPath=${auditPath}, err=${err}`);
					}
				});

				if(err) {
					log.write("ERROR", `[/af-proxy] af-proxy connect fail, sensorId=${sensorId}, ip=${ip}, port=${port}, url=${url}, err=${err}`);
					return res.status(200).json(c.json('1200'));
				}
				else {
					log.write("ERROR", `[/af-proxy] af-proxy login fail, sensorId=${sensorId}, ip=${ip}, port=${port}, url=${url}, err=${err}`);
					return res.status(200).json(c.json('1201'));
				}
			}
			else {
				afMap[ip] = ret.sid;  // 성공 시, ip에 해당하는 세션ID를 map에 추가
				db.insertIntoAuditLog(auditPath, category, type, null, `success, ${auditText}`, uId ,uIp, (err, res) => {
					if(err) log.write("ERROR", `[/af-proxy] afLoginThenQuery success, but insert auditlog fail, sensorId=${sensorId}, err=${err}`);
				});
				log.write("INFO", `[/af-proxy] afLoginThenQuery success, sensor ip=${ip}, sensorId=${sensorId}, sid=${ret.sid}, data=${ret.data}`);
				res.send(ret.data);
			}
		})
	})
});

router.post('/af-timer', (req, res) => {
	const time   = req.body.time;
	const dbPath = path.tmspath;

	const selectQuery  = `SELECT * FROM REF_CODE WHERE SCATEGORY='timer' and NCODE=0`;
	const insertQuery  = `INSERT into REF_CODE VALUES('timer', 0, ${time})`;
	const updateQuery  = `UPDATE REF_CODE set SNAME=${time} WHERE SCATEGORY='timer' and NCODE=0`;

	db.select(dbPath, selectQuery, (err, ret) => {
		if(err) {
			log.write("ERROR",`[/af-timer] select error, dbPath=${dbPath}, selectQuery=${selectQuery}, err=${err}`);
			return res.status(200).json({code: err.errno, message: err.message});
		}
		else if(ret.rows.length == 0) {
			db.run(dbPath, insertQuery, (err, result) => {
				if(err) {
					log.write("ERROR",`[/af-timer] insert error, dbPath=${dbPath}, insertQuery=${insertQuery}, err=${err}`);
					//return res.status(200).json({code: err.errno, message: err.code});
				}
				util.setTimer(time);
				return res.status(c.status('000')).json(c.json('000'));
			})
		}
		else {
			db.run(dbPath, updateQuery, (err, result) => {
				if(err) {
					log.write("ERROR",`[/af-timer] update error, dbPath=${dbPath}, updateQuery=${updateQuery},err=${err}`);
					return res.status(200).json({code: err.errno, message: err.message});
				}
				util.cancelAndSetTimer(time);
				return res.status(c.status('000')).json(c.json('000'));
			})
		}
	})
})

router.get('/af-backup-data', (req, res) => {
	const fileName = req.query.filename;
	const filePath = path.afbackuppath + fileName;
	const data = util.getFileData(filePath);

	if(data == null)
		return res.status(200).json(c.json('1014'));
	res.status(200).json(data)
})

module.exports = router;
