// Get an instance of mysql we can use in the app
require('dotenv').config();
const mysql = require("mysql2");

// Create a 'connection pool' using the provided credentials
const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise(); // This makes it so we can use async / await rather than callbacks


/**
 * Citation for the following session time zone initialization code:
 * Date: 2025-06-08
 * ChatGPT- Based on backend reliability goals and AI-assisted connection setup.
 * Prompts:
 * 1) How do I ensure my MySQL session uses UTC time zone using mysql2 in Node.js?
 */
(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.query("SET time_zone = '+00:00';");
    conn.release();
    console.log("Session time zone set to UTC");
  } catch (err) {
    console.error("Failed to set session time zone to UTC:", err);
  }
})();

// Export it for use in our application
module.exports = pool;


