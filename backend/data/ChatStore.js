class ChatStore {
  constructor() {
    this.sessions = {}; // { userId: { user: { id, name, role }, messages: [] } }
  }

  // Get or create session
  getSession(userId, userInfo) {
    if (!this.sessions[userId]) {
      this.sessions[userId] = {
        user: userInfo,
        messages: [],
        lastUpdated: new Date()
      };
    }
    return this.sessions[userId];
  }

  getAllSessions() {
    return Object.values(this.sessions).sort((a, b) => b.lastUpdated - a.lastUpdated);
  }

  addMessage(userId, message) {
    const session = this.sessions[userId];
    if (session) {
      session.messages.push(message);
      session.lastUpdated = new Date();
    }
  }

  getMessages(userId) {
    return this.sessions[userId] ? this.sessions[userId].messages : [];
  }
}

module.exports = new ChatStore();
