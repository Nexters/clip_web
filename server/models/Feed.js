var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    async = require('async');

/**
 * Feed Schema
 */
var FeedSchema = new Schema({
    user: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, default: '' },
    feed: { type: String, default: '' },
    categories: { type: Array, default: [] },
    keyword: { type: Array, default: [] },
    hasKeyword: { type: Boolean, required: true },
    pubDate: { type: Date, required: true } // 등록된 시간
}, {collection: 'feed'});

FeedSchema.index({ user: 1, keyword: 1, pubDate: -1 });

/**
 * Model Methods
 */

FeedSchema.statics.getFeeds = function(criteria, projection, options, callback) {
    if (arguments.length === 2) callback = projection;
    if (arguments.length === 3) callback = options;

    criteria = criteria || {};
    projection = (typeof projection === 'function') ? {} : projection;
    options = (typeof options === 'function') ? {} : options;

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