var debug = require('debug')('Server');
var _ = require('lodash');
var server = require('http').createServer();
var url = require('url');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ server: server });
var express = require('express');
var app = express();
var port = 4080;
var clients = [];

app.use(function (req, res) {
  res.send({ msg: "hello" });
});

wss.on('connection', function connection(ws) {
    var id = _.uniqueId();
    debug('[%s]: connected', id);
    clients.push(id);
    var location = url.parse(ws.upgradeReq.url, true);
    // you might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    ws.on('message', function incoming(message) {
        debug('[%s]: < %s', id, message);
    });

    ws.on('close', function close() {
        debug('[%s]: disconnected', id);
        _.pull(clients, id);
    });

    ws.send('something');
});


server.on('request', app);
server.listen(port, function () {
    debug('Listening on ' + server.address().port);
});
