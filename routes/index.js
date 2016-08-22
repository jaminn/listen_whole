var express = require('express');
var router = express.Router();


router.get('/', function(req, res){
		if(req.session.logined){
			res.render('index', {isLogined: req.session.logined, name: req.session.nickname});
		}else{
			res.render('index');
		}
});

module.exports = router;
