const express = require('express');
const router = express.Router();
const authUser = require('../middleware/authUser');
const purchaseController = require('../controller/purchase');

//to get all the orders data
router.get('/getOrderData', authUser, purchaseController.getAllOrdersData);

module.exports = router;