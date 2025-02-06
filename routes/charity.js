const express = require('express');
const auth = require('../middleware/auth');
const charityController = require('../controller/charity');

let router = express.Router();

//to post new charity rgistration
router.post('/register-charity', auth.authenticate, charityController.postAddnewCharity);
//to update charity data
router.put('/update-charity', auth.authenticate, charityController.updateCharity);
//to get a single charity
router.get('charity-data:id', auth.authenticate, charityController.getCharityData);
//get all charity data
router.get('charity-data', auth.authenticate, charityController.getAllCharityData);
//update charity record
router.put('/charity-update', auth.authenticate, charityController.updateCharity);

//filter charity by category
router.get('/get-charity-category/:categoryName', auth.authenticate, charityController.getCharityByCategory);
//filter charity by location
router.get('/get-charity-location/:locationName', auth.authenticate, charityController.getCharityByLocation);

module.exports = router;;
