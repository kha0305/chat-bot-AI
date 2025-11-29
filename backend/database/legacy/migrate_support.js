const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('Connected to database.');

    const sql = `
      CREATE TABLE IF NOT EXISTS ho_tro_truc_tuyen (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        nguoi_dung_id BIGINT,
        noi_dung TEXT,
        trang_thai ENUM('cho_xu_ly', 'dang_xu_ly', 'da_xu_ly') DEFAULT 'cho_xu_ly',
        thoi_gian_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id)
      );
    `;

    await connection.execute(sql);
    console.log('Table ho_tro_truc_tuyen created successfully.');
    await connection.end();
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();
