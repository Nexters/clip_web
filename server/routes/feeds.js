var express = require('express');
var router = express.Router();
var feedCtrl = require('../controllers/Feed');

/* GET feeds */
router.get('/user/id/:user', feedCtrl.getUserFeeds);

module.exports = router;
