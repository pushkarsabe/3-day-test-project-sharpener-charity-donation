const express = require('express');
const authUser = require('../middleware/authUser');
const charityController = require('../controller/charity');

let router = express.Router();

//to post new charity rgistration
router.post('/register-charity', authUser, charityController.postAddnewCharity);
//to get a single charity
router.get('/single-charity-data/:charityId', authUser, charityController.getCharityData);
//get all charity data
router.get('/charity-data', authUser, charityController.getAllCharityData);
//update charity record
router.put('/update/:charityId', authUser, charityController.updateCharity);

//filter charity by category
router.get('/filter', authUser, charityController.getCharityByFilter);
//filter charity by location
router.get('/get-charity-location/:locationName', authUser, charityController.getCharityByLocation);


//to donate money to specific charity
router.post('/create-order', authUser, charityController.createOrder);
//to update the donation money for user and charity
router.post('/record-donation', authUser, charityController.updateDonationAmount);

module.exports = router;;
