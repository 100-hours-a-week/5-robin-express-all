const pool = require('../config/db');

class PostModel {

    static async listPosts() {
        const query = `SELECT A.*, B.nickname, B.profile_path FROM posts AS A LEFT JOIN users AS B ON A.user_id=B.id WHERE A.del_flag=0`;
        try {
            const [results] = await pool.execute(query);
            return results;
        } catch(err) {
            console.log('Error fetching posts:', err);
            throw err;
        }
    }
    static async getDetailPost(id) {
        const query = `SELECT A.*, B.nickname, B.profile_path FROM posts AS A LEFT JOIN users AS B ON A.user_id=B.id WHERE A.id = ?`
        const hitsquery = `UPDATE posts SET hits = hits + 1 WHERE id = ?`;
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');

            const [hits] = await connection.execute(hitsquery, [id]);
            const [results] = await connection.execute(query, [id]);

            await connection.commit();
            return results;
        } catch(err) {
            await connection.rollback();
            console.log('Error getDetailPost:', err);
            throw err;
        } finally {
            connection.release();
        }
    }
    static async createPost(title, content, file_path, user_id) {
        const query = `INSERT INTO posts (title, content, file_path, user_id) values (?, ? ,?, ?)`;
        try {
            const[results] = await pool.execute(query, [title, content, file_path, user_id]);
            return results;
        } catch(err) {
            console.log('Error createPost:', err);
            throw err;
        }
    }
    static async updatePost(title, content, file_path, edit_id) {
        const query = `UPDATE posts SET title = ?, content = ?, file_path = ? WHERE id = ?`;
        try {
            const[results] = await pool.execute(query, [title, content, file_path, edit_id]);
            return results;
        } catch(err) {
            console.log('Error createPost:', err);
            throw err;
        }
    }
    static async delPost(post_id) {
        const query = `UPDATE posts SET del_flag = 1 WHERE id = ?`;
        try {
            const[results] = await pool.execute(query, [post_id]);
            return results;
        } catch(err) {
            console.log('Error createPost:', err);
            throw err;
        }
    }
    static async checkAuthrizedPost(post_id, user_id) {
        const query = `SELECT COUNT(*) AS count FROM posts WHERE id = ? AND user_id = ?`;
        try {
            const[results] = await pool.execute(query, [post_id, user_id]);
            const count = results[0].count;
            return count > 0;
        } catch(err) {
            console.log('Error checkAuthrized:', err);
            throw err;
        }
    }
    
}

module.exports = PostModel;