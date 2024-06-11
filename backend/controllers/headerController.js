const path = require("path");
const fileSystem = require('fs');
const { upload } = require('../controllers/fileStorage.js');
const { getUserAccount } = require('../models/userModel.js'); 

const __dpath = path.resolve();




async function validheader(req, res) {
    const { email } = req.session;
    try {
        const [getHeader]= await getUserAccount(email);
        console.log(getHeader)
        res.status(200).json({data: getHeader});
    } catch(err) {
        res.status(500).json({error : err.message});
    }
}

module.exports = {
    validheader
};