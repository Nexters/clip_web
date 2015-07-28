var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    async = require('async');

/**
 * Web Schema
 */
var WebSchema = new Schema({
    user: { type: String, required: true },
    title: { type: String, default: '' },
    description: { type: String, required: true },
    link: { type: String, default: '' },
    feed: { type: String, default: '' },
    categories: { type: Array, default: [] },
    keyword: { type: Array, default: [] },  // TODO: 현재 사용안함. 향후 ngram 등 다른 방안 도입해야함!
    pubDate: { type: Date, required: true } // 등록된 시간
}, {collection: 'web'});

WebSchema.index({ keyword: 1, pubDate: -1 });

/**
 * Model Methods
 */




module.exports = mongoose.model('Web', WebSchema);