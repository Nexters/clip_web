var mongoose = require('mongoose');
var User = mongoose.model('User');
var Result = require('../services/Result');
var async = require('async');
var Session = require('../services/Session');


function UserCtrl() {

}

UserCtrl.getHomePage = function(req, res) {
    // TODO: 세션으로 달아야함. 주석풀기
    //if (!Session.hasSession(req)) return res.status(401).send(Result.ERROR('need login'));
    //var criteria = { _id: Session.getSessionId(req) };

    var criteria = { _id: '55b4a8955c91698d7c449146' };
    var data = {};
    User.getUser(criteria, function(err, doc) {
        data.user = doc;
        res.render('home', data);
    });
};

UserCtrl.getUserPage = function(req, res) {
    res.render('myclip');
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
    User.getUser({$or:[{email: userData.email}, {name: userData.name}]}, function(err, user) {
        if (err) res.status(400).send(Result.ERROR(err));
        if (user) res.status(400).send(Result.ERROR("이미 존재하는 유저"));
        User.saveUser(userData, function(err, doc) {
            return res.status(200).send(Result.SUCCESS(doc));
        });
    });

};

UserCtrl.loginUser = function(req, res) {
    // POST
    // email, pw
    //
    // email로 criteria 만들어서 해당 email을 가진 유저 존재하는지 확인하고
    // 존재안하면 fail 리턴. 존재하면 pw가 넘겨받은 pw랑 같은지 확인해서 같으면 success, 다르면 fail
    // TODO: 과제1 로그인 여기에 구현해야 함

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
    // PUT
    // id <- params, 업데이트 되는 필드 데이터 <- req.body
    // 업데이트 가능한 필드: feeds, keywords, name, profileUrl, pw
    // TODO: 과제2 유저 정보 업데이트하는 부분 여기에 구현해야 함

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
    console.log(req.session);
    Session.removeSession(req);
    console.log(req.session);
    res.status(200).send(Result.SUCCESS('success'));
};

module.exports = UserCtrl;

