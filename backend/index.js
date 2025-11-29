const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/books', require('./api/getBooks'));
app.post('/api/books', require('./api/createBook'));
app.put('/api/books/:id', require('./api/updateBook'));
app.delete('/api/books/:id', require('./api/deleteBook'));

app.get('/api/loans', require('./api/getLoans'));
app.post('/api/loans', require('./api/createLoan'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
