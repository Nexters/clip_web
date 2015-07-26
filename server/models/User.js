var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    async = require('async');

/**
 * User Schema
 */
var UserSchema = new Schema({
    email: { type: String, required: true }, // 이메일 주소
    pw: { type: String, required: true }, // 패스워드
    authType: { type: String, required: true }, // 인증타입
    authKey: { type: String, required: true }, // 인증키
    name: { type: String, required: true }, // 닉네임
    profileUrl: { type: String, default: '' }, // 프로필 이미지 주소
    feed: { type: Array, default: [] }, // 추가한 사이트 목록
    keyword: { type: Array, default: [] }, // 추가한 키우드 목록
    createDate: { type: Date, required: true }, // 생성 시간
    lastFeedDate: { type: Date, default: new Date() } // 마지막으로 피드 가져온 시간
}, { collection: 'user' });

UserSchema.index({ name: 1 }, { unique: true });

/**
 * Model Methods
 */

UserSchema.statics.getUser = function (criteria, projection, options, callback) {
    criteria = criteria || {};
    projection = projection || {};
    options = options || {};
    this.find(criteria, projection, options, function(err, docs) {
        callback(err, docs);
    });
};

UserSchema.statics.saveUser = function (doc, callback) {
    if (!doc) {
        return;
    }
    doc.createTime = doc.createTime ? doc.createTime : new Date();

    this.create(doc, function(err, result) {
        callback(err, result);
    });
};



module.exports = mongoose.model('User', UserSchema);