const Order = require('../model/order');
require('dotenv').config();

exports.getAllOrdersData = async (req, res) => {
    try {
        console.log("getAllOrdersData");
        let userid = req.user._id;
        console.log('userid = ' + userid);

        let allOrderData = await Order.find({
            userId: userid,
            status: 'SUCCESSFUL'
        }).populate('charityId', 'name');

        console.log('allOrderData = ' + allOrderData);

        res.status(200).json({ message: 'success', allOrderData: allOrderData });
    }
    catch (err) {
        console.error('getAllOrdersData error:', err);
        res.status(500).json({ message: 'Failed to get all orders data' });
    }
}