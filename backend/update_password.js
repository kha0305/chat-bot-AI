const db = require('./config/db');

async function updateAdminPassword() {
    try {
        console.log('Updating admin password in database...');
        const [result] = await db.execute(
            'UPDATE nguoi_dung SET mat_khau_hash = ? WHERE ten_dang_nhap = ?',
            ['123admin', 'admin']
        );
        console.log('Update result:', result);
        console.log('✅ Admin password updated to 123admin in database.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating password:', error);
        process.exit(1);
    }
}

updateAdminPassword();
