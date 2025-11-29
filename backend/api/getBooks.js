const data = require('../store');

module.exports = (req, res) => {
  res.json(data.books);
};
