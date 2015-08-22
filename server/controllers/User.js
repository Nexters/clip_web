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
    if (!Session.hasSession(req)) return res.status(401).send(Result.ERROR('need login'));
    var criteria = { _id: Session.getSessionId(req) };
    var data = {};
    User.getUser(criteria, function(err, doc) {
        data.user = doc;
        res.render('home', data);
    });
};

UserCtrl.getUserPage = function(req, res) {
    if (!Session.hasSession(req)) return res.status(401).send(Result.ERROR('need login'));
    var criteria = { _id: Session.getSessionId(req) };
    var data = {};
    logger.debug(criteria);
    User.getUser(criteria, function(err, doc) {
        data.user = doc;
        criteria={ user: Session.getSessionId(req)};
        Clip.getClips(criteria, {}, {}, function(err,docs){
            data.clips = docs;
            res.render('myclip', data);
        });
    });

};

UserCtrl.getAllUsers = function(req, res) {
    var errors;
    req.checkQuery('test', 'Must be true').isIn(["true"]);
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    User.getUsers({}, function(err, docs) {
        res.status(200).send(Result.SUCCESS(docs));
    });
};

UserCtrl.getUser = function(req, res) {
    var errors, criteria;
    req.checkParams('id', 'Invalid id').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    criteria = { _id: req.params.id };
    User.getUser(criteria, function(err, doc) {
        res.status(200).send(Result.SUCCESS(doc));
    });
};

UserCtrl.saveUser = function(req, res) {
    var errors, userData;
    var email,pw,name;

    req.checkBody('email', 'Invalid email').notEmpty();
    req.checkBody('pw', 'Invalid pw').notEmpty();
    req.checkBody('name', 'Invalid name').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    userData = {
        email: req.body.email,
        pw: req.body.pw,
        name: req.body.name
    };
    User.findOne({$or:[{email: userData.email}, {name: userData.name}]}, function(err, user) {
        if (err) return res.status(400).send(Result.ERROR(err));
        if (user) return res.status(200).send(Result.ERROR("이미 존재하는 유저입니다."));
        User.saveUser(userData, function(err, doc) {
            return res.status(200).send(Result.SUCCESS(doc));
        });
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
        if (doc === null) {
            return res.status(403).send(Result.ERROR('fail'));
        }
        if (criteria.email === doc.email && req.body.pw === doc.pw) {
            Session.registerSession(req, doc);
            res.status(200).send(Result.SUCCESS(doc._id));
        } else {
            return res.status(400).send(Result.ERROR('fail'));
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
        return res.status(200).send(Result.SUCCESS('success'));
    })
};

UserCtrl.logoutUser = function(req, res) {
    Session.removeSession(req);
    res.status(200).send(Result.SUCCESS('success'));
};

module.exports = UserCtrl;

