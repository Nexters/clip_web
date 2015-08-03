var express = require('express');
var router = express.Router();
//var url = require("url");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CLIP' });
});

router.get('/bbangtle', function(req, res, next) {
  console.log(req.query);
  //var query = {name: req.query.name, test: req.query.test};

  //req.setEncoding("utf8");
  //res.writeHead(200, {"Content-Type": "text/html"});

  res.write('<p>' + req.query.name + '입니다' + '</p>' + '<br>');
  res.write('<p>' + req.query.test + '입니다' + '</p>' + '<br>');
  res.end();
})

module.exports = router;
