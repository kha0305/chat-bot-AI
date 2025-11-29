const supabase = require('../config/supabase');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category, description, status, publishYear } = req.body;

    const updates = {};
    if (title) updates.tieu_de = title;
    if (author) updates.tac_gia = author;
    if (category) updates.the_loai = category;
    if (description) updates.mo_ta = description;
    if (status) updates.trang_thai = status;
    if (publishYear) updates.nam_xuat_ban = publishYear;
    updates.ngay_cap_nhat = new Date();

    const { data, error } = await supabase
      .from('sach')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const updatedBook = data[0];
    res.json({
      id: updatedBook.id.toString(),
      title: updatedBook.tieu_de,
      author: updatedBook.tac_gia,
      category: updatedBook.the_loai,
      status: updatedBook.trang_thai,
      description: updatedBook.mo_ta,
      publishYear: updatedBook.nam_xuat_ban
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
};
