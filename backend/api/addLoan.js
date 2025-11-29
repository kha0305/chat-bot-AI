const db = require('../config/db');

module.exports = async (req, res) => {
  try {
    const { bookId, bookTitle, author, borrowDate, dueDate, status, coverUrl, pickupTime } = req.body;

    const [result] = await db.execute(
      `INSERT INTO phieu_muon (sach_id, ngay_muon, ngay_hen_tra, trang_thai, ghi_chu) 
       VALUES (?, ?, ?, ?, ?)`,
      [bookId, borrowDate, dueDate, status, `Pickup: ${pickupTime}`]
    );

    res.status(201).json({
      id: result.insertId.toString(),
      bookId,
      bookTitle,
      author,
      borrowDate,
      dueDate,
      status,
      coverUrl,
      pickupTime
    });

  } catch (error) {
    console.error('Error adding loan:', error);
    res.status(500).json({ error: 'Failed to add loan' });
  }
};
