var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next){
	var isLogined = req.session.logined;
	var name = req.session.nickname;

	if(!isLogined){
		res.render('login', {});
	}else{
		Users.findOne({nickname: name}, function (err, pf) {
			if(pf !== null) {
				res.render('profile', {pf: pf});
			}
			// after logging in, stay in the current page
		});
	}
});

module.exports = router;
