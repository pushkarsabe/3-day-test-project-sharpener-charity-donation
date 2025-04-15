const Admin = require('../model/admin');
const User = require('../model/user');
const Charity = require('../model/charity');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postAddSignup = async (req, res, next) => {
    try {
        console.error("Admin postAddSignup called");

        const { name, email, password, phoneNumber } = req.body;
        console.log('name = ' + name);
        console.log('email = ' + email);
        console.log('phoneNumber = ' + phoneNumber);
        console.log('password = ' + password);

        //to see if the user already exists
        const existingAdmin = await Admin.findOne({ email });
        console.log('existingAdmin  = ' + existingAdmin);

        if (existingAdmin) {
            return res.status(400).json({ message: 'Email already exists' });
        } else {
            const saltrounds = 10;
            bcrypt.hash(password, saltrounds, async (err, hash) => {
                console.log('err = ' + err);
                console.log('hash = ' + hash);

                const newAdmin = await Admin({
                    name: name,
                    email: email,
                    phoneNumber: phoneNumber,
                    password: hash
                });
                newAdmin.save();
                console.log('newAdmin = ' + newAdmin);

                res.status(201).json({ existingAdmin: newAdmin, message: "New admin successfully signed in" });
            })
        }

    } catch (err) {
        console.log("post sign up error admin = ", err);
        res.status(500).json({
            error: err,
        })
    }
}//postAddSignup

exports.postLogin = async (req, res) => {
    try {
        console.error("Admin postLogin called");

        const { email, password } = req.body;
        console.log('admininputEmail = ' + email);
        console.log('admininputPassword = ' + password);

        const admin = await Admin.findOne({ email });
        // console.log('admin = ' + admin);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        console.log('isMatch = ' + isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: 'Password does not match' });
        }

        const token = generateWebToken(admin._id);
        console.log('token = ' + token);

        res.status(201).json({ adminDetails: admin, message: 'Successfully Logged In', token });

    } catch (err) {
        console.error("Admin login error:", err);
        res.status(500).json({ message: 'Failed to login admin' })
    }
}

function generateWebToken(id) {
    return jwt.sign({ adminid: id }, 'secretkey');
}

exports.getAllUserData = async (req, res) => {
    try {
        console.error("Admin getAllUserData called");

        const users = await User.find();

        res.status(200).json({ message: 'success', getAllUserData: users });
    }
    catch (err) {
        console.error('Error getAllUserData :', err);
        res.status(500).json({ message: 'Failed to get all user data' })
    }
}

exports.getUserData = async (req, res) => {
    try {
        console.error("Admin getUserData called");

        let userid = req.params.userid;
        console.log('userid = ' + userid);

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isDeleted = true;
        await user.save();

        res.status(200).json({ message: 'User marked as deleted successfully', singleUserData: user });
    }
    catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Failed to delete user' })
    }
}


exports.getAllCharityData = async (req, res) => {
    try {
        console.error("Admin getAllCharityData called");

        const charities = await Charity.find();

        res.status(200).json({ message: 'success', getAllCharityData: charities });
    }
    catch (err) {
        console.error('Error getAllCharityData :', err);
        res.status(500).json({ message: 'Failed to get charity' })
    }
}


exports.deleteUser = async (req, res) => {
    try {
        console.error("Admin deleteUser called");

        let userid = req.params.userid;
        console.log('deleteUser userid = ' + userid);

        const user = await User.findOneAndUpdate(
            { _id: userid },
            { isDeleted: true },
            { new: true }
        );
        console.log('user = ' + user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User marked as deleted successfully', singleUserData: user });
    }
    catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Failed to delete user' })
    }
}

exports.acceptCharity = async (req, res) => {
    try {
        console.error("Admin acceptCharity called");

        let charityId = req.params.registrationId;
        console.log('acceptCharity charityId = ', charityId);

        const charity = await Charity.findOne({ uuid: charityId });
        if (!charity) {
            return res.status(404).json({ message: 'Charity not found' });
        }

        //update the column
        charity.isApproved = true;
        await charity.save();

        res.status(200).json({ message: 'Charity accepted successfully', singleCharityData: charity });
    }
    catch (err) {
        console.error('Error accepting charity:', err);
        res.status(500).json({ message: 'Failed to accepte charity' });
    }
}//acceptCharity

exports.rejectCharity = async (req, res) => {
    try {
        console.error("Admin rejectCharity called");

        let charityId = req.params.charityId;
        console.log('charityId = ', charityId);

        const charity = await Charity.findOneAndUpdate(
            { _id: charityId },
            { isApproved: true },
            { new: true }
        );
        if (!charity) {
            return res.status(404).json({ message: 'Charity not found' });
        }

        res.status(200).json({ message: 'Charity rejected successfully', singleCharityData: charity });
    }
    catch (err) {
        console.error('Error deleting charity:', err);
        res.status(500).json({ message: 'Failed to delete charity' });
    }
}//acceptCharity