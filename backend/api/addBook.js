const supabase = require('../config/supabase');

module.exports = async (req, res) => {
  try {
    const { title, author, category, description, coverUrl, status, publishYear } = req.body;

    const { data, error } = await supabase
      .from('sach')
      .insert([
        {
          tieu_de: title,
          tac_gia: author,
          the_loai: category,
          mo_ta: description,
          trang_thai: status || 'Available',
          nam_xuat_ban: publishYear,
          // Note: You might need to add 'anh_bia' column to your schema if you want to save coverUrl
          // For now, we'll skip saving coverUrl to DB if column doesn't exist, or you should add it.
        }
      ])
      .select();

    if (error) throw error;

    const newBook = data[0];
    res.status(201).json({
      id: newBook.id.toString(),
      title: newBook.tieu_de,
      author: newBook.tac_gia,
      category: newBook.the_loai,
      status: newBook.trang_thai,
      coverUrl: coverUrl, // Return what was sent for UI optimism
      description: newBook.mo_ta,
      publishYear: newBook.nam_xuat_ban
    });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Failed to add book' });
  }
};
