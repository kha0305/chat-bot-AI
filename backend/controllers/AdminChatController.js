const chatStore = require('../data/ChatStore');

class AdminChatController {
  
  getSessions(req, res) {
    const sessions = chatStore.getAllSessions();
    res.json(sessions);
  }

  getSessionMessages(req, res) {
    const { userId } = req.params;
    const messages = chatStore.getMessages(userId);
    res.json(messages);
  }

  sendAdminMessage(req, res) {
    const { userId } = req.params;
    const { text, adminName } = req.body;

    const message = {
      id: Date.now().toString(),
      sender: 'admin', // or 'librarian'
      senderName: adminName || 'Thủ thư',
      text: text,
      timestamp: new Date()
    };

    chatStore.addMessage(userId, message);
    res.json(message);
  }
}

module.exports = new AdminChatController();
