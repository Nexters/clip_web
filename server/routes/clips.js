var express = require('express');
var router = express.Router();
var clipCtrl = require('../controllers/Clip');

/* GET clips */
router.get('/user/id/:user', clipCtrl.getUserClips);

/* POST clips */
router.post('/save', clipCtrl.saveUserClip);

/* PUT clips */
router.put('/update/id/:id', clipCtrl.updateUserClip);

module.exports = router;
