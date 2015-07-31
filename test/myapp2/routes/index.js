var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'My World', name: 'Ji Yeon' });
});

router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'My World', name: 'Ji Yeon' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'My World', name: 'Ji Yeon' });
});


router.post('/signin',function(req,res,next){
  console.log('req.body : '+req.body);
  if(req.body.email=="test@naver.com"&&req.body.password=="testpw"){
    res.send("가입을 축하 합니다 ");
  }else{
    res.send("다시 입력해 주세요 ");

  }
});


router.post('/signup',function(req,res,next){
  console.log('req.body : '+req.body);
  if(req.body.name!==''&&req.body.age!==''&&req.body.email!==''&&req.body.password!==''){
    res.send('sucesss');
  }else{
    res.send('fail');
  }


});

module.exports = router;
