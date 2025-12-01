console.log('Starting check_db...');
const db = require('./config/db');

async function checkUsers() {
    try {
        const [rows] = await db.execute('SELECT * FROM nguoi_dung');
        console.log('Users in DB:', rows);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUsers();
