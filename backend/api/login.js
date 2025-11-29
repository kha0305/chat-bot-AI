const db = require('../config/db');

module.exports = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Assuming username is email or we check both
    const [rows] = await db.execute(
      'SELECT * FROM nguoi_dung WHERE email = ? OR so_dien_thoai = ?', 
      [username, username]
    );

    const user = rows[0];

    if (!user) {
      // Fallback for hardcoded admin/librarian (Legacy support)
      if (username === 'admin' && password === 'admin') {
          return res.json({ id: 'admin', name: 'Quản Trị Viên', role: 'admin' });
      }
      if (username === 'librarian' && password === 'librarian') {
          return res.json({ id: 'librarian', name: 'Thủ Thư', role: 'librarian' });
      }
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

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};
