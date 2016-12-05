var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    if (req.session.logined) {
        var name = req.session.nickname;
        Rooms.find({}, function(err, col) {
            if (col !== null) {
                console.log(col);
                res.render('multi', {
                    name: name,
                    col: col
                });
            }
        });
    } else {
        res.render('login');
    }
});

router.get('/:vid/:room', function(req, res) {
    if (req.session.logined) {
        var vid = req.params['vid'];
        var room = req.params['room'];
        var name = req.session.nickname;
        var level;

        Users.findOne({
            "nickname": name
        }, function(err, member) {
            if (member !== null) {
                level = member.Level;
                res.render('multi_wait_away', {
                    vid: vid,
                    name: name,
                    room: room,
                    level: level,
                    team: "home"
                });
            }
        });
    } else {
        res.redirect('/login');
    }
});


module.exports = router;
