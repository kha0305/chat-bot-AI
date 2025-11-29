const data = require('../store');

module.exports = (req, res) => {
  const newBook = {
    id: Date.now().toString(),
    ...req.body
  };
  data.books.push(newBook);
  res.status(201).json(newBook);
};
