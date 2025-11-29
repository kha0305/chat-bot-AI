const supabase = require('../config/supabase');

module.exports = async (req, res) => {
  try {
    // Fetch loans from 'phieu_muon' and join with 'sach' to get details
    const { data, error } = await supabase
      .from('phieu_muon')
      .select(`
        id,
        ngay_muon,
        ngay_hen_tra,
        ngay_tra,
        trang_thai,
        ghi_chu,
        sach (
          id,
          tieu_de,
          tac_gia,
          anh_bia
        )
      `)
      .order('ngay_muon', { ascending: false });

    if (error) throw error;

    const loans = data.map(loan => ({
      id: loan.id.toString(),
      bookId: loan.sach?.id.toString(),
      bookTitle: loan.sach?.tieu_de || 'Unknown Book',
      author: loan.sach?.tac_gia || 'Unknown Author',
      borrowDate: loan.ngay_muon,
      dueDate: loan.ngay_hen_tra,
      returnDate: loan.ngay_tra,
      status: loan.trang_thai,
      coverUrl: loan.sach?.anh_bia || 'https://via.placeholder.com/150',
      pickupTime: loan.ghi_chu // Assuming we stored pickup time in notes
    }));

    res.json(loans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
};
