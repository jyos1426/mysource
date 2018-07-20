const express = require('express');
const router = express.Router();
const exec = require('child_process').exec;

var path = require('../../config').path;
var db = require('../../libs/db');
var c = require('../../libs/code');
var log = require('../../libs/log');

router.get('/integrity', (req, res) => {
	const update = req.query.update;
	var command = `${path.intergrityPath}`; // | echo $?
	if(update)
			command += ' 1'; // option 1 means integrity update
	console.log(command)
	exec(command, function(err, stdout, stderr) {

		if(err) {
			log.write("ERROR", `intergrity fail, err=${err}, command=${command}`);
			return res.status(200).json(c.json('1999'));
		}
		log.write("INFO", `intergrity success, command=${command}`);

		if(stdout.toUpperCase().indexOf('SUCCESS') == 0 )
			return res.status(200).json(c.json('000'));
		if(stdout.toUpperCase().indexOf('ALREADY') == 0 )
			return res.status(200).json(c.json('1017'));
	});
});

module.exports = router;
