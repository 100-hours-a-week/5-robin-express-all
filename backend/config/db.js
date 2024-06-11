const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    waitForConnections : true,
    connectionLimit : parseInt(process.env.DB_CONNECTION_LIMIT),
    queueLimit : 0
});

module.exports = pool;