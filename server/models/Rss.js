var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    async = require('async');

/**
 * Rss Schema
 */
var RssSchema = new Schema({
    title: { type: String, default: '' }, // RSS 제목
    url: { type: String, required: true }, // RSS URL
    description: { type: String, required: true }, // RSS 설명
    keywords: { type: Array, default: [] }, // RSS 관련 키워드
}, { collection: 'rss' });

RssSchema.index({ name: 1 }, { unique: true });

/**
 * Model Methods
 */


module.exports = mongoose.model('Rss', RssSchema);