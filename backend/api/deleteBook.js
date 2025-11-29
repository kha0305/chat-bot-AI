const supabase = require('../config/supabase');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('sach')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
};
