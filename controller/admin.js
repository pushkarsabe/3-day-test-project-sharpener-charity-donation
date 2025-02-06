const Admin = require('../model/admin');
const User = require('../model/user');
const Charity = require('../model/charity');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postAddSignup = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const phoneNumber = req.body.phoneNumber;
        console.log('name = ' + name);
        console.log('email = ' + email);
        console.log('phoneNumber = ' + phoneNumber);
        console.log('password = ' + password);

        //to see if the user already exists
        const dataOfoneAdmin = await Admin.findOne({ where: { email: email } });
        console.log('dataOfoneAdmin = ' + JSON.stringify(dataOfoneAdmin));
        if (dataOfoneAdmin) {
            return res.status(400).json({ message: 'Email already exists' });
        } else {
            const saltrounds = 10;
            bcrypt.hash(password, saltrounds, async (err, hash) => {
                console.log('err = ' + err);
                console.log('hash = ' + hash);

                const newAdmin = await Admin.create({
                    name: name,
                    email: email,
                    phoneNumber: phoneNumber,
                    password: hash
                });
                console.log('newAdmin = ' + JSON.stringify(newAdmin));

                res.status(201).json({ newUserData: newAdmin, message: "New admin successfully signed in" });
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
        const admininputEmail = req.body.email;
        const admininputPassword = req.body.password;
        console.log('admininputEmail = ' + admininputEmail);
        console.log('admininputPassword = ' + admininputPassword);

        const particularAdmin = await Admin.findOne({ where: { email: admininputEmail } });
        console.log('particularAdmin = ' + JSON.stringify(particularAdmin));
        if (!particularAdmin) { // Check if the user exists
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        console.log('particularAdmin email = ' + particularAdmin.email);
        console.log('particularAdmin password = ' + particularAdmin.password);

        bcrypt.compare(admininputPassword, particularAdmin.password, (error, response) => {
            // console.log('response = ' + res                                  ponse);
            // console.log('error = ' + error);

            if (error) {
                console.log(err);
                return res.status(403).json({ message: 'Something went wrong' });
            }
            if (response) {

                return res.status(201).json({ adminDetails: particularAdmin, message: 'Successfully Logged In', token: generateWebToken(particularAdmin.id) });
            } else
                return res.status(401).json({ message: 'Password do not match' });
        });

    } catch (err) {
        console.log("error = ", err);
        res.status(500).json({ message: 'Failed to login admin' })
    }
}

function generateWebToken(id) {
    return jwt.sign({ userid: id }, 'secretkey');
}

exports.deleteUser = async (req, res) => {
    try {
        let userEmail = req.params.email;
        let singleUserData = await User.findAll({
            where: { email: userEmail }
        });
        if (!singleUserData) {
            return res.status(500).json({ message: 'user not found' });
        }
        await singleUserData.update({ isDeleleted: true });

        res.status(200).json({ message: 'User marked as deleted successfully', singleUserData: singleUserData });
    }
    catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ message: 'Failed to delete user' })
    }
}

exports.deleteCharity = async (req, res) => {
    try {
        let charityId = req.params.registrationId;
        let singleCharityData = await Charity.findAll({
            where: { uuid: charityId }
        });
        if (!singleCharityData) {
            return res.status(500).json({ message: 'charity not found' });
        }
        //update the column
        await singleCharityData.update({ isApproved: false });

        res.status(200).json({ message: 'Charity marked as deleted successfully', singleCharityData: singleCharityData });
    }
    catch (err) {
        console.error('Error fetching charity data:', err);
        res.status(500).json({ message: 'Failed to delete charity' });
    }
}