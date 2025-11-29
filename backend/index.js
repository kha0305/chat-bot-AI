const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for image uploads

// Routes
app.get('/api/books', require('./api/getBooks'));
app.post('/api/books', require('./api/addBook'));
app.put('/api/books/:id', require('./api/updateBook'));
app.delete('/api/books/:id', require('./api/deleteBook'));

app.get('/api/loans', require('./api/getLoans'));
app.post('/api/loans', require('./api/addLoan'));

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
