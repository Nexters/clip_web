var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var fs = require('fs');
var config = require('./config/config');
var mongoose = require('mongoose');
var log4js = require('log4js');
var MongoStore = null;

var app = express();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// log4js setting
log4js.configure(config.log4js);
log4js.setGlobalLogLevel(config.logLevel);

// Model Files
var modelsPath = path.join(__dirname, './models');
fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(modelsPath + '/' + file);
    }
});

// Route Files
var routes = require('./routes/index');
var users = require('./routes/users');
var feeds = require('./routes/feeds');

// Database Setup
var dbUri = config.mongo.uri + config.mongo.db;
var dbOptions = { username: config.mongo.username, password: config.mongo.password };
mongoose.connect(dbUri, dbOptions);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Validator Setting
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            vals : [formParam],
            key   : msg
        };
    }
}));

// Static Path Setting
app.use(express.static(path.join(__dirname, 'public')));

// Session
if (app.get('env') === 'production') {
    MongoStore = require('connect-mongo')(session);
    app.use(session({
        secret: config.secret,
        store: new MongoStore({ url: dbUri }),
        resave: false,
        saveUninitialized: true
    }));
} else {
    app.use(session({
        secret: config.secret,
        resave: false,
        saveUninitialized: true
    }));
}

app.use('/', routes);
app.use('/user', users);
app.use('/feed', feeds);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
