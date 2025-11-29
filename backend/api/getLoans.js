const db = require('../config/db');

module.exports = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT pm.*, s.tieu_de, s.tac_gia, s.anh_bia 
      FROM phieu_muon pm 
      LEFT JOIN sach s ON pm.sach_id = s.id 
      ORDER BY pm.ngay_muon DESC
    `);

    const loans = rows.map(loan => ({
      id: loan.id.toString(),
      bookId: loan.sach_id ? loan.sach_id.toString() : null,
      bookTitle: loan.tieu_de || 'Unknown Book',
      author: loan.tac_gia || 'Unknown Author',
      borrowDate: loan.ngay_muon,
      dueDate: loan.ngay_hen_tra,
      returnDate: loan.ngay_tra,
      status: loan.trang_thai,
      coverUrl: loan.anh_bia || 'https://via.placeholder.com/150',
      pickupTime: loan.ghi_chu
    }));

    res.json(loans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
};
