const data = require('../store');

module.exports = (req, res) => {
  const { id } = req.params;
  const index = data.books.findIndex(b => b.id === id);
  if (index !== -1) {
    data.books[index] = { ...data.books[index], ...req.body };
    res.json(data.books[index]);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
};
