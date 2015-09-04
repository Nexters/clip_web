var mongoose = require('mongoose');
var User = mongoose.model('User');
var Result = require('../services/Result');
var async = require('async');
var log4js = require('log4js');
var logger = log4js.getLogger('controllers/User');
var Session = require('../services/Session');
var Clip = mongoose.model('Clip');

function UserCtrl() {

}

UserCtrl.getHomePage = function(req, res) {
    if (!Session.hasSession(req)) return res.redirect("/signin");
    var criteria = { _id: Session.getSessionId(req) };
    var data = {};
    User.getUser(criteria, function(err, doc) {
        data.user = doc;
        res.render('home', data);
    });
};

UserCtrl.getUserPage = function(req, res) {
    if (!Session.hasSession(req)) return res.redirect("/signin");
    var criteria = { _id: Session.getSessionId(req) };
    var data = {};
    if(!req || !res) return;
    async.waterfall([
        function(callback) {
            User.getUser(criteria, function(err,doc) {
                data.user = doc;
                callback(err);
            });
        },
        function(callback) {
            criteria={ user: Session.getSessionId(req) };
            Clip.getClips(criteria, {}, {}, function(err, doc){
                data.clips = doc;
                callback(err);
            });
        }
    ], function (err) {
        if (err) return res.status(400).send(Result.ERROR(err));
        res.render('myclip', data);
    });
};

UserCtrl.getUser = function(req, res) {
    var errors, criteria;
    req.checkParams('id', 'Invalid id').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    criteria = { _id: req.params.id };
    User.getUser(criteria, function(err, doc) {
        if (err) return res.status(400).send(Result.ERROR(err));
        res.status(200).send(Result.SUCCESS(doc));
    });
};

UserCtrl.saveUser = function(req, res) {
    var emailCheck= /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    var errors, userData;

    req.checkBody('email', 'Invalid email').notEmpty();
    req.checkBody('pw', 'Invalid pw').notEmpty();
    req.checkBody('name', 'Invalid name').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));

    if(!emailCheck.test(req.body.email)) {
        return res.status(200).send(Result.ERROR("이메일 형식에 맞지 않습니다."));
    }
    userData = {
        email: req.body.email,
        pw: req.body.pw,
        name: req.body.name
    };
    async.waterfall([
        function(callback){
            User.findOne({$or:[{email: userData.email}, {name: userData.name}]}, function(err, user) {
                if (err) return callback(err);
                if (user) return callback("already exist");
                callback();
            });
        },
        function(callback) {
            User.saveUser(userData, function(err, doc) {
                if (err) return callback(err);
                callback(null, doc);
            });
        }
    ],
    function(err, doc) {
        if (err === "already exist") return res.status(200).send(Result.ERROR("이미 존재하는 유저입니다."));
        if (err) return res.status(400).send(Result.ERROR(err));
        res.status(200).send(Result.SUCCESS(doc));
    });
};

UserCtrl.loginUser = function(req, res) {
    var errors, criteria;
    req.checkBody('email', 'Invalid email').notEmpty();
    req.checkBody('pw', 'Invalid pass word').notEmpty();
    errors = req.validationErrors();
    if(errors) return res.status(400).send(Result.ERROR(errors));

    criteria = {email: req.body.email};

    User.getUser(criteria, function(err,doc) {
        if (!doc) return res.status(403).send(Result.ERROR('fail'));
        if (criteria.email === doc.email && req.body.pw === doc.pw) {
            Session.registerSession(req, doc);
            return res.status(200).send(Result.SUCCESS(doc._id));
        } else {
            return res.status(403).send(Result.ERROR('fail'));
        }
    });
};

UserCtrl.updateUser = function(req, res) {
    var errors, conditions, update = {};
    req.checkParams('id', 'Invalid id').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    conditions = {_id: req.params.id};
    if(req.body.feeds !== undefined){
        update.feeds = req.body.feeds;
    }
    if(req.body.keywords !== undefined){
        update.keywords = req.body.keywords;
    }
    if(req.body.name !== undefined){
        update.name = req.body.name;
    }
    if(req.body.profileUrl !== undefined){
        update.profileUrl = req.body.profileUrl;
    }
    if(req.body.pw !== undefined){
        update.pw = req.body.pw;
    }
    User.updateUser(conditions, update, function(err, doc) {
        if (err) return res.status(400).send(Result.ERROR(err));
        return res.status(200).send(Result.SUCCESS('success'));
    })
};

UserCtrl.logoutUser = function(req, res) {
    Session.removeSession(req);
    res.status(200).send(Result.SUCCESS('success'));
};

UserCtrl.defaultPassword = function(req, res) {
    var errors, userData;
    var update = {};
    var defaultPassword = 'abc123';

    req.checkParams('email', 'Invalid email').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    userData = {
        email: req.params.email
    };
    async.waterfall([
        function(callback){
            User.findOne({email: userData.email}, function(err, user) {
                if (err) return callback(err);
                if (!user) return callback("존재하지 않는 유저입니다.");
                callback(err, user);
            });
        },
        function(user, callback) {
            update.pw = defaultPassword;
            User.updateUser({email: user.email}, update, function(err, doc) {
                callback(err, doc);
            });
        }
    ],
    function(err, result) {
        if (err) return res.status(400).send(Result.ERROR(err));
        return res.status(200).send(Result.SUCCESS(result));
    });
};
module.exports = UserCtrl;
