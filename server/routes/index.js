var express = require('express');
var router = express.Router();
var indexCtrl = require('../controllers/Index');
var userCtrl = require('../controllers/User');

/* GET home page. */
router.get('/', function(req, res) {
    var data = {};
    res.render('main.ejs', data);
});

router.get('/:id', userCtrl.getUserPage);

module.exports = router;
