const Charity = require('../model/charity');

exports.postAddnewCharity = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const phoneNumber = req.body.phoneNumber;
        const category = req.body.category;
        const beneficiary = req.body.beneficiary;
        const beneficiaryName = req.body.beneficiaryName;
        const relation = req.body.relation;
        const beneficiaryLocationState = req.body.beneficiaryLocationState;
        const beneficiaryLocationCity = req.body.beneficiaryLocationCity;
        const beneficiaryMobileNumber = req.body.beneficiaryMobileNumber;
        const funds = req.body.funds;
        const hospitalName = req.body.hospitalName;
        const hospitalLocationState = req.body.hospitalLocationState;
        const hospitalLocationCity = req.body.hospitalLocationCity;
        const medicalCondition = req.body.medicalCondition;
        const hospitalisationStatus = req.body.hospitalisationStatus;
        const date = req.body.date;
        const fundraiserName = req.body.fundraiserName;
        const storyForFundraising = req.body.storyForFundraising;

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

        const newCharity = await Charity.create({
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
            userId: req.userId
        });

        if (!newCharity) {
            return res.status(404).json({ message: 'charity not craeted' });
        }
        console.log("charity uuid = ", newCharity.uuid);//registration id

        res.status(500).json({ message: 'charity craeted', newCharity: newCharity })
    } catch (err) {
        console.log("post add charity error = ", err);
        res.status(500).json({
            error: err,
        })
    }
}

exports.getCharityData = async (req, res) => {
    try {
        let singleCharityData = await Charity.findAll({
            where: { userId: req.userid }
        });
        res.status(200).json({ message: 'success', singleCharityData: singleCharityData });
    }
    catch (err) {
        console.error('Error fetching charity data:', err);
        res.status(500).json({ message: 'Failed to get charity data' });
    }
}

exports.getAllCharityData = async (req, res) => {
    try {
        let allCharityData = await Charity.findAll();
        res.status(200).json({ message: 'success', allCharityData: allCharityData });
    }
    catch (err) {
        console.error('Error fetching all user data:', err);
        res.status(500).json({ message: 'Failed to get all charity data' });
    }
}

exports.updateCharity = async (req, res) => {
    try {
        const userid = req.userid;
        const { category, beneficiary, beneficiaryName, relation, funds, hospitalName, hospitalLocationState, hospitalLocationCity, medicalCondition, hospitalisationStatus, date, fundraiserName, storyForFundraising } = req.body;

        let charity = await Charity.findOne({ where: { id: userid } });

        if (!charity) {
            return res.status(404).json({ message: "charity not found" });
        }
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
        if (fundraiserName) upfundraiserNamedData.fundraiserName = fundraiserName;
        if (storyForFundraising) updatedData.storyForFundraising = storyForFundraising;

        await charity.update(updatedData);

        res.status(200).json({
            message: "charity updated successfully",
            charity: updatedData
        });
    }
    catch (err) {
        console.error('Error fetching charity data:', err);
        res.status(500).json({ message: 'An error occurred while updating charity data', error: err })
    }
}

exports.getCharityByCategory = async (req, res) => {
    try {
        let catgoryName = req.params.categoryName;
        let charityBylocation = await Charity.findAll({
            where: { category: catgoryName }
        });
        res.status(200).json({ message: 'success', charityBylocation: charityBylocation });
    }
    catch (err) {
        console.error('Error fetching charity data by location:', err);
        res.status(500).json({ message: 'Failed to get all charity data by location' });
    }
}

exports.getCharityByLocation = async (req, res) => {
    try {
        let charityLocation = req.params.locationName;
        let charityBylocation = await Charity.findAll({
            where: { beneficiaryLocationCity: charityLocation }
        });
        res.status(200).json({ message: 'success', charityByCategory: charityByCat });
    }
    catch (err) {
        console.error('Error fetching charity data by category:', err);
        res.status(500).json({ message: 'Failed to get all charity data by category' });
    }
}