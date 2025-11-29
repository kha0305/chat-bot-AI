const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to allow requests from your frontend domain
app.use(cors({
  origin: [
    'https://server.id.vn', 
    'https://www.server.id.vn',
    'http://localhost:5173', // Allow local dev
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' })); // Increase limit for image uploads

// Routes
app.get('/api/books', require('./api/getBooks'));
app.post('/api/books', require('./api/addBook'));
app.put('/api/books/:id', require('./api/updateBook'));
app.delete('/api/books/:id', require('./api/deleteBook'));

app.get('/api/loans', require('./api/getLoans'));
app.post('/api/loans', require('./api/addLoan'));

// Auth Routes
app.post('/api/login', require('./api/login'));
app.post('/api/register', require('./api/register'));

// Chat Route
const chatbotController = require('./controllers/ChatbotController');
app.post('/api/chat-with-ai', chatbotController.processMessage);
app.get('/api/chat-history/:userId', (req, res) => {
    const chatStore = require('./data/ChatStore');
    const { userId } = req.params;
    const history = chatStore.getMessages(userId);
    res.json(history);
});

// Admin Chat Routes
const adminChatController = require('./controllers/AdminChatController');
app.get('/api/admin/chat-sessions', adminChatController.getSessions);
app.get('/api/admin/chat-messages/:userId', adminChatController.getMessages);
app.post('/api/admin/reply/:userId', adminChatController.sendAdminMessage);

// Export for Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
