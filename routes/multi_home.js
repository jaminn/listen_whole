var express = require('express');
var router = express.Router();

router.get('/:name/:room/:vid', function(req, res, next) {
  var name = req.session.nickname;
  var vid = req.params['vid'];
  var room = req.params['room'];
  res.render('multi_home', {name: name, vid: vid, room: room});
});

module.exports = router;
