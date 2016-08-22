var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
 if(req.session.logined){
  var name = req.session.nickname;
  Vids.find({}, function(err, col) {
      if (col !== null) {
		console.log(col);
        res.render('media', {col: col, name:name});
      }
      // after logging in, stay in the current page
  });
 }else{
   res.redirect('/login');
 }
});

module.exports = router;
