const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const adminControoller = require('../controller/admin');

router.post('/signup', adminController.postAddSignup);

router.post('/login', adminController.postLogin);

//admin can delete user 
router.post('/manageUser-delete/:email', auth.authenticate, adminControoller.deleteUser);

//admin can accept charity registration 
router.post('/manageCharity-accept/:registrationId', auth.authenticate, adminControoller.acceptCharity);

//admin can reject charity registration 
router.post('/manageCharity-reject/:registrationId', auth.authenticate, adminControoller.rejectCharity);

module.exports = router;