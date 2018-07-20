var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var exec = require("child_process").exec;
var asyn = require('async');
var bodyParser = require('body-parser');
var pcap = require('../../../models/settings/pcap');
var utils = require('../../../models/util');
var log = require('../../../models/log');

var options = {encoding:'utf8', timeout:0, maxBuffer:200*1024, killSignal: 'SIGTERM', cwd: null, env: null};

router.get('/', utils.checkAfterLogin, (req, res) => {
		pcap.GetPcapList(req, (err, rows) => {
				if (err) {
						return res.json(err);
				}
				return res.json(rows);
		});
});

router.get('/delete', utils.checkAfterLogin, (req, res) => {
		var rootPath = req.session.root;
		var filename = req.query.filename;
		filename = filename.replace(rootPath+'/pcap/','');

		pcap.DeletePcap(req, (err, result) => {
				if (err) {
						return res.json(err);
				} else{
						exec("rm -rf "+ rootPath +"/pcap/'"+filename+"'", options, function (err, stdout, stderr) {
								if (err !== null) {
										console.log('error: ' + err);
										return res.json(err);
								} else {
										return res.json(result);
								}
						});
				}
		});
});

/**********Pcap파일 UPLOAD 로직**********
	1. 임시폴더 tmp 생성
	2. 서버에 파일업로드
	3. pcap 파일 유지/삭제 실행
	4. 압축된 파일내부에 폴더 존재 확인
	5. 압축해제
	6. 폴더채 압축인 경우 폴더 밖으로 파일 복사
	7. 파일 리스트 저장
	8. tar 파일 삭제 / 폴더 삭제
****************************************/
router.post('/upload', utils.checkAfterLogin, (req, res) => {
		var dbPath = req.session.root;
		var foldername = '';
		var newFilename = '';
		var category = '';
		var comment = '';
		var deleteAll = '';
		var param;
		var fileExt;

		var storage = multer.diskStorage({
				destination: function (req, file, callback) {
						if(path.extname(file.originalname) !== '.pcap' && path.extname(file.originalname) !== '.cap'){
								callback(null, dbPath + '/pcap');
						}else {
								callback(null, dbPath + '/pcap/tmp');
						}
				},
				filename: function (req, file, callback) {
						newFilename = file.originalname;
						callback(null, newFilename);
				}
		});

		var upload = multer({
				storage: storage,
				fileFilter: function (req, file, callback) {
						var ext = path.extname(file.originalname)
						fileExt = path.extname(file.originalname)
						if (ext !== '.tgz' && ext !== '.pcap' && ext !== '.cap') {
								req.fileValidationError = 'err';
								return callback(null, false, new Error('I don\'t have a clue!'));
						}else{
								callback(null, true);
						}
				}
		}).array('pcap_file', 10);

		var tasks = [
				function(callback){//임시폴더 tmp 생성
						fs.exists(dbPath + '/pcap/tmp', function(e){
								console.log(e);
								if(!e){
										exec("mkdir "+ dbPath +"/pcap/tmp", options, function (err, stdout, stderr) {
												if (err !== null) {
														console.log('error: ' + err);
														return res.json({"error":"shellCommand error"});
												}
												callback(null);
										});
								}else{
										callback(null);
								}
						});
				},
				function(callback){ //파일업로드
						upload(req, res, function (err) {
								if(req.fileValidationError) {
										return res.json({"error":req.fileValidationError});
								}
								callback(null);
						});
				},
				function(callback) { //파일 삭제/유지 확인 실행
						deleteAll = req.body.deleteAll;
						if(deleteAll){
								shellCommand("rm -rf "+ dbPath +"/pcap/*.pcap "+ dbPath +"/pcap/*.cap");
								callback(null);
						}else{
								callback(null);
						}
				},
				function(callback){//압축 내용 확인
						if(fileExt !== '.pcap' && fileExt !== '.cap'){
								exec("tar tf "+ dbPath +"/pcap/" + newFilename, options, function(err, stdout, stderr){
										var folder = stdout.split('/');
										foldername = folder[0];
										foldername1 = folder[1];
										if (err !== null) {
												console.log('error: ' + err);
										} else {
												callback(null);
										}
								});
						}else{
								callback(null);
						}
				},
				function (callback) {//압축파일 해제
						if(fileExt !== '.pcap' && fileExt !== '.cap'){
								// if(foldername1 === undefined){
								// 		shellCommand("tar -zxvf "+ dbPath +"/pcap/" + newFilename + " -C "+ dbPath +"/pcap *.pcap *.cap");
								// }else{
								// 		shellCommand("tar -zxvf "+ dbPath +"/pcap/" + newFilename + " -C "+ dbPath +"/pcap "+foldername+"/*.pcap "+foldername+"/*.cap");
								// }
								shellCommand("tar -zxvf "+ dbPath +"/pcap/" + newFilename + " -C "+ dbPath +"/pcap");
								callback(null);
						}else{
								callback(null);
						}

				},
				function(callback){
						if(fileExt !== '.pcap' && fileExt !== '.cap'){
								if(foldername1 === undefined){
										callback(null);
								}else{//폴더채로 압축한 경우
										shellCommand("cp "+ dbPath +"/pcap/"+foldername+"/* "+ dbPath +"/pcap");
										callback(null);
								}
						}else{
								shellCommand("cp "+ dbPath +"/pcap/tmp/* "+ dbPath +"/pcap");
								callback(null);
						}
				},
				function (callback) {
						if(fileExt !== '.pcap' && fileExt !== '.cap'){
								if(foldername1 === undefined){
									param = foldername;
									folder = "";
									callback(null);
								}else{//폴더채로 압축한 경우
									exec("ls "+ dbPath +"/pcap/"+foldername, options, function (err, stdout, stderr) {
										//"ls "+ dbPath +"/pcap/"+foldername+"/*.pcap "+ dbPath +"/pcap/"+foldername+"/*.cap"
											param = stdout;
											folder = foldername;
											if (err !== null) {
													console.log('error: ' + err);
													return res.json({"error":"shellCommand error"});
											} else {
													callback(null);
											}
									});
								}
						}else{
								exec("ls "+ dbPath +"/pcap/tmp/* ", options, function (err, stdout, stderr) {
										param = stdout;
										folder = "tmp";
										if (err !== null) {
												console.log('error: ' + err);
												return res.json({"error":"shellCommand error"});
										} else {
												callback(null);
										}
								});
						}
				},
				function(callback){//폴더,tar파일 삭제
						if(fileExt !== '.pcap' && fileExt !== '.cap'){
								if(foldername1 === undefined){
										shellCommand("rm -rf "+ dbPath +"/pcap/"+newFilename+" "+ dbPath +"/pcap/tmp");
										callback(null);
								}else{//폴더채로 압축한 경우
										shellCommand("rm -rf "+ dbPath +"/pcap/"+foldername+" "+ dbPath +"/pcap/"+newFilename+" "+ dbPath +"/pcap/tmp");
										callback(null);
								}
						}else{
								shellCommand("rm -rf "+ dbPath +"/pcap/tmp");
								callback(null);
						}
				},
				function(callback) {//db삭제
						deleteAll = req.body.deleteAll;
						if(deleteAll){
								pcap.DeleteAllPcap(req, (err, rows) => {
										if (err) {
												return res.json(err);
										}else{
												callback(null);
										}
								});
						}else{
								callback(null);
						}
				},
				function (callback) {
						comment = req.body.comment;
						pcap.InsertPcap(param, comment, folder, dbPath, (err, rows) => {
								if (err) {
										return res.json(err);
								}
								callback(null);
						});
				}
		];

		asyn.series(tasks, function (err, results) {
				return res.render('settings/pcap', {
						layout: false,
						session: req.session
				});
		});

		function shellCommand(command){
				exec(command, options, function (err, stdout, stderr) {
						if (err !== null) {
								console.log('error: ' + err);
								return res.json({"error":"shellCommand error"});
						}
				});
		}
});

router.get('/get_pcap_path', utils.checkAfterLogin, (req, res) => {
	pcap.GetPcapPath(req, (err, result) => {
			if (err) {
				return res.json(err);
			} else{
				return res.json(result);
			}
	});
});

router.get('/check_pcap_exist', utils.checkAfterLogin, (req, res) => {
	var filepath = decodeURIComponent(req.query.filepath);
	if( fs.existsSync(filepath)){
		return res.json("success");
	}else{
		return res.json("error");
	}
});

router.get('/pcap_download', utils.checkAfterLogin, (req, res) => {
	var filepath = decodeURIComponent(req.query.filepath);
	res.download(filepath);
});
module.exports = router;
