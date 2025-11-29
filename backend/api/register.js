const db = require('../config/db');

module.exports = async (req, res) => {
  try {
    const { fullName, studentId, username, password, email } = req.body;

    // Basic validation
    if (!fullName || !studentId || !username || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists (username, email, or studentId/phone)
    // Note: studentId is often mapped to so_dien_thoai or a specific column. 
    // Here we map studentId -> so_dien_thoai for simplicity as per schema, or we should add a student_id column.
    // For now, let's assume studentId is stored in 'so_dien_thoai' or we just check username/email.
    
    const [existingUsers] = await db.execute(
      'SELECT * FROM nguoi_dung WHERE ten_dang_nhap = ? OR email = ?',
      [username, email || '']
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Username or Email already exists' });
    }

    // Insert new user
    // Mapping: username -> ten_dang_nhap, fullName -> ho_ten, studentId -> so_dien_thoai (temporary workaround)
    const [result] = await db.execute(
      'INSERT INTO nguoi_dung (ten_dang_nhap, ho_ten, email, so_dien_thoai, mat_khau_hash, vai_tro) VALUES (?, ?, ?, ?, ?, ?)',
      [username, fullName, email || `${username}@student.dtu.edu.vn`, studentId, password, 'student']
    );

    res.status(201).json({ 
        message: 'User registered successfully', 
        userId: result.insertId.toString() 
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};
