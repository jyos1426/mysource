var express         = require('express');
var router          = express.Router();

var path            = require('path');
// var config			= require('../../../config/app-config.json');
var utils			= require('../../../models/util');
var consistency     = require('../../../models/consistencys/consistency');
var log				= require('../../../models/log');
var fs 				= require('fs');

var multer			= require('multer');	//file read
var upload			= multer({
	dest : 'tmp_rules'
});
var exec			= require("child_process").exec;

router.post('/set_tmp_ruleset', utils.checkAfterLogin, (req, res) => {	
    var upload = multer({
        storage: multer.diskStorage({
			destination: (req, file, cb) => {
				cb(null, 'tmp_rules');
			},
			filename: (req, file, cb) => {
				cb(null, file.originalname);
			}
		})
    }).single('file');

	//추후 수정
    upload(req, res, function(err) {
        if (err) {            
			return res.json(err);
        } else {
			if( req.file.path != undefined){				
				fs.readFile(req.file.path, 'utf8',  function (err, data) {
					if (err) {                    
						console.log(err);
					}
					var jsonResult = [];
					var strArray = data.split('\n');
					for( var i=0; i < strArray.length ; i++){
						jsonResult[i] = { "rule" : strArray[i] };
					}				
					exec("rm -rf tmp_rules", function (err, stdout, stderr) {
						if (err !== null) {
							console.log(err);
						} else {                        
							return res.json(jsonResult);
						}
					});			
				});
			}else{
				console.log(err);
				return res.json(err);
			}
        }
    });	
});


router.post('/ivs_check_rule', utils.checkAfterLogin, (req, res) => {
	consistency.ivsCheckRule(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		
		var params = {
			host: req.session.ip,
			port: req.session.port,
			userid: (req.user) ? req.user.id : 'UNKNOWN',
			request: utils.join(req.method, req.originalUrl),
			userip: utils.getUserIP(req),
			type: 'WEB',
			result: 3,
			job: '정합성 검증',
			job_detail: '[정합성 검증] 정합성 검증 테스트를 수행하였습니다.'
		};
		log.setSystemAuditLog(params, (err, rows) => {
				if(err){
						console.log('Error[AuditLog Inserting]');
				}
		});       
		
		return res.json(rows);
	});
});

router.get('/ivs_get_list', utils.checkAfterLogin, (req, res) => {
	consistency.ivsGetList(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});


router.get('/check_pcap_exist', utils.checkAfterLogin, (req, res) => {	
	console.log('ip:'+req.session.ip);
	var filepath = req.session.root + '/dbms/backup/'+req.query.testcode+'/pcap/ivs_pcap.tar.gz';

	console.log(filepath);

	if( fs.existsSync(filepath)){
		return res.json("success");
	}else{
		return res.json("error");
	}
});

router.get('/pcap_download/:testcode', utils.checkAfterLogin, (req, res) => {
	var filepath = req.session.root + '/dbms/backup/'+req.params.testcode+'/pcap/ivs_pcap.tar.gz';
	res.download(filepath);
});

module.exports = router;
