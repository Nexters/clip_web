var express = require('express');
var router = express.Router();

/* GET users listing. */
//router.get('/', function(req, res, next) {
  //  res.render('joinForm',{title:'가입 신청 '});
//});

router.get('/signin', function(req, res, next) {
    res.render('signin', { title: 'My World', name: 'Ji Yeon' });
});

router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'My World', name: 'Ji Yeon' });
});

router.post('/',function(req,res,next){
    console.log('req.body : '+req.body);

});

module.exports = router;