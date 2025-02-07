const Signup = require('../model/user');
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
        const dataOfoneUser = await Signup.findOne({ where: { email: email } });
        console.log('dataOfoneUser = ' + JSON.stringify(dataOfoneUser));
        if (dataOfoneUser) {
            return res.status(400).json({ message: 'Email already exists' });
        } else {
            const saltrounds = 10;
            bcrypt.hash(password, saltrounds, async (err, hash) => {
                console.log('err = ' + err);
                console.log('hash = ' + hash);

                const newUser = await Signup.create({
                    name: name,
                    email: email,
                    phoneNumber: phoneNumber,
                    password: hash
                });
                console.log('newUser = ' + JSON.stringify(newUser));

                res.status(201).json({ newUserData: newUser, message: "New user successfully signed in" });
            })
        }

    } catch (err) {
        console.log("post sign up error user ", err);
        res.status(500).json({
            error: err,
        })
    }
}

exports.postLogin = async (req, res) => {
    try {
        const userinputEmail = req.body.email;
        const userinputPassword = req.body.password;
        console.log('userinputEmail = ' + userinputEmail);
        console.log('userinputPassword = ' + userinputPassword);

        const particularUser = await Signup.findOne({ where: { email: userinputEmail } });
        console.log('particularUser = ' + JSON.stringify(particularUser));
        if (!particularUser) { // Check if the user exists
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        console.log('particularUser email = ' + particularUser.email);
        console.log('particularUser password = ' + particularUser.password);

        bcrypt.compare(userinputPassword, particularUser.password, (error, response) => {
            // console.log('response = ' + res                                  ponse);
            // console.log('error = ' + error);

            if (error) {
                console.log(err);
                return res.status(403).json({ message: 'Something went wrong' });
            }
            if (response) {

                return res.status(201).json({ userDetails: particularUser, message: 'Successfully Logged In', token: generateWebToken(particularUser.id) });
            } else
                return res.status(401).json({ message: 'Password do not match' });
        });

    } catch (err) {
        console.log("error = ", err);
        res.status(500).json({ message: 'Failed to login' })
    }
}

function generateWebToken(id) {
    return jwt.sign({ userid: id }, 'secretkey');
}

exports.getUserData = async (req, res) => {
    try {
        let userid = req.params.id;
        let singleUserData = await Signup.findAll({
            where: { id: userid }
        });
        res.status(200).json({ message: 'success', singleUserData: singleUserData });
    }
    catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ message: 'Failed to get user data' })
    }
}

exports.getAllUerData = async (req, res) => {
    try {
        let allUserData = await Signup.findAll();
        res.status(200).json({ message: 'success', allUserData: allUserData });
    }
    catch (err) {
        console.error('Error fetching all user data:', err);
        res.status(500).json({ message: 'Failed to get all user data' })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const userid = req.user.id;
        console.log('updateUser userid = ', userid);
        const { dob, gender, passportnumber, pannumber } = req.body;

        let user = await Signup.findOne({ where: { id: userid } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //update if the user sends the data
        const updatedData = {};
        if (dob) updatedData.dob = dob;
        if (gender) updatedData.gender = gender;
        if (passportnumber) updatedData.passportnumber = passportnumber;
        if (pannumber) updatedData.pannumber = pannumber;

        await user.update(updatedData);

        res.status(200).json({
            message: "User updated successfully",
            user: updatedData
        });
    }
    catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ message: 'An error occurred while updating user data', error: err })
    }
}