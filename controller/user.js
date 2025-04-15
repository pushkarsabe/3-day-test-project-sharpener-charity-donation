const Signup = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postAddSignup = async (req, res, next) => {
    try {
        console.log('postAddSignup called');
        const { name, email, password, phoneNumber } = req.body;
        console.log('name = ' + name);
        console.log('email = ' + email);
        console.log('phoneNumber = ' + phoneNumber);
        console.log('password = ' + password);

        //to see if the user already exists
        const dataOfoneUser = await Signup.findOne({ email });
        console.log('dataOfoneUser = ', dataOfoneUser);

        if (dataOfoneUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const saltOrRounds = 10;
        bcrypt.hash(password, saltOrRounds, async (err, hash) => {
            if (err) {
                console.log('hashing error = ', err);
                return res.status(501).json({ message: 'Error hashing password' });
            }

            const newUser = new Signup({
                name,
                email,
                phoneNumber,
                password: hash
            });

            await newUser.save();
            res.status(201).json({ newUserData: newUser, message: "New user successfully signed in" });
        })

    } catch (err) {
        console.log("post sign up error user ", err);
        res.status(500).json({
            error: err,
        })
    }
}

exports.postLogin = async (req, res) => {
    try {
        console.log('postLogin called');
        const { email, password } = req.body;
        console.log('email = ', email);
        console.log('password = ', password);

        const user = await Signup.findOne({ email });
        console.log('user = ', user);
        if (!user) { // Check if the user exists
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.isDeleted) {
            return res.status(402).json({ message: "Account is deleted" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password does not match' });
        }
        const token = generateWebToken(user._id, user.name);
        console.log('token = ', token);

        res.status(201).json({ userDetails: user, message: 'Successfully Logged In', token });

    } catch (err) {
        console.log("error = ", err);
        res.status(500).json({ message: 'Failed to login' })
    }
}

function generateWebToken(id, name) {
    return jwt.sign({ userid: id, username: name }, 'secretkey');
}

exports.getUserData = async (req, res) => {
    try {
        let userid = req.params.id;
        console.log('getUserData called userid', userid);

        let singleUserData = await Signup.findOne({ _id: userid });

        if (!singleUserData) return res.status(404).json({ message: 'User not found' });
        console.log('singleUserData = ', singleUserData);

        res.status(200).json({ message: 'success', singleUserData: singleUserData });
    }
    catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ message: 'Failed to get user data' })
    }
}

exports.getAllUerData = async (req, res) => {
    try {
        console.log('user getAllUerData called');

        let allUserData = await Signup.find({ isDeleted: false });
        console.log('allUserData = ', allUserData);

        if (!allUserData) {
            return res.status(400).json({ message: 'Failed to fetch all user data' });
        }
        res.status(200).json({ message: 'success', allUserData: allUserData });
    }
    catch (err) {
        console.error('Error fetching all user data:', err);
        res.status(500).json({ message: 'Failed to get all user data' })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const userid = req.user._id;
        console.log('updateUser userid = ', userid);
        const { name, email, phoneNumber, gender } = req.body;
        console.log('name = ' + name);
        console.log('email = ' + email);
        console.log('phoneNumber = ' + phoneNumber);

        const updatedData = {};
        if (name) updatedData.name = name;
        if (email) updatedData.email = email;
        if (phoneNumber) updatedData.phoneNumber = phoneNumber;

        let updatedUser = await Signup.findByIdAndUpdate(userid, updatedData, { new: true });

        res.status(200).json({
            message: "User updated successfully",
            updatedUser: updatedUser
        });
    }
    catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ message: 'An error occurred while updating user data', error: err })
    }
}