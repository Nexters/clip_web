var express = require('express');
var router = express.Router();
var clipCtrl = require('../controllers/Clip');

/* GET clips */
router.get('/user/id/:user', clipCtrl.getUserClips);

module.exports = router;
