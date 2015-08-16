var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/User');


/* GET main page */
router.get('/', function(req, res, next) {
    if (req.session && req.session._id) {
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


router.get('/myclip', function(req, res, next) {
    res.render('myclip', { title: 'My World', name: 'Ji Yeon' });
});

module.exports = router;
