var express = require('express');
var router = express.Router();
var indexCtrl = require('../controllers/Index');

/* GET home page. */
router.get('/', function(req, res) {
    var data = {};
    res.render('main.ejs', data);
});

module.exports = router;
