const pool = require('../config/db');

class commentModel {

    static async listComments(post_id) {
        const query = `SELECT A.*, C.nickname, C.profile_path
        FROM comments AS A 
        LEFT JOIN posts AS B ON A.post_id=B.id
        LEFT JOIN users AS C ON A.user_id=C.id
        WHERE A.del_flag = 0 AND A.post_id = ?
        `;
        try {
            const [results] = await pool.execute(query, [post_id]);
            return results;
        } catch(err) {
            console.log('Error fetching comments:', err);
            throw err;
        }
    }
    static async createComments(user_id, post_id, content) {
        const query = `INSERT INTO comments (user_id, post_id, content) values (?, ? ,?)`;
        const postquery = `UPDATE posts SET comments = comments + 1 WHERE id = ?`;
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');

            const [results] = await connection.execute(query, [user_id, post_id, content]);
            const [postresults] = await connection.execute(postquery, [post_id]);
            await connection.commit();
            return results;
        } catch(err) {
            await connection.rollback();
            console.log('Error createComments:', err);
            throw err;
        } finally {
            connection.release();
        }
    }
    static async editComments(content, comment_id) {
        const query = `UPDATE comments SET content = ? WHERE id = ?`;
        try {
            const[results] = await pool.execute(query, [content, comment_id]);
            return results;
        } catch(err) {
            console.log('Error editcomment:', err);
            throw err;
        }
    }
    static async delComments(comment_id, post_id) {
        const query = `UPDATE comments SET del_flag = 1 WHERE id = ?`;
        const postquery = `UPDATE posts SET comments = comments - 1 WHERE id = ?`;
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');

            const[results] = await connection.execute(query, [comment_id]);
            const[postresults] = await connection.execute(postquery, [post_id]);

            await connection.commit();
            return results;
        } catch(err) {
            await connection.rollback();
            console.log('Error delcomment:', err);
            throw err;
        } finally {
            connection.release();
        }
    }
    static async checkAuthrizedComment(comment_id, user_id) {
        const query = `SELECT COUNT(*) AS count FROM comments WHERE id = ? AND user_id = ?`;
        try {
            const[results] = await pool.execute(query, [comment_id, user_id]);
            const count = results[0].count;
            return count > 0;
        } catch(err) {
            console.log('Error checkAuthrized:', err);
            throw err;
        }
    }
}

module.exports = commentModel;