var mongoose = require('mongoose');
var Feed = mongoose.model('Feed');
var Result = require('../services/Result');
var log4js = require('log4js');
var logger = log4js.getLogger('controllers/Feed');
var async = require('async');
var Session = require('../services/Session');
var request = require('request');
var _ = require('underscore');

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
        criteria.keywords = req.query.keyword;
    }
    if (req.query.clipId) {
        criteria.clipId = req.query.clipId;
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

FeedCtrl.checkFeed = function(req, res) {
    var errors, url;
    req.checkBody('feed', 'Invalid feed').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    url = req.body.feed;

    // '/'로 끝나는 경우 제거
    if (url && url.match(/\/$/)) {
        url = url.replace(/\/$/,'');
    }
    // http:// 없는 URL 일 때
    if (url && !url.match(/^[a-zA-Z]+[:\/\/]/)) {
        url = 'http://' + url;
    }
    // URL 뒤에 rss 없는 경우 /rss 붙여서 rss 피드 존재하는 사이트인지 확인
    if (url && !url.match(/rss/)) {
        url = url + '/rss';
    }
    // URL에 feed 있는 경우
    if (url && url.match(/feed+[a-zA-Z0-9]/)) {
        url = url.replace('/rss','');
    }
    logger.debug(url);

    request.get(url, function (err, response, body) {
        var result = require('querystring').parse(body);
        logger.debug("result:", result);
        if (_.isEmpty(result)) {
            return res.status(400).send(Result.ERROR('Invalid feed'));
        }
        res.status(200).send(Result.SUCCESS(url));
    });
};

module.exports = FeedCtrl;
