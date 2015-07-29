var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    async = require('async');

/**
 * Web Schema
 */
var WebSchema = new Schema({
    user: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, default: '' },
    feed: { type: String, default: '' },
    categories: { type: Array, default: [] },
    keyword: { type: Array, default: [] },
    hasKeyword: { type: Boolean, required: true },
    pubDate: { type: Date, required: true } // 등록된 시간
}, {collection: 'web'});

WebSchema.index({ user: 1, keyword: 1, pubDate: -1 });

/**
 * Model Methods
 */




module.exports = mongoose.model('Web', WebSchema);