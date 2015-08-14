var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/User');

/* GET user home page */
router.get('/home/:id', userCtrl.getHomePage);

/* GET user my page */
router.get('/user/:id', userCtrl.getUserPage);


router.get('/signin', function(req, res, next) {
    res.render('signin', { title: 'My World', name: 'Ji Yeon' });
});
router.get('/myclip', function(req, res, next) {
    res.render('myclip', { title: 'My World', name: 'Ji Yeon' });
});
router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'My World', name: 'Ji Yeon' });
});

module.exports = router;
