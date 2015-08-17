var mongoose = require('mongoose');
var Feed = mongoose.model('Feed');
var Result = require('../services/Result');
var log4js = require('log4js');
var logger = log4js.getLogger('controllers/Feed');
var async = require('async');
var Session = require('../services/Session');

function FeedCtrl() {

}

FeedCtrl.getMyFeeds = function(req, res) {
    var errors, criteria, options;
    if (!Session.hasSession(req)) return res.status(401).send(Result.ERROR('need login'));
    req.checkQuery('pageNum', 'Invalid pageNum').notEmpty();
    req.checkQuery('perPage', 'Invalid perPage').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    var criteria = { user: Session.getSessionId(req) };
    if (req.query.keyword) {
        criteria.keyword = req.query.keyword;
    }
    options = {
        skip: parseInt(req.query.pageNum) * parseInt(req.query.perPage),
        limit: parseInt(req.query.perPage),
        sort: { pubDate: -1 }
    };
    logger.debug("criteria: ", criteria);
    logger.debug("options: ", options);
    Feed.getFeeds(criteria, {}, options, function(err, docs) {
        res.status(200).send(Result.SUCCESS(docs));
    });
};

FeedCtrl.getUserFeeds = function(req, res) {
    var errors, criteria, options;
    req.checkParams('user', 'Invalid user').notEmpty();
    req.checkQuery('pageNum', 'Invalid pageNum').notEmpty();
    req.checkQuery('perPage', 'Invalid perPage').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    criteria = { user: req.params.user };
    options = {
        skip: parseInt(req.query.pageNum) * parseInt(req.query.perPage),
        limit: parseInt(req.query.perPage),
        sort: {pubDate: -1}
    };
    logger.debug("criteria: ", criteria);
    logger.debug("options: ", options);
    Feed.getFeeds(criteria, {}, options, function(err, docs) {
        res.status(200).send(Result.SUCCESS(docs));
    });
};

module.exports = FeedCtrl;
