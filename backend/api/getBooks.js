const supabase = require('../config/supabase');

module.exports = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sach')
      .select('*')
      .order('ngay_tao', { ascending: false });

    if (error) throw error;

    // Map database fields to frontend model if necessary
    // DB: tieu_de, tac_gia, ... -> Frontend: title, author, ...
    const books = data.map(book => ({
      id: book.id.toString(),
      title: book.tieu_de,
      author: book.tac_gia,
      category: book.the_loai,
      status: book.trang_thai,
      coverUrl: book.anh_bia || 'https://via.placeholder.com/150', // Assuming you add 'anh_bia' column or use default
      description: book.mo_ta,
      publishYear: book.nam_xuat_ban
    }));

    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};
