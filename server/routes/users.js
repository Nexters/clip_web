var express = require('express');
var router = express.Router();
var log4js = require('log4js');
var logger = log4js.getLogger('routes/users');
var userCtrl = require('../controllers/User');

/* GET all users */
router.get('/all', userCtrl.getAllUsers);

/* GET user */
router.get('/id/:id', userCtrl.getUser);

/* POST save user */
router.post('/save', userCtrl.saveUser);

/* POST login user */
router.post('/login', userCtrl.loginUser);

module.exports = router;
