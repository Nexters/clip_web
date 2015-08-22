var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore'),
    async = require('async');

/**
 * Clip Schema
 */
var ClipSchema = new Schema({
    user: { type: String, required: true }, // 유저 ID
    title: { type: String, required: true }, // 클립 제목
    feeds: { type: Array, default: [] }, // 클립에 포함된 피드 리스트
    createDate: { type: Date, required: true } // 등록된 시간
}, {collection: 'clip'});

ClipSchema.index({ user: 1 });
ClipSchema.index({ createDate: -1 });

/**
 * Model Methods
 */

ClipSchema.statics.getClip = function(criteria, projection, options, callback) {
    this.findOne(criteria, projection, options, callback);
};

ClipSchema.statics.getClips = function(criteria, projection, options, callback) {
    this.find(criteria, projection, options, callback);
};

ClipSchema.statics.saveClip = function(doc, callback) {
    if (!doc) return;

    doc.createDate = doc.createDate ? doc.createDate : new Date();
    this.create(doc, callback);
};

ClipSchema.statics.updateClip = function(conditions, doc, callback) {
    var self = this;
    if (!conditions || !doc) return;
    async.waterfall([
        function(callback) {
            self.findOne(conditions, function(err, clip) {
                callback(err, clip);
            });
        },
        function(clip, callback) {
            doc.feeds = _.union(clip.feeds, doc.feeds);
            self.update(conditions, doc, callback);
        }
    ], function (err, doc) {
        callback(err, doc);
    });
};

ClipSchema.statics.deleteClip = function(criteria, callback) {
    if (!criteria) return;

    //this.remove(criteria, callback);
    this.update(criteria, callback);
};


module.exports = mongoose.model('Clip', ClipSchema);