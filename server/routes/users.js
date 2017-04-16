var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/User');

/* GET user */
router.get('/id/:id', userCtrl.getUser);

/* POST save user */
router.post('/save', userCtrl.saveUser);

/* PUT update user */
router.put('/id/:id', userCtrl.updateUser);

/* POST login user */
router.post('/login', userCtrl.loginUser);

/* POST logout user */
router.post('/logout', userCtrl.logoutUser);

/* PUT lost password */
router.put('/lost/passwd/:email', userCtrl.resetPassword);

/* PUT default password */
router.put('/passwd/:email', userCtrl.defaultPassword);

module.exports = router;