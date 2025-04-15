const Charity = require('../model/charity');
const Order = require('../model/order');
const User = require('../model/user');
const Razorpay = require('razorpay');
const sendEmail = require('../config/emailService');

exports.postAddnewCharity = async (req, res, next) => {
    try {
        const {
            name, email, phoneNumber, category,
            beneficiary, beneficiaryName, relation,
            beneficiaryLocationState, beneficiaryLocationCity, beneficiaryMobileNumber,
            funds, hospitalName, hospitalLocationState, hospitalLocationCity,
            medicalCondition, hospitalisationStatus, date,
            fundraiserName, storyForFundraising
        } = req.body;

        console.log('userId = ' + req.user._id);
        console.log('name = ' + name);
        console.log('email = ' + email);
        console.log('phoneNumber = ' + phoneNumber);
        console.log('category = ' + category);
        console.log('beneficiary = ' + beneficiary);
        console.log('beneficiaryName = ' + beneficiaryName);
        console.log('relation = ' + relation);
        console.log('beneficiaryLocationState = ' + beneficiaryLocationState);
        console.log('beneficiaryLocationCity = ' + beneficiaryLocationCity);
        console.log('beneficiaryMobileNumber = ' + beneficiaryMobileNumber);
        console.log('funds = ' + funds);
        console.log('hospitalName = ' + hospitalName);
        console.log('hospitalLocationState = ' + hospitalLocationState);
        console.log('hospitalLocationCity = ' + hospitalLocationCity);
        console.log('hospitalLocationState = ' + hospitalLocationState);
        console.log('medicalCondition = ' + medicalCondition);
        console.log('hospitalisationStatus = ' + hospitalisationStatus);
        console.log('date = ' + date);
        console.log('fundraiserName = ' + fundraiserName);
        console.log('storyForFundraising = ' + storyForFundraising);

        const newCharity = await Charity({
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            category: category,
            beneficiary: beneficiary,
            beneficiaryName: beneficiaryName,
            relation: relation,
            beneficiaryLocationState: beneficiaryLocationState,
            beneficiaryLocationCity: beneficiaryLocationCity,
            beneficiaryMobileNumber: beneficiaryMobileNumber,
            funds: funds,
            hospitalName: hospitalName,
            hospitalLocationState: hospitalLocationState,
            hospitalLocationCity: hospitalLocationCity,
            medicalCondition: medicalCondition,
            hospitalisationStatus: hospitalisationStatus,
            date: date,
            fundraiserName: fundraiserName,
            storyForFundraising: storyForFundraising,
            userId: req.user._id
        });

        await newCharity.save();

        if (!newCharity) {
            return res.status(404).json({ message: 'charity not created' });
        }
        console.log("charity uuid = ", newCharity.uuid);//registration id

        res.status(200).json({ message: 'charity created', newCharity: newCharity })
    } catch (err) {
        console.log("post add charity error = ", err);
        res.status(500).json({
            error: err,
        })
    }
}

exports.getCharityData = async (req, res) => {
    try {
        let charityId = req.params.charityId;
        console.log("getCharityData charityId = ", charityId);
        const charity = await Charity.findById(charityId);
        console.log("charity = ", charity);

        if (!charity) return res.status(404).json({ message: 'Charity not found' });

        res.status(200).json({ message: 'success', singleCharityData: charity });
    }
    catch (err) {
        console.error('getCharityData error:', err);
        res.status(500).json({ message: 'Failed to get charity data' });
    }
}

exports.getAllCharityData = async (req, res) => {
    try {
        console.log("getAllCharityData");
        let allCharityData = await Charity.find({ userId: req.user._id });
        // console.log('allCharityData = ' + allCharityData);

        res.status(200).json({ message: 'success', allCharityData: allCharityData });
    }
    catch (err) {
        console.error('getAllCharityData error:', err);
        res.status(500).json({ message: 'Failed to get all charity data' });
    }
}

