var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'My World', name: 'Ji Yeon' });
});

router.get('/signin', function(req, res, next) {
  res.render('index', { title: 'My World', name: 'Ji Yeon' });
});

router.get('/signup', function(req, res, next) {
  res.render('index2', { title: 'My World', name: 'Ji Yeon' });
});


router.post('/test', function(req, res, netx) {
  console.log(req.body);
});

router.post('/test2', function(req, res, netx) {
  console.log(req.body);
});

module.exports = router;
