var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'KIMKIM', name: 'Hyunyoung'});
});

router.post('/join', function(req, res, next){
  console.log('req.body : ' + req.body);
});

module.exports = router;