exports.updateCharity = async (req, res) => {
    try {
        const charityId = req.params.charityId;
        console.log("updateCharity...charityId = ", charityId);
        const { category, beneficiary, beneficiaryName, relation, funds, hospitalName, hospitalLocationState, hospitalLocationCity, medicalCondition, hospitalisationStatus, date, fundraiserName, storyForFundraising } = req.body;
        console.log('category = ' + category);
        console.log('beneficiary = ' + beneficiary);
        console.log('beneficiaryName = ' + beneficiaryName);
        console.log('relation = ' + relation);
        console.log('funds = ' + funds);
        console.log('hospitalName = ' + hospitalName);
        console.log('hospitalLocationState = ' + hospitalLocationState);
        console.log('hospitalLocationCity = ' + hospitalLocationCity);
        console.log('medicalCondition = ' + medicalCondition);
        console.log('hospitalisationStatus = ' + hospitalisationStatus);
        console.log('date = ' + date);
        console.log('fundraiserName = ' + fundraiserName);
        console.log('storyForFundraising = ' + storyForFundraising);

        //update if the user sends the data
        const updatedData = {};
        if (category) updatedData.category = category;
        if (beneficiary) updatedData.beneficiary = beneficiary;
        if (beneficiaryName) updatedData.beneficiaryName = beneficiaryName;
        if (relation) updatedData.relation = relation;
        if (funds) updatedData.funds = funds;
        if (hospitalName) updatedData.hospitalName = hospitalName;
        if (hospitalLocationState) updatedData.hospitalLocationState = hospitalLocationState;
        if (hospitalLocationCity) updatedData.hospitalLocationCity = hospitalLocationCity;
        if (medicalCondition) updatedData.medicalCondition = medicalCondition;
        if (hospitalisationStatus) updatedData.hospitalisationStatus = hospitalisationStatus;
        if (date) updatedData.date = date;
        if (fundraiserName) updatedData.fundraiserName = fundraiserName;
        if (storyForFundraising) updatedData.storyForFundraising = storyForFundraising;

        const updatedCharity = await Charity.findByIdAndUpdate(charityId, updatedData, { new: true });

        if (!updatedCharity) {
            return res.status(404).json({ message: "Charity not found" });
        }

        res.status(200).json({
            message: "charity updated successfully",
            charity: updatedCharity
        });
    }
    catch (err) {
        console.error('updateCharity error:', err);
        res.status(500).json({ message: 'An error occurred while updating charity data', error: err })
    }
}

exports.getCharityByFilter = async (req, res) => {
    try {
        console.log("getCharityByFilter");
        const name = req.query.name?.trim();
        const location = req.query.location?.trim();
        const category = req.query.category?.trim();
        console.log('name = ' + name);
        console.log('location = ' + location);
        console.log('category = ' + category);

        let filter = {
            userId: req.user._id // assuming 'createdBy' stores the user ID
        };
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (location) {
            filter.beneficiaryLocationCity = { $regex: location, $options: 'i' };
        }
        if (category) {
            filter.category = { $regex: category, $options: 'i' };
        }
        console.error('filter:', filter);

        const charities = await Charity.find(filter);
        console.log('Filtered charities:', charities);

        res.status(200).json({ message: 'success', charityByFilter: charities });
    }
    catch (err) {
        console.error('getCharityByFilter error:', err);
        res.status(500).json({ message: 'Failed to get charity data by category' });
    }
}

exports.getCharityByLocation = async (req, res) => {
    try {
        let charityLocation = req.params.locationName;
        console.log("getCharityByLocation charityLocation = ", charityLocation);

        const charities = await Charity.find({ beneficiaryLocationCity: charityLocation });
        console.error('charities :', charities);

        res.status(200).json({ message: 'success', charityBylocation: charities });
    }
    catch (err) {
        console.error('getCharityByLocation error:', err);
        res.status(500).json({ message: 'Failed to get  charity data by location' });
    }
}

exports.createOrder = async (req, res) => {
    try {
        console.log("createOrder");

        const { amount, charityId } = req.body;
        console.log("amount = ", amount);
        console.log("charityId = ", charityId);

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const razorpayOrder = await instance.orders.create(options);
        console.log("razorpayOrder  = ", razorpayOrder);

        const newOrder = new Order({
            orderid: razorpayOrder.id,
            status: 'PENDING',
            userId: req.user._id,
            charityId: charityId
        })
        await newOrder.save();
        console.log("Order saved to DB:", newOrder);

        return res.status(200).json({
            message: "order created",
            order: razorpayOrder,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ message: "Failed to create order" });
    }
};


exports.updateDonationAmount = async (req, res) => {
    try {
        console.log("updateDonationAmount");

        const { amount, charityId, razorpayPaymentId, order_id } = req.body;
        let userId = req.user._id;
        console.log("userId = ", userId);
        console.log("amount = ", amount);
        console.log("charityId = ", charityId);
        console.log("razorpayPaymentId = ", razorpayPaymentId);
        console.log("order_id = ", order_id);

        // find order 
        let order = await Order.findOne({ orderid: order_id });
        console.log("before update order = ", order);
        if (!order) {
            return res.status(401).json({ message: "Order Does Not Exists" });
        }
        // 1. Update the order
        order.paymentid = razorpayPaymentId;
        order.status = "SUCCESSFUL";
        await order.save();
        console.log("after update order = ", order);

        // find charity 
        const charity = await Charity.findById(charityId);
        console.log("before update charity = ", charity);
        if (!charity) {
            return res.status(404).json({ message: "Charity not found" });
        }
        // 2. Update the charity
        let difference = parseFloat(charity.funds) - amount;
        charity.funds = difference.toString();
        charity.save();
        console.log("after update charity = ", charity);

        // 3. Update user donations
        const user = await User.findById(userId);
        console.log("before update user = ", user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let donationAddition = parseFloat(user.donations) + amount;
        user.donations = donationAddition;
        await user.save();
        console.log("after update user = ", user);

        //send email after the transaction is complete
        let email = user.email;
        console.log("email = ", email);
        console.log('amount :', amount);
        await sendEmail(email, amount);

        return res.status(200).json({ message: "Donation recorded successfully." });

    } catch (error) {
        console.error("updateDonationAmount error:", error);
        res.status(500).json({ message: "Failed to update order" });
    }
};
