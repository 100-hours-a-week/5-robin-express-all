import path from "path";
import fileSystem from 'fs';
const __dirname = path.resolve();

const userFile = fileSystem.readFileSync(__dirname + '/models/user.json', 'utf8');
const users = JSON.parse(userFile);
const user = users.data;

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

export default {
    validAccount
};
