const mysql = require('mysql'); 

mysql.credentials = {
    host     : process.env.HOST_DB,
    user     : process.env.USER_DB,
    password : process.env.PASSWORD_DB,
    database : process.env.DATABASE_DB,
    port     : process.env.PORT_DB
};

const db = mysql

module.exports = db