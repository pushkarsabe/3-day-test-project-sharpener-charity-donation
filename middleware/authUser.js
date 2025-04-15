const jwt = require('jsonwebtoken');
let User = require('../model/user');

module.exports = async (req, res, next) => {
    try {
        console.log('userAuth called');

        const token = req.header('Authorization');

        if (token == undefined) {
            return res.status(401).json({ message: 'User opened home page directly without login' });
        }

        const decoded = jwt.verify(token, 'secretkey');
        console.log('userid = ', decoded.userid);

        const user = await User.findOne({ _id: decoded.userid });
        console.log('user object = ', user);

        if (!token) return res.status(401).json({ message: 'User token missing' });

        req.user = user;
        next();

    } catch (error) {
        console.error('User auth error:', error.message);
        res.status(401).json({ message: 'User authentication failed' });
    }
};
