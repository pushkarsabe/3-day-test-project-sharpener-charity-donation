const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const purchaseController = require('../controller/purchase');

//to donate the money to the charity
router.post('/donate', auth.authenticate, purchaseController.donateMoney);

//update the order transaction status after the payment
router.post('/updatetransactionstatus', auth.authenticate, purchaseController.updateTransactionstatus);

//send email to client
router.get('/sendEmail', purchaseController.sendEmail);

module.exports = router;