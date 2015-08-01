var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
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
    pubDate: { type: Date, required: true } // 등록된 시간
}, {collection: 'feed'});

FeedSchema.index({ user: 1, keyword: 1, pubDate: -1 });

/**
 * Model Methods
 */

FeedSchema.statics.getFeeds = function(criteria, projection, options, callback) {
    this.find(criteria, projection, options, callback);
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