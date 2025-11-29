const db = require('../config/db');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category, description, status, publishYear } = req.body;

    // Build dynamic query
    let fields = [];
    let values = [];

    if (title) { fields.push('tieu_de = ?'); values.push(title); }
    if (author) { fields.push('tac_gia = ?'); values.push(author); }
    if (category) { fields.push('the_loai = ?'); values.push(category); }
    if (description) { fields.push('mo_ta = ?'); values.push(description); }
    if (status) { fields.push('trang_thai = ?'); values.push(status); }
    if (publishYear) { fields.push('nam_xuat_ban = ?'); values.push(publishYear); }
    
    // Always update timestamp
    // MySQL 'ON UPDATE CURRENT_TIMESTAMP' handles this automatically usually, but we can force it if needed.
    // Let's rely on DB trigger or default behavior, or just ignore for now.

    if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id); // For WHERE clause

    const query = `UPDATE sach SET ${fields.join(', ')} WHERE id = ?`;
    
    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Return updated data (mocked since MySQL UPDATE doesn't return row)
    res.json({
      id,
      title,
      author,
      category,
      status,
      description,
      publishYear
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
};
