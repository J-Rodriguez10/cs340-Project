const mysql = require('mysql2');

const pool = mysql.createPool({
  waitForConnections: true,
  connectionLimit: 10,
  host: 'classmysql.engr.oregonstate.edu',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).promise();

module.exports = pool;

// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   waitForConnections: true,
//   connectionLimit: 10,
//   host: 'classmysql.engr.oregonstate.edu',
//   user: 'cs340_<your_onid>',
//   password: '<your_db_password>',
//   database: 'cs340_<your_onid>'
// }).promise();

// module.exports = pool;