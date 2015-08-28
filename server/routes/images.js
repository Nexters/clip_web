var express = require('express');
var router = express.Router();
var imageCtrl = require('../controllers/Image');

/** GET Image **/
router.route('/:name').get(imageCtrl.getImage);

module.exports = router;
