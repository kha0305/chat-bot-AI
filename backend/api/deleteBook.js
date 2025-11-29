const data = require('../store');

module.exports = (req, res) => {
  const { id } = req.params;
  data.books = data.books.filter(b => b.id !== id);
  res.json({ message: 'Book deleted' });
};
