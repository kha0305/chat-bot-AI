import { Book, LoanRecord } from '../types';

const API_URL = 'http://localhost:5000/api';

export const fetchBooks = async (): Promise<Book[]> => {
  const response = await fetch(`${API_URL}/get-books`);
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  return response.json();
};

export const createBook = async (book: Omit<Book, 'id'>): Promise<Book> => {
  const response = await fetch(`${API_URL}/create-book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });
  if (!response.ok) {
    throw new Error('Failed to create book');
  }
  return response.json();
};

export const updateBook = async (id: string, book: Partial<Book>): Promise<Book> => {
  const response = await fetch(`${API_URL}/update-book/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });
  if (!response.ok) {
    throw new Error('Failed to update book');
  }
  return response.json();
};

export const deleteBook = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/delete-book/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete book');
  }
};

export const fetchLoans = async (): Promise<LoanRecord[]> => {
  const response = await fetch(`${API_URL}/get-loans`);
  if (!response.ok) {
    throw new Error('Failed to fetch loans');
  }
  return response.json();
};

export const createLoan = async (loan: Omit<LoanRecord, 'id'>): Promise<LoanRecord> => {
  const response = await fetch(`${API_URL}/create-loan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loan),
  });
  if (!response.ok) {
    throw new Error('Failed to create loan');
  }
  return response.json();
};

export const sendMessage = async (message: string): Promise<{ message: string; books?: Book[] }> => {
  const response = await fetch(`${API_URL}/chat-with-ai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  return response.json();
};
