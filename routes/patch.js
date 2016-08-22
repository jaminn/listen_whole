var fs = require('fs');
var PythonShell = require('python-shell');
var sleep = require('sleep');

var kanji = "", pronun = "", kor = "";
var filename = "";
var file = "";
var infile = "";
var infileArr = "";
var regex = /.*[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[々〆〤]\w/g

module.exports.FileRename = function FileRename(a) {
  infile += a+"\n";
}

module.exports.Change = function Change(){
  infile = infile.split("\n");

  for(var i = 0; i < infile.length-1; i++){
    filename = infile[i].replace("\n", "");
    file = "uploaded/"+filename;
    console.log(filename[i++]);
    MakeFile();
    readFile();
  }
}

function readFile() {
  var cnt = 1;
  var i = 0;

  fs.readFile(file, 'utf8', function(err, data) {
    var read = data+"";
    //read = read + "\n";
    read = read.split("\n");
      for(var how = 0; how < read.length; how++){
        if(how>2){
          switch (cnt) {
            case 1:
              fs.appendFile('uploaded/kanji_'+filename, read[how]+"\n", function (err) {
                if (err) throw err;
              });
              cnt++;
              break;
            case 2:
              ++cnt;
              fs.appendFile('uploaded/pronun_'+filename, read[how]+"\n", function (err) {
                if (err) throw err;
              });

              break;
            case 3:
              cnt=1;
              fs.appendFile('uploaded/kor_'+filename, read[how]+"\n", function (err) {
                if (err) throw err;
              });
              break;
            }
	       }
      }
      convert("uploaded/kanji_"+filename);
      convert('uploaded/pronun_'+filename);
      convert('uploaded/kor_'+filename);
  });
}

function MakeFile() {
  fs.open('uploaded/kanji_'+filename,'w',function(err,fd){
	  if (err) throw err;
  });

  fs.open('uploaded/pronun_'+filename,'w',function(err,fd){
	  if (err) throw err;
  });

  fs.open('uploaded/kor_'+filename,'w',function(err,fd){
	  if (err) throw err;
  });
}

function convert(f){
  var options = {
    mode: 'text',
    scriptPath: 'uploaded/',
    args: [f, 100]
  };

  PythonShell.run('lrc2srt.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution

    if (results == null){
      console.log("lrc to srt 성공");
    }
  });
}
