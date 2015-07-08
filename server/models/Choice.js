var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    async = require('async');

/**
 * Choice Schema
 */
var ChoiceSchema = new Schema({
    title: { type: String, required: true }, // 제목
    description: { type: String, default: '' }, // 설명
    category: { type: Number, required: true }, // 1: 먹기, 2: 입기, 3: 놀기, 4: 쉬기, 5: 기타
    item1: {  // 항목1 정보
        name: String, // 항목 이름
        image: String, // 이미지 URL
        voters: Array // 투표한 사람 ID 배열
    },
    item2: {  // 항목2 정보
        name: String, // 항목 이름
        image: String, // 이미지 URL
        voters: Array // 투표한 사람 ID 배열
    },
    item3: {  // 항목3 정보 (Optional)
        name: String, // 항목 이름
        image: String, // 이미지 URL
        voters: Array // 투표한 사람 ID 배열
    },
    finalResult: { type: String }, // 최종 선택한 결과 (item1 or item2 or item3)
    voters: { type: Array, default: [] }, // 투표한 사람 전체 ID 배열
    writer: { type: String, required: true }, // 작성한 유저 ID
    updateTime: { type: Date, required: true }, // 업데이트된 시간
    createTime: { type: Date, required: true }, // 생성 시간

    // 서버에서 만들어서 내려줘야 하는 필드들
    isWriter: { type: Boolean }, // 작성자인지 여부
    isAlreadyVote: { type: Boolean } // 투표 여부 (true: 이미 투표, false: 투표 안함)

}, {collection: 'choices'});

/**
 * Model Methods
 */

ChoiceSchema.statics.getChoices = function (criteria, projection, options, callback) {

};

module.exports = mongoose.model('Choice', ChoiceSchema);