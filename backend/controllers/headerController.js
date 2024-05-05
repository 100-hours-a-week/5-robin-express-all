const path = require("path");
const fileSystem = require('fs');
const { upload } = require('../controllers/fileStorage.js');

const __dpath = path.resolve();




function validheader(req, res) {
    const userFile = fileSystem.readFileSync(__dpath + '/models/user.json', 'utf8');
    let users = JSON.parse(userFile);
    const user = users;
    const cookies = req.headers.cookie;
    const userId = req.session.user;
    
    let check = null;
    for(let i = 0; i < user.length; i++) {
        if(user[i].user_id == userId.user_id) {
            check = user[i];
        }
    }

    console.log(user);
    if(check) {
        res.status(201).json(check);
    } else {
        res.status(401).json({ success: false, message: 'user not authentication'});
    }
}

module.exports = {
    validheader
};