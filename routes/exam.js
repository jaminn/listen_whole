var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile(__dirname + '/index.html');
});

router.get('/:word/:kanji/:mean', function( req, res ){
	var word = req.params['word'];
	var kanji = req.params['kanji'];
	var mean = req.params['mean'];

	var current = new Users({
			word : word,
			kanji : kanji,
			mean : mean
	});

	current.save( function( err ){
			if( err ){
					throw err;
			} else {
					console.log('DB에 한자 정보가 입력되었습니다');
			}
	});
});

router.get('/show', function(res, res) {
	Users.find({}, function( err, result ){
			if( err ){
					throw err;
			} else {
					res.send(result);
			}
	});
});

module.exports = router;
