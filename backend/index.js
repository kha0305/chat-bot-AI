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
    'http://localhost:3000',
    'http://localhost:9000',  // Allow port 9000
    'http://localhost:9001',  // Allow port 9001
    'http://172.16.65.0:9000' // Allow access from specific IP
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' })); // Increase limit for image uploads

// Routes
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

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
  // Warning: This uses in-memory store, not persistent in Vercel
  // TODO: Migrate to MySQL
  try {
    const chatStore = require('./data/ChatStore');
    const { userId } = req.params;
    const history = chatStore.getMessages(userId);
    res.json(history);
  } catch (e) {
    console.error("ChatStore error", e);
    res.json([]);
  }
});

// Admin Chat Routes
const adminChatController = require('./controllers/AdminChatController');
app.get('/api/admin/chat-sessions', adminChatController.getSessions);
app.get('/api/admin/chat-messages/:userId', adminChatController.getSessionMessages);
app.post('/api/admin/reply/:userId', adminChatController.sendAdminMessage);

<<<<<<< HEAD
// Support Chat Routes (Real-time DB)
const supportController = require('./controllers/SupportController');
app.post('/api/support/create', supportController.createSession);
app.get('/api/support/sessions', supportController.getSessions);
app.get('/api/support/messages/:sessionId', supportController.getMessages);
app.post('/api/support/send', supportController.sendMessage);
app.get('/api/support/active/:userId', supportController.getActiveSession);
=======
// FAQ Routes
const faqController = require('./controllers/FAQController');
app.get('/api/faqs', faqController.getFAQs);
app.post('/api/faqs', faqController.addFAQ);
app.put('/api/faqs/:id', faqController.updateFAQ);
app.delete('/api/faqs/:id', faqController.deleteFAQ);

// Log & Error Routes
const logController = require('./controllers/LogController');
app.post('/api/report-error', logController.createErrorReport);
app.get('/api/admin/logs', logController.getSystemLogs);
app.get('/api/admin/error-reports', logController.getErrorReports);

// AI Training Routes
// AI Training Routes
const aiController = require('./controllers/AITrainingController');
app.post('/api/admin/train-ai', aiController.trainAI);
app.get('/api/admin/ai-stats', aiController.getTrainingStats);

// Content Management Routes
const contentController = require('./controllers/ContentController');
// Introduction
app.get('/api/introduction', contentController.getIntroduction);
app.post('/api/introduction', contentController.addIntroduction);
app.put('/api/introduction/:id', contentController.updateIntroduction);
app.delete('/api/introduction/:id', contentController.deleteIntroduction);
// Notifications
app.get('/api/notifications', contentController.getNotifications);
app.post('/api/notifications', contentController.addNotification);
app.delete('/api/notifications/:id', contentController.deleteNotification);
// Guides
app.get('/api/guides', contentController.getGuides);
app.post('/api/guides', contentController.addGuide);
app.put('/api/guides/:id', contentController.updateGuide);
app.delete('/api/guides/:id', contentController.deleteGuide);
>>>>>>> fb1c7d176fb29e659c8d81038222541234973446

// Export for Vercel
// Always start server for local dev
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
