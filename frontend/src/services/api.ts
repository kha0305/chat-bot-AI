import { Book, LoanRecord, ChatMessage, FAQItem, SystemLog, ErrorReport, Introduction, Notification, Guide } from '../types';

// Run locally
const API_URL = 'http://localhost:5001/api';

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
export const loginUser = async (username: string, password: string): Promise<any> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
};

export const registerUser = async (data: any): Promise<any> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Registration failed');
  }

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

// FAQ Functions
export const fetchFAQs = async (): Promise<FAQItem[]> => {
  const response = await fetch(`${API_URL}/faqs`);
  return response.json();
};

export const createFAQ = async (faq: Omit<FAQItem, 'id'>): Promise<FAQItem> => {
  const response = await fetch(`${API_URL}/faqs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(faq)
  });
  return response.json();
};

export const updateFAQ = async (id: string, faq: Partial<FAQItem>): Promise<void> => {
  await fetch(`${API_URL}/faqs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(faq)
  });
};

export const deleteFAQ = async (id: string): Promise<void> => {
  await fetch(`${API_URL}/faqs/${id}`, { method: 'DELETE' });
};

// Log & Error Functions
export const sendErrorReport = async (userId: string | undefined, description: string, severity?: string) => {
  const response = await fetch(`${API_URL}/report-error`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, description, severity })
  });
  return response.json();
};

export const fetchSystemLogs = async (): Promise<SystemLog[]> => {
  const response = await fetch(`${API_URL}/admin/logs`);
  return response.json();
};

export const fetchErrorReports = async (): Promise<ErrorReport[]> => {
  const response = await fetch(`${API_URL}/admin/error-reports`);
  return response.json();
};

// AI Training Functions
export const trainAI = async (data: string, userId?: string) => {
  const response = await fetch(`${API_URL}/admin/train-ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, userId })
  });
  return response.json();
};

export const fetchAIStats = async () => {
  const response = await fetch(`${API_URL}/admin/ai-stats`);
  return response.json();
};

// --- Content Management ---

// Introduction
export const fetchIntroduction = async (): Promise<Introduction[]> => {
  const response = await fetch(`${API_URL}/introduction`);
  if (!response.ok) throw new Error('Failed to fetch introduction');
  return response.json();
};

export const addIntroduction = async (data: any) => {
  const response = await fetch(`${API_URL}/introduction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to add introduction');
  return response.json();
};

export const updateIntroduction = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/introduction/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update introduction');
  return response.json();
};

export const deleteIntroduction = async (id: string) => {
  const response = await fetch(`${API_URL}/introduction/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete introduction');
  return response.json();
};

// Notifications
export const fetchNotifications = async (): Promise<Notification[]> => {
  const response = await fetch(`${API_URL}/notifications`);
  if (!response.ok) throw new Error('Failed to fetch notifications');
  return response.json();
};

export const addNotification = async (data: any) => {
  const response = await fetch(`${API_URL}/notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to add notification');
  return response.json();
};

export const deleteNotification = async (id: string) => {
  const response = await fetch(`${API_URL}/notifications/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete notification');
  return response.json();
};

// Guides
export const fetchGuides = async (): Promise<Guide[]> => {
  const response = await fetch(`${API_URL}/guides`);
  if (!response.ok) throw new Error('Failed to fetch guides');
  return response.json();
};

export const addGuide = async (data: any) => {
  const response = await fetch(`${API_URL}/guides`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to add guide');
  return response.json();
};

export const updateGuide = async (id: string, data: any) => {
  const response = await fetch(`${API_URL}/guides/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update guide');
  return response.json();
};

export const deleteGuide = async (id: string) => {
  const response = await fetch(`${API_URL}/guides/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete guide');
  return response.json();
};
