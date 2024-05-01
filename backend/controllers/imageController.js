const path = require("path");
const fileSystem = require('fs');


const __dpath = path.resolve();

const userFile = fileSystem.readFileSync(__dpath + '/models/user.json', 'utf8');
const users = JSON.parse(userFile);
const user = users;

function imageView(req, res) {
    const filename = req.params.postId;
    console.log(filename);
    res.sendFile(__dpath + '/public/userImg/'+ filename);
}



//이미지파일업로드오류수정

module.exports = {
    imageView
};