var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    async = require('async');

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
    choiceId: { type: String, required: true }, // 댓글 달려있는 선택 ID
    content: { type: String, required: true }, // 댓글 내용
    writer: { type: String, required: true }, // 작성한 유저 ID
    likeCount: { type: Number, default: 0 }, // 공감 카운트
    unlikeCount: { type: Number, default: 0 }, // 비공감 카운트
    likers: { type: Array, default: [] }, // 공감한 사람 전체 ID 배열
    unlikers: { type: Array, default: [] }, // 비공감한 사람 전체 ID 배열
    updateTime: { type: Date, required: true }, // 업데이트된 시간
    createTime: { type: Date, required: true }, // 생성 시간

    // 서버에서 만들어서 내려줘야 하는 필드들
    isWriter: { type: Boolean }, // 작성자인지 여부
    isAlreadyLike: { type: Boolean }, // 공감 여부
    isAlreadyUnlike: { type: Boolean } // 비공감 여부

}, {collection: 'comments'});

/**
 * Model Methods
 */

CommentSchema.statics.getComments = function (criteria, projection, options, callback) {

};

module.exports = mongoose.model('Comment', CommentSchema);