var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
var session = require('express-session');
var sessionstore = require('sessionstore');
var store = sessionstore.createSessionStore();
var routes = require('./routes/index');
var users = require('./routes/users');
var exam = require('./routes/exam');
var stu = require('./routes/stu');
var upload = require('./routes/upload');
var login = require('./routes/login');
var logout = require('./routes/logout');
var reg = require('./routes/reg');
var multi_home = require('./routes/multi_home');
var multi_away = require('./routes/multi_away');
var multi_wait_home = require('./routes/multi_wait_home');
var multi_wait_away = require('./routes/multi_wait_away');
var media = require('./routes/media');
var media_ex = require('./routes/media_ex');
var profile = require('./routes/profile');
var upload = require('./routes/upload');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://rnnwkals1:hi000319@ds119618.mlab.com:19618/listendb');
var db = mongoose.connection;
var UserSchema = new mongoose.Schema({
    email: {
        type: String
        , required: true
        , unique: true
    }
    , passwd: {
        type: String
        , required: true
    }
    , nickname: {
        type: String
        , required: true
        , unique: true
    }
    , isLogined: {
        type: Boolean
        , required: true
        , default: false
    }
    , Level: {
        type: Number
        , default: 0
    }
    , score: {
        type: Number
        , default: 0
    }
    , exp: {
        type: Number
        , default: 0
    }
    , PlayedVid: [{
        Vid: {
            type: String
        }
        , cnt: {
            type: Number
            , default: 0
        }
        , word: [{
            type: String
        }]
        , HowmanyWrong: [{
            type: Number
        }]
        , HowmanyPlay: {
            type: Number
        }
        , playtime: {
            type: Number
            , default: 0
        }
        , playtimeAg: {
            type: Number
            , default: 0
        }
        }]
    , HowMany_wrongs: {
        type: String
    }
});
Users = mongoose.model('users', UserSchema);
var VidSchema = new mongoose.Schema({
    name: {
        type: String
        , required: true
        , unique: true
    }
    , vid: {
        type: String
        , required: true
        , unique: true
    }
    , tag: {
        type: String
        , required: true
    }
    , intro: {
        type: String
        , required: true
    }
});
Vids = mongoose.model('vids', VidSchema);
var roomSchema = new mongoose.Schema({
    room: {
        type: String
    }
    , username: {
        type: String
    }
    , vid: {
        type: String
    }
, });
Rooms = mongoose.model('room', roomSchema);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static('sub'));
app.use(session({
    store: store
    , secret: '앙기모띠'
    , saveUninitialized: true
    , resave: true
    , saveUninitialized: true
}));
//url
app.use('/', routes);
app.use('/exam', exam);
app.use('/users', users);
app.use('/upload', upload);
app.use('/stu', stu);
app.use('/multi_wait_home', multi_wait_home);
app.use('/multi_wait_away', multi_wait_away);
app.use('/multi_home', multi_home);
app.use('/multi_away', multi_away);
app.use('/login', login);
app.use('/logout', logout);
app.use('/reg', reg);
app.use('/media', media);
app.use('/media_ex', media_ex);
app.use('/profile', profile);
app.use('/upload', upload);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message
            , error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message
        , error: {}
    });
});
module.exports = app;