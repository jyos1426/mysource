var mysql = require('mysql');

var conn = mysql.createPool({
    connectionLimit : 10
    , host     : '-'
    , user     : '-'
    , password : '-'
    , database : '-'
    , acquireTimeout : 10000
    , insecureAuth : true
    , connectTimeout : 10000
    , waitForConnections : false
}); 

module.exports = conn;