var express         = require('express');
var router          = express.Router();

var path            = require('path');
// var config			= require('../../../config/app-config.json');
var utils			= require('../../../models/util');
var log				= require('../../../models/log');
var load       		= require('../../../models/loads/load');
var fs 				= require('fs');

var multer			= require('multer');	//file read
var upload			= multer({
	dest : 'tmp_rules'
});
var exec			= require("child_process").exec;


router.get('/get_test_list', utils.checkAfterLogin, (req, res) => {
	load.getTestList(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});


router.get('/get_selected_test_list', utils.checkAfterLogin, (req, res) => {
	load.getSelectedTestList(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});


router.get('/ivs_overload_data', utils.checkAfterLogin, (req, res) => {
	load.getOverloadData(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});

router.get('/get_rule_list', utils.checkAfterLogin, (req, res) => {
	load.getRuleList(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});

router.get('/ivs_get_load_list', utils.checkAfterLogin, (req, res) => {
	load.ivsGetLoadList(req, (err, rows) => {
		if(err) {
			return res.json(err);
		}
		return res.json(rows);
	});
});


module.exports = router;
