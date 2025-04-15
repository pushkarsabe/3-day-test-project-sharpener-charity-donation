const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./util/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userRoute = require('./routes/user');
const charityRoute = require('./routes/charity');
const purchaseRoute = require('./routes/purchase');
const adminRoute = require('./routes/admin');

app.use('/user', userRoute);
app.use('/charity', charityRoute);
app.use('/purchase', purchaseRoute);
app.use('/admin', adminRoute);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
};

startServer();