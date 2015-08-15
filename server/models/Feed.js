var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore');
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
    isCliped: { type: Boolean }, // 클립 여부
    clipTitle: { type: String } // 클립 타이틀
}, {collection: 'feed'});

FeedSchema.index({ user: 1, keyword: 1, pubDate: -1 });

function makeFeeds(feeds, clips) {
    var clipMap = {};
    var i;
    if (!clips || !feeds) return;

    for (i=0; i<clips.length; i++) {
        clipMap[clips[i]._id] = clips[i];
    }

    for (i=0; i<feeds.length; i++) {
        if (clipMap[feeds[i]._id]) {
            feeds[i].isCliped = true;
            feeds[i].clipTitle = clipMap[feeds[i]._id].title;
        } else {
            feeds[i].isCliped = false;
        }
    }
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
            feedIdArray = _.pluck(feeds, '_id');
            self.model('Clip').find({_id:{$in: feedIdArray}}, function(err, clips) {
                if (err) return callback(err);
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