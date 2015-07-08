var mongoose = require('mongoose');
var User = mongoose.model('User');
var RService = require('../services/Result');
var async = require('async');

function UserCtrl() {

}

UserCtrl.getAllUsers = function (req, res) {
    var errors;
    req.checkQuery('test', 'Must be true').notEmpty().isIn(["true"]);
    errors = req.validationErrors();
    if (errors) {
        res.status(400).send(RService.ERROR(errors));
        return;
    }
    User.getUser({}, {}, {}, function(err, docs) {
       res.send(docs);
    });
};

UserCtrl.saveUser = function (req, res) {
    User.saveUser(req.body, function(err, doc) {
        res.send(doc);
    });
};

UserCtrl.login = function (req, res) {
    // TODO: 디바이스 ID 받아서 가입 안되어 실패 리턴. 가입 되어 있으면 유저 데이터로 세션 등록 후 유저 정보 내려줌!

};

module.exports = UserCtrl;
