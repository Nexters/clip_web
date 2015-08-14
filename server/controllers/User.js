var mongoose = require('mongoose');
var User = mongoose.model('User');
var Result = require('../services/Result');
var async = require('async');

function UserCtrl() {

}

UserCtrl.getAllUsers = function(req, res) {
    var errors;
    req.checkQuery('test', 'Must be true').isIn(["true"]);
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    User.getUsers({}, function(err, docs) {
       res.status(200).send(Result.SUCCESS(docs));
    });
};

UserCtrl.getUser = function(req, res) {
    var errors, criteria;
    req.checkParams('id', 'Invalid id').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    criteria = { _id: req.params.id };
    User.getUser(criteria, function(err, doc) {
        res.status(200).send(Result.SUCCESS(doc));
    });
};

UserCtrl.saveUser = function(req, res) {
    var errors, userData;
    var email,pw,pw2,name;
    req.checkBody('email', 'Invalid email').isEmail();
    req.checkBody('pw', 'Invalid pw').notEmpty();
    req.checkBody('pw2', 'Invalid pw2').notEmpty();
    req.checkBody('name', 'Invalid name').notEmpty();
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));
    userData = {
        email: req.body.email,
        pw: req.body.pw,
        name: req.body.name
    };

    console.log(userData.email);
    console.log(userData.pw);
    console.log(userData.name);

    User.saveUser(userData, function(err, doc) {
        doc.email=userData.email;
        doc.pw=userData.pw;
        doc.name=userData.name;


        res.status(200).send(Result.SUCCESS(doc));
    });
};

UserCtrl.loginUser = function(req, res) {
    // POST
    // email, pw
    //
    // email로 criteria 만들어서 해당 email을 가진 유저 존재하는지 확인하고
    // 존재안하면 fail 리턴. 존재하면 pw가 넘겨받은 pw랑 같은지 확인해서 같으면 success, 다르면 fail
    // TODO: 과제1 로그인 여기에 구현해야 함

    var errors, criteria;
    req.checkBody('email', 'Invalid email').notEmpty();
    req.checkBody('pw', 'Invalid pass word').notEmpty();

    console.log(req.body);

    errors = req.validationErrors();
    if(errors) return res.status(400).send(Result.ERROR(errors));
    criteria = {email: req.body.email};
    console.log(criteria)

    User.getUser(criteria, function(err,doc) {
        console.log(doc);
        if (doc === null){
            console.log('fail');
            return res.status(403).send(Result.ERROR('fail'));
        }
        if(criteria.email === doc.email && req.body.pw === doc.pw){
            console.log('success');
            return res.status(200).send(Result.SUCCESS('success'));
        } else {
            console.log('fail');
            return res.status(400).send(Result.ERROR('fail'));
        }
    });
};
UserCtrl.updateUser = function(req, res) {
    // PUT
    // id <- params, 업데이트 되는 필드 데이터 <- req.body
    // 업데이트 가능한 필드: feeds, keywords, name, profileUrl, pw
    // TODO: 과제2 유저 정보 업데이트하는 부분 여기에 구현해야 함
console.log(req.body.name);
    var errors, conditions;
    req.checkParams('id', 'Invalid id').notEmpty();

    console.log(req.params);

    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));

    conditions = {
        _id: req.params.id,
        feeds: req.body.feeds,
        keywords: req.body.keywords,
        name: req.body.name,
        profileUrl: req.body.profileUrl,
        pw: req.body.pw
    };
    console.log(conditions);
    User.updateUser(conditions, function(err, doc) {
        console.log(doc);
        if (doc === null){
            console.log('fail');
            return res.status(403).send(Result.ERROR('fail'));
        }


        if (conditions._id !== null){ // null이 아니면 다음 if문으로 넘어감
        }else{
            return res.status(403).send(Result.ERROR('fail'));
        }


        if(conditions.feeds !== null){ //입력된 값이 null이 아닐때만 교체
            console.log('feeds is updated');
            doc.feeds = conditions.feeds;
        }else{

            doc.feeds=doc.feeds;
        }

        if(conditions.keywords !== null){ //입력된 값이 null이 아닐때만 교체
            console.log('keywords is updated');
            doc.keywords = conditions.keywords;
        }else{

            doc.keywords=doc.keywords;
        }

        if(conditions.name !== null){ //입력된 값이 null이 아닐때만 교체
            console.log('name is updated');
            doc.name = conditions.name;
        }else{

            doc.name=doc.name;
        }

        if(conditions.profileUrl !== null){ //입력된 값이 null이 아닐때만 교체
            console.log('profileUrl is updated');
            doc.profileUrl = conditions.profileUrl;
        }else{

            doc.profileUrl=doc.profileUrl;
        }
        if(conditions.pw !== null){ //입력된 값이 null이 아닐때만 교체
            doc.pw = conditions.pw;
            console.log('password is updated');
            console.log('update success');
            return res.status(200).send(Result.SUCCESS('success'));
        }else{
            doc.pw = doc.pw;
            console.log('update success');
            return res.status(200).send(Result.SUCCESS('success'));
        }
    })
};


