const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
// Routes
app.get('/api/get-books', require('./api/getBooks'));
app.post('/api/create-book', require('./api/createBook'));
app.put('/api/update-book/:id', require('./api/updateBook'));
app.delete('/api/delete-book/:id', require('./api/deleteBook'));

const chatbotController = require('./controllers/ChatbotController');

app.get('/api/get-loans', require('./api/getLoans'));
app.post('/api/create-loan', require('./api/createLoan'));
app.post('/api/chat-with-ai', (req, res) => chatbotController.processMessage(req, res));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
