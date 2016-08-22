var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
    var isLogined = req.session.logined;
    res.render('login', {
        isLogined: isLogined
    });
});


router.post('/', function(req, res, next) {
    if (req.body.email === '' || req.body.passwd === '' || req.body.nickname === '') {
        res.redirect('login');
    }

    Users.findOne({"email": req.body.email, "passwd": req.body.passwd}, function(err, member) {
        if (err)
            if (err){
              res.redirect('/reg');
              return handleError(err);
            }

        if (member === null) {
            var current = new Users({
                email: req.body.email,
                passwd: req.body.passwd,
                nickname: req.body.nickname
            });
            current.save(function(err, data) {
                if (err) { // TODO handle the error
                    console.log("error");
                    res.render('/reg');
                }
                console.log('member is inserted');
                res.redirect('/');
            });
        }else{
          res.redirect('/');
        }
        // after logging in, stay in the current page
    });
});


module.exports = router;
