var mongoose = require('mongoose');
var Clip = mongoose.model('Clip');
var Result = require('../services/Result');
var log4js = require('log4js');
var logger = log4js.getLogger('controllers/Clip');
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');

function ClipCtrl() {

}

ClipCtrl.getUserClips = function(req, res) {
    // TODO: 여기에 유저 클립 목록 가져오는 코드 작성해야함

};

module.exports = ClipCtrl;
