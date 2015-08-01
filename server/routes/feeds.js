var express = require('express');
var router = express.Router();
var log4js = require('log4js');
var logger = log4js.getLogger('routes/feeds');
var feedCtrl = require('../controllers/Feed');

/* GET feeds */
router.get('/user/:user', feedCtrl.getUserFeeds);

module.exports = router;
