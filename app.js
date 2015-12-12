var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var my = require('./my_conf');
var redis = require('redis'); //redis
var RedisStore = require('connect-redis')(session);  // connect-redis

// redis setting
var client = redis.createClient();
client.select(my.redisSelect());

var app = express();

// redis session setting
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUnitinialized: true,
    store: new RedisStore({
        host: my.redisAddr(),
        port: my.redisPort(),
        ttl: 60*60,
        client: client
    })
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// TEST routes
var routes = require('./routes/index');
app.use('/', routes);

// initialize routes
require('./routes/api').initApp(app);

// Server set
var http = require('http');
app.set('port', 30003); // 30003번 포트로 지정 [Nginx proxy port 80]
var server = http.createServer(app);
server.listen(app.get('port'));
console.log("[NHT] [Nginx Proxy 80 port] Clicky server: "+'Port=>'+app.get('port'));

module.exports = app;