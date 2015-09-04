var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/User');
var Session = require('../services/Session');

/* GET main page */
router.get('/', function(req, res, next) {
    if (Session.hasSession(req)) {
        res.redirect('/home');
    } else {
        res.redirect('/signin');
    }
});

/* GET signin page */
router.get('/signin', function(req, res, next) {
    res.render('signin');
});

/* GET signup page */
router.get('/signup', function(req, res, next) {
    res.render('signup');
});

/* GET user home page */
router.get('/home', userCtrl.getHomePage);

/* GET user my page */
router.get('/user', userCtrl.getUserPage);


module.exports = router;
