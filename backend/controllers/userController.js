import path from "path";
import fileSystem from 'fs';
import {upload} from '../controllers/fileStorage.js';

const __dirname = path.resolve();

const userFile = fileSystem.readFileSync(__dirname + '/models/user.json', 'utf8');
const users = JSON.parse(userFile);
const user = users;

function validAccount(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    console.log(password);
    if(!email) {
        res.json({
            status: 400,
            message: 'required_email',
            data: null
        });
    } else {
        let check = -1;
        for(let i = 0; i < user.length; i++) {
            console.log(user[i].email);
            if(user[i].email === email && user[i].password === password) {
                check = i;
            }
        }
        if(check > -1) {
            res.json({
                status: 200,
                message: 'login_success',
                data: user[check]
            });
        } else {
            res.json({
                status: 401,
                message: 'invalid_email_or_password',
                data: null
            })
        }
    }
}

function signAccount(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const nickname = req.body.nickname;
    console.log(email);
    console.log(password);
    console.log(nickname);

    let userId = parseInt(user[user.length-1].user_id) + 1;
    
    const userData = {
        user_id: userId,
        email: email,
        password: password,
        nickname: nickname,
        profile_image_path: "000"
    };
    user.push(userData);
    const newUser = JSON.stringify(user);
    console.log(newUser);
    fileSystem.writeFileSync(__dirname + '/models/user.json', newUser,'utf8');
}
function uploadProfile(req, res) {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('File upload failed:', err);
            return res.status(500).json({ error: 'File upload failed.' });
        } else {
            console.log('File uploaded successfully:', req.file);
            return res.status(200).json({ message: 'File uploaded successfully.' });
        }
    });
}
//이미지파일업로드오류수정

export default {
    validAccount,
    signAccount,
    uploadProfile
};
