var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
		Users.update({nickname:req.session.nickname}, {$set:{"isLogined": false}}, function(err, result) {
         if(err);
    });

	req.session.destroy(function(err){
		console.log(err);
    });

 	res.redirect('/');
});

router.post('/', function(req, res, next) {
	if(req.body.logout === "true"){
		console.log("로그아웃");
			Users.update({nickname:req.session.nickname}, {$set:{"isLogined": false}}, function(err, result) {
			 if(err);
		 });
	}else if(req.body.logout === "false"){
		console.log("로그인");
		Users.update({nickname:req.session.nickname}, {$set:{"isLogined": true}}, function(err, result) {
        if(err);
    });
	}
});

module.exports = router;
