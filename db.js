const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.HOST,
    password: process.env.PASSWORD,
    user: process.env.USER,
    database: process.env.DATABASE,
});

module.exports = pool.promise();
