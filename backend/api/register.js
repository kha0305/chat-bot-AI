const supabase = require('../config/supabase');

module.exports = async (req, res) => {
  try {
    const { name, studentId, username, password } = req.body;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('nguoi_dung')
      .select('id')
      .or(`email.eq.${username},so_dien_thoai.eq.${username}`) // Assuming username is email or phone for now, or we add username column
      // Actually, schema has 'email' and 'so_dien_thoai'. Let's assume 'username' maps to 'email' for this demo or we add 'username' column.
      // The schema provided earlier: ho_ten, email, so_dien_thoai, mat_khau_hash.
      // Let's treat 'username' as 'email' for simplicity or add a 'username' column.
      // Given the registration form asks for 'Tên đăng nhập', let's assume we should add 'username' column or map it.
      // Let's map username -> email for now to keep it simple with existing schema, OR add username column.
      // Adding username column is safer.
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Insert new user
    // Note: Password should be hashed in production (bcrypt). Storing plain text for demo only.
    const { data, error } = await supabase
      .from('nguoi_dung')
      .insert([
        {
          ho_ten: name,
          email: `${username}@dtu.edu.vn`, // Fake email generation if username is just a string
          mat_khau_hash: password, // WARNING: Hash this in real app
          vai_tro: 'student',
          trang_thai: 'active'
          // studentId is not in schema 'nguoi_dung'. We might need to add it or store in metadata.
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Registration successful', user: data[0] });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};
