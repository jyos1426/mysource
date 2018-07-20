
module.exports = function(ROOT_PATH){
    var express = require('express');
    var router = express.Router();
    var url = require('url');

    router.get('/', function(req, res, next) {
        //시리얼 인증서

        var queryString = url.parse(req.url, true).query;
        var downPath = ROOT_PATH +  queryString.path;
        res.download(downPath);
    });

return router; 
}