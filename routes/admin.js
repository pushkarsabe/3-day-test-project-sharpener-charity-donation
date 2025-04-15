const express = require('express');
const authAdmin = require('../middleware/authAdmin');

const router = express.Router();

const adminController = require('../controller/admin');

router.post('/signup', adminController.postAddSignup);

router.post('/login', adminController.postLogin);

//admin can delete user 
router.delete('/manageUser-delete/:userid', adminController.deleteUser);
//get a single user data
// router.get('/single-user-data/:userid', auth.authenticate, adminController.getUserData);
//get all user data
router.get('/userData', authAdmin, adminController.getAllUserData);


//to get a single charity
// router.get('/single-charity-data/:charityId', authAdmin, adminController.getCharityData);
//get all charity data
router.get('/charityData', authAdmin, adminController.getAllCharityData);

//admin can accept charity registration 
router.post('/manageCharity-accept/:registrationId', authAdmin, adminController.acceptCharity);

//admin can delete charity registration 
router.delete('/manageCharity-reject/:charityId', authAdmin, adminController.rejectCharity);

module.exports = router;