const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const userController = require('../controller/user');

router.post('/signup', userController.postAddSignup);

router.post('/login', userController.postLogin);

router.get('user-data/:id', auth.authenticate, userController.getUserData);

router.get('user-data', auth.authenticate, userController.getAllUerData);

router.put('/user-update', auth.authenticate, userController.updateUser);

module.exports = router;