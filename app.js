var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);

var http = require('http');
app.set('port', 80); //80번 포트로 지정
var server = http.createServer(app);
server.listen(app.get('port'));
console.log("[NHT] Clicky server: "+'Port=>'+app.get('port'));

module.exports = app;