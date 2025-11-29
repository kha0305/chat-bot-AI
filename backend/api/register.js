const db = require('../config/db');

module.exports = async (req, res) => {
  try {
    const { name, studentId, username, password } = req.body;

    // Check if user exists
    const [existing] = await db.execute(
        'SELECT id FROM nguoi_dung WHERE email = ? OR so_dien_thoai = ?',
        [username, username]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Insert new user
    const [result] = await db.execute(
        `INSERT INTO nguoi_dung (ho_ten, email, mat_khau_hash, vai_tro, trang_thai) 
         VALUES (?, ?, ?, 'student', 'active')`,
        [name, `${username}@dtu.edu.vn`, password]
    );

    res.status(201).json({ 
        message: 'Registration successful', 
        userId: result.insertId.toString() 
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};
