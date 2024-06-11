const pool = require('../config/db');

class UserModel {
    static async createUser(email, password, nickname, profilePath) {
        const query = `INSERT INTO users (email, pwd, nickname, profile_path) values (?, ? ,?, ?)`;
        const [result] = await pool.execute(query, [email, password, nickname, profilePath]);
        return result;
    }
    static async editUser(user_id, nickname, profilePath, check_img) {
        if(check_img == "0") {
            const query = `UPDATE users SET nickname = ? WHERE id = ?`;
            const [results] = await pool.execute(query, [nickname, user_id]);
            return results;
        } else {
            const query = `UPDATE users SET nickname = ?, profile_path = ? WHERE id = ?`;
            const [results] = await pool.execute(query, [nickname, profilePath, user_id]);
            return results;
        }
    }
    static async editPassword(user_id, pwd) {
        const query = `UPDATE users SET pwd = ? WHERE id = ?`;
        const [results] = await pool.execute(query, [pwd, user_id]);
        return results;
    }
    static async delUser(user_id) {
        const query = `UPDATE users SET del_flag = 1 WHERE id = ?`;
        const [results] = await pool.execute(query, [user_id]);
        return results;
    }
    static async checkEmail(email) {
        const query = `SELECT COUNT(*) as count FROM users WHERE email = ?`;
        const [results] = await pool.execute(query, [email]);
        const count = results[0].count;
        return count > 0;
    }
    static async checkNickName(nickname) {
        const query = `SELECT COUNT(*) as count FROM users WHERE nickname = ?`;
        const [results] = await pool.execute(query, [nickname]);
        const count = results[0].count;
        return count > 0;
    }
    static async checkAccount(email, pwd) {
        const query = `SELECT * FROM users WHERE email = ? AND pwd = ? AND del_flag = 0`;
        const [results] = await pool.execute(query, [email, pwd]);
        return results.length === 1 ? results[0] : null;
    }
    static async getUserAccount(email) {
        const query = `SELECT id,email,nickname,profile_path,created_at,del_flag FROM users WHERE email = ?`;
        const [results] = await pool.execute(query, [email]);
        return results;
    }
}

module.exports = UserModel;