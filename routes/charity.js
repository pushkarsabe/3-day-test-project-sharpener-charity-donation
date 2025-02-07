const express = require('express');
const auth = require('../middleware/auth');
const charityController = require('../controller/charity');

let router = express.Router();

//to post new charity rgistration
router.post('/register-charity', auth.authenticate, charityController.postAddnewCharity);
//to get a single charity
router.get('/single-charity-data/:id', auth.authenticate, charityController.getCharityData);
//get all charity data
router.get('/charity-data', auth.authenticate, charityController.getAllCharityData);
//update charity record
router.put('/charity-update/:id', auth.authenticate, charityController.updateCharity);

//filter charity by category
router.get('/get-charity-category/:categoryName', auth.authenticate, charityController.getCharityByCategory);
//filter charity by location
router.get('/get-charity-location/:locationName', auth.authenticate, charityController.getCharityByLocation);

module.exports = router;;
