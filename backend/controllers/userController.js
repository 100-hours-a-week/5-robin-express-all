const path = require("path");
const fileSystem = require('fs');
const { upload } = require('../controllers/fileStorage.js');
const { checkEmail, checkNickName, createUser, checkAccount, editUser, editPassword, delUser } = require('../models/userModel.js');
const __dpath = path.resolve();



async function validAccount(req, res) {
    const { email, password } = req.body;
    try {
        const accountExists = await checkAccount(email, password);
        if(!accountExists) {
            return res.status(401).json({message : '존재하지 않는 아이디입니다.'});
        }

        req.session.userId = accountExists.id;
        req.session.email = email;

        res.status(200).json({ message: '로그인 성공'});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

async function signAccount(req, res) {
    const {email, password, nickname, profilePath } = req.body;

    try {
        const emailExists = await checkEmail(email);
        const nicknameExists = await checkNickName(nickname);
        if(emailExists) {
            return res.status(409).json({message : '존재하는 이메일입니다.', type : "email" });
        }
        if(nicknameExists) {
            return res.status(409).json({message : '존재하는 닉네임입니다.', type : "nickname"});
        }
        const result = await createUser(email, password, nickname, profilePath);
        const userId = result.insertId;
        res.status(201).json({
            message: 'reg_success',
            data: {
                userId : userId,
            }
        });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
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
            res.status(201).json({
                message: filePath
            });
        }
    });
}

async function editAccount(req, res) {
    const { user_id, nickname, profilePath, check_img } = req.body;
    try {
        const nicknameExists = await checkNickName(nickname);
        if(nicknameExists) {
            return res.status(409).json({message : '존재하는 닉네임입니다.', type : "nickname"});
        }
        const result = await editUser(user_id ,nickname, profilePath, check_img);
        res.status(200).json({data: result});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
    
}

async function editPwd(req, res) {
    const { password } = req.body;
    const user_id = req.params.userId;
    console.log(user_id);
    try {
        const result = await editPassword(user_id , password);
        res.status(200).json({data: result});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

async function delAccount(req, res) {
    const user_id = req.params.userId;
    try {
        const result = await delUser(user_id);
        res.status(200).json({data: result});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}


module.exports = {
    validAccount,
    signAccount,
    uploadProfile,
    editAccount,
    editPwd,
    delAccount
};
