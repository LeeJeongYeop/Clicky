var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// TEST routes
var routes = require('./routes/index');
app.use('/', routes);

// express-session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));

// initialize routes
require('./routes/api').initApp(app);

// Server set
var http = require('http');
app.set('port', 30003); // 30003번 포트로 지정 [Nginx proxy port 80]
var server = http.createServer(app);
server.listen(app.get('port'));
console.log("[NHT] [Nginx Proxy 80 port] Clicky server: "+'Port=>'+app.get('port'));

module.exports = app;