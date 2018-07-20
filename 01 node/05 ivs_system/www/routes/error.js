var express				= require('express');
var router				= express.Router();

router.use(function(req, res, next){
    res.status(404);
    return res.render('error', { layout: null });
});

router.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    return res.render('error', { layout: null });
});

module.exports = router;
