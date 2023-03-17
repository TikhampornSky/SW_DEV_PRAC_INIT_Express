const mysql = require('mysql');

var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Tan12924',
    database: 'vacCenter'
});

module.exports = connection;