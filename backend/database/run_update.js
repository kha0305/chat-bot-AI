const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function updateDatabase() {
    try {
        console.log('🔄 Connecting to database...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            multipleStatements: true
        });

        console.log('✅ Connected.');
        console.log('📂 Reading update_schema.sql...');

        const sqlPath = path.join(__dirname, 'update_schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🚀 Executing SQL script...');
        await connection.query(sql);

        console.log('✅ Database update completed successfully!');

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Database update failed:', error);
        process.exit(1);
    }
}

updateDatabase();
