const mysql = require('mysql2');

const dbConfig = mysql.createConnection({
    host: 'http://localhost:8086',
    user: 'root',
    password: 'root',
    database: 'exam_db',
});

module.exports = dbConfig