var express = require('express');
var router = express.Router();
router.get('/', function (req, res) {
    isLogined = req.session.logined;
    if (!isLogined) {
        res.render('login', {});
    }
    else {
        res.redirect('/');
    }
});
router.post('/', function (req, res, next) {
    if (req.body.email === '' || req.body.passwd === '') {
        req.body.email = "";
        req.body.passwd = "";
        res.redirect('login');
        console.log("로그인 실패");
    }
    else {
        Users.findOne({
            "email": req.body.email
            , "passwd": req.body.passwd
        }, function (err, member) {
            if (member !== null) {
                req.session.regenerate(function () {
                    req.session.logined = true;
                    Users.update({
                        email: member.email
                    }, {
                        $set: {
                            "isLogined": true
                        }
                    }, function (err, result) {
                        if (err);
                    });
                    req.session.nickname = member.nickname;
                    name = member.nickname;
                    console.log(name + "님 로그인하셨습니다");
                    res.redirect('/');
                });
            }
            else {
                req.body.email = "";
                req.body.passwd = "";
                res.redirect('login');
                console.log("로그인 실패");
            }
            // after logging in, stay in the current page
        });
    }
});
module.exports = router;