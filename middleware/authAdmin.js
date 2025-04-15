const Admin = require('../model/admin')
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log('inside auth token = ' + token);

        if (token == undefined) {
            return res.status(401).json({ message: 'Admin opened home page directly without login' });
        }
        const decodedToken = jwt.verify(token, 'secretkey');
        console.log('decodedToken = ', decodedToken);
        console.log('adminid = ', decodedToken.adminid);

        const admin = await Admin.findOne({ _id: decodedToken.adminid });
        console.log('admin object = ', admin);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        req.admin = admin;
        next();
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ success: false });
    }
}
