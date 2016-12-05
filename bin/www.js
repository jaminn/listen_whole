#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');

var debug = require('debug')('jplisten:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '80');
app.set('port', port);


/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * ADDED!! Require Socket.IO
 */
var io = require('socket.io')(server);


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * ADDED!! Socket.IO Connection.
 */

 var hU = "";
 var hUL;

io.sockets.on('connection', function(socket) {
    socket.on('home', function(username) {
        console.log(username + "님의 방이생성되었습니다");
        socket.username = username;
        socket.room = username;
        socket.join(username);
    });

    socket.on('score', function(team, score, cnt) {
        switch (team) {
            case "home":
                io.sockets.in(socket.room).emit('home', score, cnt);
                break;
            case "away":
                io.sockets.in(socket.room).emit('away', score, cnt);
                break;

        }
    });

    socket.on('go', function(name, vid, room) {
      io.sockets.in(socket.room).emit('start', name, vid, room);
    });

    socket.on('info', function(team, user, level) {
        switch (team) {
            case "home":
                io.sockets.in(socket.room).emit('home', user, level);
                hU = user;
                hUL = level;
                break;
            case "away":
                io.sockets.in(socket.room).emit('home', hU, hUL);
                io.sockets.in(socket.room).emit('away', user, level);
                break;

        }
    });

    socket.on('sendAlert', function(name, url) {
        var to = url.split("/");
        io.to(to[3]).emit("alert", name, url);
    });

    socket.on('connectRoom', function(newroom) {
        if (socket.room === undefined) {
            socket.join(newroom);
            socket.room = newroom;
        } else {
            console.log(socket.room + '방을' + newroom + '으로바꿉니다');
            socket.leave(socket.room);
            socket.join(newroom);
            socket.room = newroom;
        }
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function() {
        socket.broadcast.emit('update', socket.username);
        socket.leave(socket.room);
    });
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}
