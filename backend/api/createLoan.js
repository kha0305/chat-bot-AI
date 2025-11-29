const data = require('../store');

module.exports = (req, res) => {
  const newLoan = {
    id: Date.now().toString(),
    ...req.body
  };
  data.loans.unshift(newLoan);

  if (newLoan.bookId) {
    const bookIndex = data.books.findIndex(b => b.id === newLoan.bookId);
    if (bookIndex !== -1) data.books[bookIndex].status = 'Borrowed';
  } else if (newLoan.bookTitle) {
      const bookIndex = data.books.findIndex(b => b.title === newLoan.bookTitle && b.status === 'Available');
      if (bookIndex !== -1) data.books[bookIndex].status = 'Borrowed';
  }

  res.status(201).json(newLoan);
};
