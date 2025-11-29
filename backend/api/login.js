const db = require('../config/db');

module.exports = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Check Hardcoded Admin/Librarian FIRST (Emergency Login)
    // This ensures you can login even if Database is down
    if (username === 'admin' && password === 'admin') {
        return res.json({ id: 'admin', name: 'Quản Trị Viên', role: 'admin' });
    }
    if (username === 'librarian' && password === 'librarian') {
        return res.json({ id: 'librarian', name: 'Thủ Thư', role: 'librarian' });
    }

    // 2. Check Database for Users
    try {
        const [rows] = await db.execute(
          'SELECT * FROM nguoi_dung WHERE email = ? OR so_dien_thoai = ?', 
          [username, username]
        );

        const user = rows[0];

        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password (plain text for demo)
        if (user.mat_khau_hash !== password) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
          id: user.id.toString(),
          name: user.ho_ten,
          role: user.vai_tro,
          email: user.email
        });
    } catch (dbError) {
        console.error("Database Error during login:", dbError);
        // If DB fails, we already checked hardcoded users above.
        // So just return error for normal users.
        return res.status(500).json({ error: 'Database connection failed' });
    }

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};
