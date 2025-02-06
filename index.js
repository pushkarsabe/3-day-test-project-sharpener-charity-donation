const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const sequelize = require('./util/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const User = require('./model/user');
const Charity = require('./model/charity');
const Order = require('./model/order');

const userRoute = require('./routes/user');
const charityRoute = require('./routes/charity');
const purchaseRoute = require('./routes/purchase');
const adminRoute = require('./routes/admin');

app.use('/user', userRoute);
app.use('/charity', charityRoute);
app.use('/purchase', purchaseRoute);
app.use('/admin', adminRoute);

//foreign key mapping from user to charity
User.hasMany(Charity, { foreignKey: 'userId' });
//foreign key mapping user to order
User.hasMany(Order, { foreignKey: 'userId' });

// this will create tabble
sequelize
    .sync()
    .then(result => {
        // console.log(result);
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch(err => {
        console.log(err);
    });

