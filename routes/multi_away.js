var express = require('express');
var router = express.Router();

router.get('/:name/:room/:vid', function(req, res, next) {
  var vid = req.params['vid'];
  var room = req.params['room'];
  var home = req.params['name'];
  res.render('multi_away', {name: req.session.nickname, vid: vid, room: room, home: home});
});

module.exports = router;
