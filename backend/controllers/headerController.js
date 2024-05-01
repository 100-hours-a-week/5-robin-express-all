const path = require("path");
const fileSystem = require('fs');
const { upload } = require('../controllers/fileStorage.js');

const __dpath = path.resolve();

const userFile = fileSystem.readFileSync(__dpath + '/models/user.json', 'utf8');
let users = JSON.parse(userFile);
const user = users;


function validheader(req, res) {
    const cookies = req.headers.cookie;
    const user = req.session.user;
    console.log(user);
    if(user) {
        res.status(201).json(user);
    } else {
        res.status(401).json({ success: false, message: 'user not authentication'});
    }
}

module.exports = {
    validheader
};