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
    var errors, clipData, title;
    if (!Session.hasSession(req)) return res.status(401).send(Result.ERROR('need login'));

    req.checkBody('title', 'Invalid title').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    clipData = {
        user: Session.getSessionId(req),
        title:req.body.title
    };
    Clip.getClip({title: clipData.title}, function(err, clip) {
        if (err) return res.status(400).send(Result.ERROR(err));
        if (clip && clip._id) return res.status(400).send(Result.ERROR("이미 존재하는 clip 정보"));
        Clip.saveClip(clipData, function(err, doc) {
            res.status(200).send(Result.SUCCESS(doc));
        });
    });
};

ClipCtrl.updateUserClip = function(req, res) {
    var errors, conditions, updateData;
    if (!Session.hasSession(req)) return res.status(401).send(Result.ERROR('need login'));
    req.checkParams('id', 'Invalid id').notEmpty();
    req.checkBody('feeds', 'Invalid feeds').notEmpty();
    req.checkBody('boardImageUrl', 'Invalid boardImageUrl').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    conditions = { _id: req.params.id };
    updateData = {
        feeds: req.body.feeds,
        boardImageUrl: req.body.boardImageUrl
    };
    Clip.updateClip(conditions, updateData, function(err, clips) {
        if (err) return res.status(400).send(Result.ERROR(err));
        res.status(200).send(Result.SUCCESS(clips));
    });
};

ClipCtrl.deleteUserClips = function(req, res) {
    var criteria,errors;
    if (!Session.hasSession(req)) return res.status(401).send(Result.ERROR('need login'));
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    criteria ={
        _id: ObjectId(Session.getSessionId(req)),
        $pull:{feeds:req.body.feeds}
    };
    Clip.deleteClip(criteria,function(err,doc){
        res.status(200).send(Result.SUCCESS(doc));
    });

}

ClipCtrl.deleteUserClipsAll = function(req, res) {
    var criteria,errors;
    if (!Session.hasSession(req)) return res.status(401).send(Result.ERROR('need login'));
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    criteria ={
        user: Session.getSessionId(req)
    };
    Clip.deleteClipAll(criteria,function(req, doc){
        res.status(200).send(Result.SUCCESS(doc));
    });
}

module.exports = ClipCtrl;
