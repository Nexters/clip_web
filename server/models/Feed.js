var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore'),
    log4js = require('log4js'),
    logger = log4js.getLogger('models/Feed'),
    async = require('async');

/**
 * Feed Schema
 */
var FeedSchema = new Schema({
    user: { type: String, required: true }, // 유저 ID
    title: { type: String, required: true }, // 피드 제목
    description: { type: String, required: true }, // 피드 내용
    link: { type: String, default: '' }, // 피드 링크
    source: { type: String, default: '' }, // 피드 출처
    categories: { type: Array, default: [] }, // 피드 카테고리
    keywords: { type: Array, default: [] }, // 피드 키워드
    hasKeyword: { type: Boolean, required: true }, // 피드가 키워드 포함하고 있는지 여부
    pubDate: { type: Date, required: true }, // 등록된 시간
    // 클라이언트로 내려주는 데이터를 위한 필드들
    keywordString: { type: String }, // 키워드 배열 스트링
    isCliped: { type: Boolean }, // 클립 여부
    clipTitle: { type: String } // 클립 타이틀
}, {collection: 'feed'});

FeedSchema.index({ user: 1 });
FeedSchema.index({ keyword: 1 });
FeedSchema.index({ pubDate: -1 });

function makeFeeds(feeds, clips) {
    var feedArray = [];
    if (!clips || !feeds) return;

    _.map(clips, function(clip){
        _.map(clip.feeds, function(feed) {
            if (feedArray.indexOf(feed) === -1) {
                feedArray.push(feed);
            }
        });
    });

    logger.debug("feedArray: ",feedArray);
    _.map(feeds, function(feed) {
        if (feedArray.indexOf(feed._id.toString()) > -1) {
            feed.isCliped = true;
        } else {
            feed.isCliped = false;
        }
        feed.keywordString = feed.keywords.join(', ');
    });
}

/**
 * Model Methods
 */

FeedSchema.statics.getFeeds = function(criteria, projection, options, callback) {
    var self = this;
    var feedIdArray;
    async.waterfall([
        function(callback) {
            self.find(criteria, projection, options, callback);
        },
        function(feeds, callback) {
            feedIdArray = _.map(feeds, function(item) { return item._id.toString() });
            logger.debug(feedIdArray);
            self.model('Clip').find({feeds:{$in: feedIdArray}}, function(err, clips) {
                if (err) return callback(err);
                logger.debug(clips);
                makeFeeds(feeds, clips);
                callback(null, feeds);
            });
        }
    ], function (err, feeds) {
        callback(err, feeds);
    });
};

FeedSchema.statics.saveFeed = function(doc, callback) {
    if (!doc) return;

    doc.pubDate = doc.pubDate ? doc.pubDate : new Date();
    this.create(doc, callback);
};

FeedSchema.statics.updateFeed = function(conditions, doc, callback) {
    if (!conditions || !doc) return;

    this.update(conditions, doc, callback);
};

FeedSchema.statics.deleteFeed = function(criteria, callback) {
    if (!criteria) return;

    this.remove(criteria, callback);
};


module.exports = mongoose.model('Feed', FeedSchema);