var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    async = require('async');

/**
 * Clip Schema
 */
var ClipSchema = new Schema({
    user: { type: String, required: true }, // 유저 ID
    title: { type: String, required: true }, // 클립 제목
    feeds: { type: Array, default: [] }, // 클립에 포함된 피드 리스트 (ID)
    keywords: { type: Array, default: [] }, // 클립에 포함된 키워드 리스트
    createDate: { type: Date, required: true } // 등록된 시간
}, {collection: 'clip'});

ClipSchema.index({ user: 1, keyword: 1, pubDate: -1 });

/**
 * Model Methods
 */

ClipSchema.statics.getClips = function(criteria, projection, options, callback) {
    this.find(criteria, projection, options, callback);
};

ClipSchema.statics.saveClip = function(doc, callback) {
    if (!doc) return;

    doc.createDate = doc.createDate ? doc.createDate : new Date();
    this.create(doc, callback);
};

ClipSchema.statics.updateClip = function(conditions, doc, callback) {
    if (!conditions || !doc) return;

    this.update(conditions, doc, callback);
};

ClipSchema.statics.deleteClip = function(criteria, callback) {
    if (!criteria) return;

    this.remove(criteria, callback);
};


module.exports = mongoose.model('Clip', ClipSchema);