const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const adminControoller = require('../controller/admin');

router.post('/signup', adminController.postAddSignup);

router.post('/login', adminController.postLogin);

router.post('/manageUser-delete/:email', auth.authenticate, adminControoller.deleteUser);

router.post('/manageCharity-delete/:registrationId', auth.authenticate, adminControoller.deleteCharity);

module.exports = router;