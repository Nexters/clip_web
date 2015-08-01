var mongoose = require('mongoose');
var User = mongoose.model('User');
var RService = require('../services/Result');
var async = require('async');

function UserCtrl() {

}

UserCtrl.getAllUsers = function(req, res) {
    var errors;
    req.checkQuery('test', 'Must be true').isIn(["true"]);
    errors = req.validationErrors();
    if (errors) return res.status(400).send(RService.ERROR(errors));
    User.getUsers({}, function(err, docs) {
       res.send(docs);
    });
};

UserCtrl.saveUser = function(req, res) {
    var errors, userData;
    req.checkQuery('email', 'Invalid email').isEmail();
    req.checkQuery('pw', 'Invalid pw').notEmpty();
    req.checkQuery('pw2', 'Invalid pw2').notEmpty();
    req.checkQuery('name', 'Invalid name').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(RService.ERROR(errors));
    userData = {
        email: req.query.email,
        pw: req.query.pw,
        name: req.query.name
    };
    User.saveUser(userData, function(err, doc) {
        res.send(doc);
    });
};

UserCtrl.loginUser = function(req, res) {
    // TODO: 과제1 로그인 여기에 구현해야 함
};

UserCtrl.updateUser = function(req, res) {
    // TODO: 과제2 유저 정보 업데이트하는 부분 여기에 구현해야 함
};

module.exports = UserCtrl;
