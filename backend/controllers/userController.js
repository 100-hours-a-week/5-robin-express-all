const path = require("path");
const fileSystem = require('fs');
const { upload } = require('../controllers/fileStorage.js');

const __dpath = path.resolve();



function validAccount(req, res) {
    const userFile = fileSystem.readFileSync(__dpath + '/models/user.json', 'utf8');
    let users = JSON.parse(userFile);
    const user = users;
    const email = req.body.email;
    const password = req.body.password;
    if (!email) {
        res.json({
            status: 400,
            message: 'required_email',
            data: null
        });
    } else {
        let check = -1;
        for (let i = 0; i < user.length; i++) {
            console.log(user[i].email);
            if (user[i].email === email && user[i].password === password) {
                check = i;
            }
        }
        if (check > -1) {
            //세션디스트로이 로그인에서
            
            req.session.user = user[check];
            console.log(req.session.user);
            //res.cookie('sessionCookie', req.sessionID, { httpOnly: true });
            res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // 클라이언트 주소
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.json({
                status: 200,
                message: 'login_success',
                data: user[check]
            });
        } else {
            console.log('로그인 실패');
            res.status(401).json({
                status: 401,
                message: 'invalid_email_or_password',
                data: null
            })
        }
    }
}

function signAccount(req, res) {
    const userFile = fileSystem.readFileSync(__dpath + '/models/user.json', 'utf8');
    let users = JSON.parse(userFile);
    const user = users;
    const email = req.body.email;
    const password = req.body.password;
    const nickname = req.body.nickname;
    const profilePath = req.body.profilePath;

    console.log(profilePath);
    let userId = parseInt(user[user.length - 1].user_id) + 1;

    const userData = {
        user_id: userId,
        email: email,
        password: password,
        nickname: nickname,
        profile_image_path: profilePath
    };
    user.push(userData);
    const newUser = JSON.stringify(user);
    fileSystem.writeFileSync(__dpath + '/models/user.json', newUser, 'utf8');
    res.redirect('http://localhost:3000');
}

function uploadProfile(req, res) {
    console.log(req);
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('File upload failed:', err);
            return res.status(500).json({ error: 'File upload failed.' });
        } else {
            console.log('File uploaded successfully:', req.file);
            const filePath = req.file.path;
            console.log(filePath);
            res.json({
                message: filePath
            })
        }
    });
}

function editAccount(req, res) {
    const userFile = fileSystem.readFileSync(__dpath + '/models/user.json', 'utf8');
    let users = JSON.parse(userFile);
    const user = users;
    const user_id = req.body.user_id;
    const nickname = req.body.nickname;
    const profilePath = req.body.profilePath;
    const check_img = req.body.check_img;

    const edituser = [];
    if(check_img == '0') {
        console.log("keep img");
        for (let i = 0; i < user.length; i++) {
            if (user[i].user_id == user_id) {
                console.log(user_id+"유저 변경");
                const userData = {
                    user_id: user_id,
                    email: user[i].email,
                    password: user[i].password,
                    nickname: nickname,
                    profile_image_path: user[i].profile_image_path
                };
                req.session.user = userData;
                edituser.push(userData);
            } else {
                edituser.push(user[i]);
            }
        }
        const newUser = JSON.stringify(edituser);
        fileSystem.writeFileSync(__dpath + '/models/user.json', newUser, 'utf8');
        res.redirect('http://localhost:3000/users/'+user_id);
    } else {
        console.log("change img");
        for (let i = 0; i < user.length; i++) {
            if (user[i].user_id == user_id) {
                console.log(user_id+"유저 변경");
                const userData = {
                    user_id: user_id,
                    email: user[i].email,
                    password: user[i].password,
                    nickname: nickname,
                    profile_image_path: profilePath
                };
                edituser.push(userData);
            } else {
                edituser.push(user[i]);
            }
        }
        const newUser = JSON.stringify(edituser);
        fileSystem.writeFileSync(__dpath + '/models/user.json', newUser, 'utf8');
        res.redirect('http://localhost:3000/users/'+user_id);
    }
}

function editPwd(req, res) {
    const userFile = fileSystem.readFileSync(__dpath + '/models/user.json', 'utf8');
    let users = JSON.parse(userFile);
    const user = users;
    const user_id = req.body.user_id;
    const password = req.body.password;
    const editpwd = [];
    for(let i = 0; i < user.length; i++) {
        if(user[i].user_id == user_id) {
            const userData = {
                user_id: user_id,
                email: user[i].email,
                password: password,
                nickname: user[i].nickname,
                profile_image_path: user[i].profile_image_path
            };
            editpwd.push(userData);
        } else {
            editpwd.push(user[i]);
        }
    }
    const newUser = JSON.stringify(editpwd);
    fileSystem.writeFileSync(__dpath + '/models/user.json', newUser, 'utf8');
    res.status(200).json({message: "edit-password"});
}

function delAccount(req, res) {
    const userFile = fileSystem.readFileSync(__dpath + '/models/user.json', 'utf8');
    let users = JSON.parse(userFile);
    const user = users;
    const user_id = req.body.user_id;
    const deluser = [];
    for(let i = 0; i < user.length; i++) {
        if(user[i].user_id == user_id) {
            console.log(user_id+'삭제');
        } else {
            deluser.push(user[i]);
        }
    }
    const newUser = JSON.stringify(deluser);
    fileSystem.writeFileSync(__dpath + '/models/user.json', newUser, 'utf8');
    res.status(200).json({message: "del-password"});
}

module.exports = {
    validAccount,
    signAccount,
    uploadProfile,
    editAccount,
    editPwd,
    delAccount
};
