import { Book, LoanRecord, ChatMessage } from '../types';

// Run locally
const API_URL = 'http://localhost:5000/api';

export const fetchBooks = async (): Promise<Book[]> => {
  const response = await fetch(`${API_URL}/books`);
  return response.json();
};

export const fetchLoans = async (): Promise<LoanRecord[]> => {
  const response = await fetch(`${API_URL}/loans`);
  return response.json();
};

export const createLoan = async (loan: Omit<LoanRecord, 'id'>): Promise<LoanRecord> => {
  const response = await fetch(`${API_URL}/loans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loan),
  });
  return response.json();
};

export const createBook = async (book: Omit<Book, 'id'>): Promise<Book> => {
  const response = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });
  return response.json();
};

export const updateBook = async (id: string, book: Partial<Book>): Promise<Book> => {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });
  return response.json();
};

export const deleteBook = async (id: string): Promise<void> => {
  await fetch(`${API_URL}/books/${id}`, {
    method: 'DELETE',
  });
};

export const sendMessage = async (message: string, userId?: string, userName?: string): Promise<{ message: string; books?: Book[] }> => {
  const response = await fetch(`${API_URL}/chat-with-ai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, userId, userName }),
  });
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  return response.json();
};

// Auth Functions
export const loginUser = async (username: string, password: string):Promise<any> => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
};

export const registerUser = async (data: any):Promise<any> => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
};

// Admin Chat Functions
export const fetchChatSessions = async () => {
  const response = await fetch(`${API_URL}/admin/chat-sessions`);
  return response.json();
};

export const fetchSessionMessages = async (userId: string) => {
  const response = await fetch(`${API_URL}/admin/chat-messages/${userId}`);
  return response.json();
};

export const sendAdminMessage = async (userId: string, text: string, adminName: string) => {
  const response = await fetch(`${API_URL}/admin/reply/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, adminName })
  });
  return response.json();
};

export const fetchUserChatHistory = async (userId: string) => {
    const response = await fetch(`${API_URL}/chat-history/${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch history');
    }
    return response.json();
};

// Support Chat Functions
export const createSupportSession = async (userId: string, message: string) => {
    const response = await fetch(`${API_URL}/support/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message })
    });
    return response.json();
};

export const fetchSupportSessions = async () => {
    const response = await fetch(`${API_URL}/support/sessions`);
    return response.json();
};

export const fetchSupportMessages = async (sessionId: string) => {
    const response = await fetch(`${API_URL}/support/messages/${sessionId}`);
    return response.json();
};

export const sendSupportMessage = async (sessionId: string, userId: string, message: string) => {
    const response = await fetch(`${API_URL}/support/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, userId, message })
    });
    return response.json();
};

export const checkActiveSupportSession = async (userId: string) => {
    const response = await fetch(`${API_URL}/support/active/${userId}`);
    return response.json();
};
