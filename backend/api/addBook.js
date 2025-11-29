const db = require('../config/db');

module.exports = async (req, res) => {
  try {
    const { title, author, category, description, coverUrl, status, publishYear } = req.body;

    const [result] = await db.execute(
      `INSERT INTO sach (tieu_de, tac_gia, the_loai, mo_ta, trang_thai, nam_xuat_ban, anh_bia) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, author, category, description, status || 'Available', publishYear, coverUrl]
    );

    res.status(201).json({
      id: result.insertId.toString(),
      title,
      author,
      category,
      status: status || 'Available',
      coverUrl,
      description,
      publishYear
    });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Failed to add book' });
  }
};
