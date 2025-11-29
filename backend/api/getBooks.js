const db = require('../config/db');

module.exports = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM sach ORDER BY ngay_tao DESC');

    const books = rows.map(book => ({
      id: book.id.toString(),
      title: book.tieu_de,
      author: book.tac_gia,
      category: book.the_loai,
      status: book.trang_thai,
      coverUrl: book.anh_bia || 'https://via.placeholder.com/150',
      description: book.mo_ta,
      publishYear: book.nam_xuat_ban
    }));

    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};
