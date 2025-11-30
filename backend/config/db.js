const mysql = require('mysql2/promise');
require('dotenv').config();

// Cấu hình kết nối Local MySQL (XAMPP/WAMP/MAMP)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Nguyen@1904', // Mặc định XAMPP là rỗng
  database: process.env.DB_NAME || 'library_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
    .then(conn => {
        console.log("✅ Successfully connected to Local MySQL Database!");
        conn.release();
    })
    .catch(err => {
        console.error("❌ Failed to connect to database:", err.message);
        console.error("👉 Please check if XAMPP/MySQL is running and database 'library_db' exists.");
    });

module.exports = pool;
