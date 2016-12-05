var express = require('express');
var router = express.Router();

router.get('/:vid', function(req, res, next) {
  var vid = req.params['vid'];

  if(req.session.logined){
    res.render('stu', {name: req.session.nickname, vid: vid});
  }else{
    res.redirect('/');
  }
});

module.exports = router;
