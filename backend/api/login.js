const supabase = require('../config/supabase');

module.exports = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by email (mapped from username)
    // In real app, allow login by username/email/phone
    const { data, error } = await supabase
      .from('nguoi_dung')
      .select('*')
      .eq('email', `${username}@dtu.edu.vn`) // Matching the fake email logic from register
      .single();

    if (error || !data) {
      // Fallback for hardcoded admin/librarian
      if (username === 'admin' && password === 'admin') {
          return res.json({ id: 'admin', name: 'Quản Trị Viên', role: 'admin' });
      }
      if (username === 'librarian' && password === 'librarian') {
          return res.json({ id: 'librarian', name: 'Thủ Thư', role: 'librarian' });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password (plain text for demo)
    if (data.mat_khau_hash !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      id: data.id.toString(),
      name: data.ho_ten,
      role: data.vai_tro,
      email: data.email
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};
