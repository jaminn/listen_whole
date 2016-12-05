var express = require('express');
var router = express.Router();

var crypto = require('crypto');
       var rand = require('csprng');
       
       
       router.get('/:id', function( req, res ){
        id = req.params['id'];
      
      Users.find({ id : id}, function( err, result ){
      
        if( err ){
         throw err;
        } else {
          if(result = "[]"){
            res.send("값이없습니다")
          }else{
            res.send(result);
          }
       }
       });
     });
      
      router.post('/', function(androidToken, id ,callback) {
        var get = androidToken.body;
        var getArgs = ''+JSON.stringify(get);
        var fget = JSON.parse(getArgs);
      
        var current = new Users({
          id: fget.id+"",
          androidToken: fget.androidToken+""
        });
      
         current.save( function( err ){
              if( err ){
                throw err;
              } else {
                //callback({'response':"Password Sucessfully Changed",'res':true});
              }
            });
      
      });

module.exports = router;
