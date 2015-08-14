var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/User');

/* GET all users */
router.get('/test/all', userCtrl.getAllUsers);

/* GET user */
router.get('/id/:id', userCtrl.getUser);

/* POST save user */
router.post('/save', userCtrl.saveUser);

/* POST login user */
router.post('/login', userCtrl.loginUser);

/* PUT update user */
router.put('/id/:id', userCtrl.updateUser);


module.exports = router;

