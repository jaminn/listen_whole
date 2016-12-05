var express = require('express');
var router = express.Router();
var path = require('path');

router.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
router.get('/:asdf', function(req, res, next) {
	var asdf = req.params['asdf'];
    Vids.findOne({"vid": asdf}, function(err, member) {
    	if (member !== null) {
				Users.find({"isLogined": true}, function(err, loginedU) {
				res.render('media_ex', {vid: asdf, member: member, user: loginedU, name: req.session.nickname});
			});
		}
  	});
});

module.exports = router;
