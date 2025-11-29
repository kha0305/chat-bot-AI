const db = require('../config/db');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute('DELETE FROM sach WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
        // It's okay if it doesn't exist, but usually we might want to know
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
};
