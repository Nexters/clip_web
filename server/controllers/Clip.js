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
    var criteria,errors;
    req.checkParams('id', 'Invalid id').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    criteria ={_id: req.params.id}
    Clip.getClips(criteria,function(err,doc){
        res.status(200).send(Result.SUCCESS(doc));
    });

};

ClipCtrl.saveUserClips = function(req, res) {
    var errors, clipData;
    var title,feeds,keywords,user;

    req.checkBody('title', 'Invalid title').notEmpty();
    req.checkBody('feeds', 'Invalid feeds').notEmpty();
    req.checkBody('keywords', 'Invalid keywords').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    if (!Session.hasSession(req)) return res.status(401).send(Result.ERROR('need login'));
    console.log(user);
    console.log(title);
    console.log(feeds);
    console.log(keywords);
    clipData = {
        user: Session.getSessionId(req),
        title:req.body.title,
        feeds:req.body.feeds,
        keywords:req.body.keywords
    };
    Clip.getClips({title: clipData.title}, function(err, user) {
        if (err) res.status(400).send(Result.ERROR(err));
        if (user) res.status(400).send(Result.ERROR("이미 존재하는 clip정보"));
        Clip.saveClip(clipData, function(err, doc) {
            return res.status(200).send(Result.SUCCESS(doc));
        });
    });




}


module.exports = ClipCtrl;