UserCtrl.updateUser = function(req, res) {
    // PUT
    // id <- params, 업데이트 되는 필드 데이터 <- req.body
    // 업데이트 가능한 필드: feeds, keywords, name, profileUrl, pw
    // TODO: 과제2 유저 정보 업데이트하는 부분 여기에 구현해야 함

    var errors, conditions;

    var feeds,name,keywords,profileUrl,pw;

    req.checkParams('id', 'Invalid id').notEmpty();
    console.log(req.params);
    errors = req.validationErrors();
    if (errors) return res.status(400).send(Result.ERROR(errors));

    conditions = {
        _id: req.params.id,

    };


    User.updateUser(conditions,
        {feeds:req.body.feeds,name:req.body.name,keywords:req.body.keywords,profileUrl:req.body.profileUrl,pw:req.body.pw},
        function(err, doc) {

        if (!doc){
            console.log('fail');
            console.log('바꿀 정보가 없습니다 ');
            return res.status(403).send(Result.ERROR('fail'));
        }//id관련 정보가 없을경우


        if (!conditions._id){
            return res.status(403).send(Result.ERROR('fail'));
        }
            //바꿀 id를 입력하지않으면 에러 처리

        if(!feeds){
            doc.feeds=doc.feeds;
            //feeds에 바꿀정보를 입력하지않으면 그대로 값을 유지
        }else {
            doc.feeds = feeds;
            console.log("feeds update");
            //feeds에 바꿀정보를 입력하면  feeds를 새로운 값으로 변경
        }

            if(!name){
                doc.name=doc.name;
                //name에 바꿀정보를 입력하지않으면 그대로 값을 유지
            }else{
                doc.name=name;
                console.log("name update");
                //name에 바꿀정보를 입력하면  name를 새로운 값으로 변경
            }

            if(!keywords){
                doc.keywords=doc.keywords;
                //keywords에 바꿀정보를 입력하지않으면 그대로 값을 유지
            }else{
                doc.keywords=keywords;
                console.log("keywords update");
                //keywords에 바꿀정보를 입력하면 keywords를 새로운 값으로 변경
            }

            if(!profileUrl){
                doc.profileUrl=doc.profileUrl;

                //profileUrl에 바꿀정보를 입력하지않으면 그대로 값을 유지
            }else{
                doc.profileUrl=profileUrl;
                console.log("profileUrl update");
                //profileUrl에 바꿀정보를 입력하면 profileUrl를 새로운 값으로 변경
            }

            if(!pw){
                doc.pw=doc.pw;
                //profileUrl에 바꿀정보를 입력하지않으면 그대로 값을 유지
            }else{
                doc.pw=pw;
                console.log("pw update");
                //profileUrl에 바꿀정보를 입력하면 profileUrl를 새로운 값으로 변경
            }


        })
};

module.exports = UserCtrl;
