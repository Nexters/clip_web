var express = require('express');
var router = express.Router();
var indexCtrl = require('../controllers/Index');
var userCtrl = require('../controllers/User');


/* GET user home page */
router.get('/home/:id', userCtrl.getHomePage);

/* GET user my page */
router.get('/user/:id', userCtrl.getUserPage);


/* GET index page. */
router.get('/', function(req, res) {
    var data = {};
    res.render('main.ejs', data);
});

router.get('/data/test', function(req, res) {
    var data = {};
    console.log(req.query);
    res.send(req.query);

});

router.get('/signin', function(req, res, next) {
    res.render('signin', { title: 'My World', name: 'Ji Yeon' });
});

router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'My World', name: 'Ji Yeon' });
});


router.post('/test', function(req, res, netx) {
    console.log(req.body);
});

router.post('/test2', function(req, res, netx) {
    console.log(req.body);
});


module.exports = router;
