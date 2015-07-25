var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    async = require('async');

/**
 * Web Schema
 */
var WebSchema = new Schema({
    title: { type: String, default: '' },
    content: { type: String, required: true },
    link: { type: String, default: '' },
    source: { type: String, default: '' },
    keyword: { type: Array, default: [] },	// 1:male, 2:female
    createTime: { type: Date, required: true } //생성 시간
}, {collection: 'web'});

WebSchema.index({ keyword: 1, createTime: -1 });

/**
 * Model Methods
 */




module.exports = mongoose.model('Web', WebSchema);