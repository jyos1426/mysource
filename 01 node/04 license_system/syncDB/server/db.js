var mysql = require('mysql');

var conn = mysql.createConnection({
}); 

conn.connect();



module.exports = conn;