const express = require('express');
const router = express.Router();
const authUser = require('../middleware/authUser');
const purchaseController = require('../controller/purchase');

//to donate the money to the charity
router.post('/donate', authUser, purchaseController.donateMoney);

//update the order transaction status after the payment
router.post('/updatetransactionstatus', authUser, purchaseController.updateTransactionStatus);

//to get all the orders data
router.get('/getOrderData', authUser, purchaseController.getAllOrdersData);

module.exports = router;