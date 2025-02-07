const User = require('../model/user')
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log('inside auth token = ' + token);

        if (token == undefined) {
            return res.status(401).json({ message: 'User opened home page directly without login' });
        }
        const decodedToken = jwt.verify(token, 'secretkey');
        console.log('userid = ' + decodedToken.userid);
        const user = await User.findByPk(decodedToken.userid);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('user object = ' + JSON.stringify(user));
        req.user = user;
        next();
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ success: false });
    }
}

module.exports = {
    authenticate
};