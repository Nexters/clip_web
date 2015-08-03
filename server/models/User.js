var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    async = require('async');

/**
 * User Schema
 */
var UserSchema = new Schema({
    email: { type: String, required: true }, // 이메일 주소
    pw: { type: String, required: true }, // 패스워드
    //authType: { type: String, required: true }, // 인증타입
    //authKey: { type: String, required: true }, // 인증키
    name: { type: String, required: true }, // 닉네임
    profileUrl: { type: String, default: '' }, // 프로필 이미지 주소
    feeds: { type: Array, default: [] }, // 추가한 사이트 목록
    keywords: { type: Array, default: [] }, // 추가한 키우드 목록
    createDate: { type: Date, required: true }, // 생성 시간
    lastFeedDate: { type: Date, default: new Date() } // 마지막으로 피드 가져온 시간
}, { collection: 'user' });

UserSchema.index({ name: 1 }, { unique: true });

/**
 * Model Methods
 */

UserSchema.statics.getUser = function(criteria, projection, options, callback) {
    this.findOne(criteria, projection, options, callback);
};

UserSchema.statics.getUsers = function(criteria, projection, options, callback) {
    this.find(criteria, projection, options, callback);
};

UserSchema.statics.saveUser = function(doc, callback) {
    if (!doc) return;

    doc.createDate = doc.createDate ? doc.createDate : new Date();
    this.create(doc, callback);
};

UserSchema.statics.updateUser = function(conditions, doc, callback) {
    if (!conditions || !doc) return;

    this.update(conditions, doc, callback);
};

UserSchema.statics.deleteUser = function(criteria, callback) {
    if (!criteria) return;

    this.remove(criteria, callback);
};


module.exports = mongoose.model('User', UserSchema);