const db = require('../config/db');

module.exports = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check Database for Users
    try {
      // Updated query to check 'ten_dang_nhap' OR 'email' OR 'so_dien_thoai'
      const [rows] = await db.execute(
        'SELECT * FROM nguoi_dung WHERE ten_dang_nhap = ? OR email = ? OR so_dien_thoai = ?',
        [username, username, username]
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
        email: user.email,
        username: user.ten_dang_nhap
      });
    } catch (dbError) {
      console.error("Database Error during login:", dbError);
      return res.status(500).json({ error: 'Database connection failed' });
    }

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};
