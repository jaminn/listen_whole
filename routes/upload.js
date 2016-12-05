var express = require('express');
var router = express.Router();

var multiparty = require('multiparty');
var fs = require('fs');

var islrc = false;
var name = "";

var path = process.cwd();
var lrcpath = require( path + '/routes/patch' );

router.get('/', function(req, res){
	if(req.session.isLogined){
		res.render('upload');
	}else{
		res.redirect('/');
	}
});

router.post('/', function(req, res, next) {
      var file = "";
      var form = new multiparty.Form();

      // get field name & value
      form.on('field',function(name,value){
           console.log('normal field / name = '+name+' , value = '+value);
      });

      // file upload handling
      form.on('part',function(part){
           var filename;
           var size;
           if (part.filename) {
                 filename = part.filename;
                 size = part.byteCount;
           }else{
                 part.resume();
           }

           file = filename+"";
           if(file.split(".")[file.split(".").length-1] == "png"){
             filename = req.session.nickname+".png";
           }else if(file.split(".")[file.split(".").length-1] == "jpg"){
             filename = req.session.nickname+".jpg";
           }


           console.log("Write Streaming file :"+filename);
           var writeStream = fs.createWriteStream('/server/node/jplisten/uploaded/'+filename);
           writeStream.filename = filename;
           part.pipe(writeStream);

           part.on('data',function(chunk){
                 console.log(filename+' read '+chunk.length + 'bytes');
           });

           part.on('end',function(){
                 console.log(filename+' Part read complete');
                 writeStream.end();
           });
      });

      // all uploads are completed
      form.on('close',function(){
          res.redirect('/upload');
      });

      // track progress
      form.on('progress',function(byteRead,byteExpected){
           console.log(' Reading total  '+byteRead+'/'+byteExpected);
      });

      form.parse(req);
});

module.exports = router;
