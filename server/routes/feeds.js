var express = require('express');
var router = express.Router();
var feedCtrl = require('../controllers/Feed');

/* GET feeds */
router.get('/user', feedCtrl.getMyFeeds);

/* POST check feed */
router.post('/check', feedCtrl.checkFeed);


module.exports = router;
