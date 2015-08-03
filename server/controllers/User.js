var mongoose = require('mongoose');
var User = mongoose.model('User');
var Result = require('../services/Result');
var async = require('async');

function UserCtrl() {

}

UserCtrl.getAllUsers = function(req, res) {
    var errors;
    req.checkQuery('test', 'Must be true').isIn(["true"]);
    req.checkQuery('a', 'Must be aa').isIn(["aa"]);
    console.log(req.query.a);
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    User.getUsers({}, function(err, docs) {
       res.status(200).send(Result.SUCCESS(docs));
    });
};

UserCtrl.getUser = function(req, res) {
    var errors, criteria;
    //req.checkParams('id', 'Invalid id')//.notEmpty();

    req.checkParams('b', 'Invalid id').notEmpty();

    console.log(req.params);
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    criteria = { _id: req.params.id };
    User.getUser(criteria, function(err, doc) {
        res.status(200).send(Result.SUCCESS(doc));
    });
};

UserCtrl.saveUser = function(req, res) {
    var errors, userData;
    req.checkQuery('email', 'Invalid email').isEmail();
    req.checkQuery('pw', 'Invalid pw').notEmpty();
    req.checkQuery('pw2', 'Invalid pw2').notEmpty();
    req.checkQuery('name', 'Invalid name').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    userData = {
        email: req.query.email,
        pw: req.query.pw,
        name: req.query.name
    };
    User.saveUser(userData, function(err, doc) {
        res.status(200).send(Result.SUCCESS(doc));
    });
};

UserCtrl.loginUser = function(req, res) {
    // TODO: 과제1 로그인 여기에 구현해야 함
};

UserCtrl.updateUser = function(req, res) {
    // TODO: 과제2 유저 정보 업데이트하는 부분 여기에 구현해야 함
};

module.exports = UserCtrl;
