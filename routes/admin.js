const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const adminController = require('../controller/admin');

router.post('/signup', adminController.postAddSignup);

router.post('/login', adminController.postLogin);

//admin can delete user 
router.post('/manageUser-delete/:email', auth.authenticate, adminController.deleteUser);

//admin can accept charity registration 
router.post('/manageCharity-accept/:registrationId', auth.authenticate, adminController.acceptCharity);

//admin can reject charity registration 
router.post('/manageCharity-reject/:registrationId', auth.authenticate, adminController.rejectCharity);

module.exports = router;