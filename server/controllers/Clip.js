var mongoose = require('mongoose');
var Clip = mongoose.model('Clip');
var Result = require('../services/Result');
var log4js = require('log4js');
var logger = log4js.getLogger('controllers/Clip');
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');
var Session = require('../services/Session');

function ClipCtrl() {

}

ClipCtrl.getUserClips = function(req, res) {
    // TODO: 여기에 유저 클립 목록 가져오는 코드 작성해야함
    var criteria,errors;
    req.checkParams('id', 'Invalid id').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    criteria ={_id: req.params.id};
    Clip.getClips(criteria,function(err,doc){
        res.status(200).send(Result.SUCCESS(doc));
    });

};

ClipCtrl.saveUserClip = function(req, res) {
    var errors, clipData;
    var title,feeds,keywords,user;
    if (!Session.hasSession(req)) return res.status(401).send(Result.ERROR('need login'));

    req.checkBody('title', 'Invalid title').notEmpty();
    req.checkBody('feeds', 'Invalid feeds').notEmpty();
    req.checkBody('keywords', 'Invalid keywords').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    clipData = {
        user: Session.getSessionId(req),
        title:req.body.title,
        feeds:req.body.feeds,
        keywords:req.body.keywords
    };
    Clip.getClip({title: clipData.title}, function(err, clip) {
        if (err) return res.status(400).send(Result.ERROR(err));
        if (clip && clip._id) return res.status(400).send(Result.ERROR("이미 존재하는 clip 정보"));
        Clip.saveClip(clipData, function(err, doc) {
            res.status(200).send(Result.SUCCESS(doc));
        });
    });
};




ClipCtrl.deleteUserClips = function(req, res) {
    var criteria,errors;
    var user;
    if (!Session.hasSession(req)) return res.status(401).send(Result.ERROR('need login'));
    errors = req.validationErrors();
    console.log(errors);
    if (errors) return res.status(400).send(Result.ERROR(errors));
    criteria ={
        user: Session.getSessionId(req)
    };
    Clip.deleteClip(criteria,function(err,doc){
        res.status(200).send(Result.SUCCESS(doc));
    });

}

module.exports = ClipCtrl;
