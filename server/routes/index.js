var express = require('express');
var router = express.Router();
var indexCtrl = require('../controllers/Index');
var userCtrl = require('../controllers/User');

/* GET index page. */
router.get('/', function(req, res) {
    var data = {};
    res.render('main.ejs', data);
});

/* GET user home page */
router.get('/home/:id', userCtrl.getHomePage);

/* GET user my page */
router.get('/user/:id', userCtrl.getUserPage);

module.exports = router;
