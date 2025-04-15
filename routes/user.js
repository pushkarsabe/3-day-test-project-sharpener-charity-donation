const express = require('express');
const authUser = require('../middleware/authUser');

const router = express.Router();

const userController = require('../controller/user');

router.post('/signup', userController.postAddSignup);

router.post('/login', userController.postLogin);

router.get('/user-data/:id', authUser, userController.getUserData);

router.get('/user-data', authUser, userController.getAllUerData);

router.put('/user-update', authUser, userController.updateUser);

module.exports = router;