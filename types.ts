export enum Sender {
  USER = 'user',
  BOT = 'model'
}

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  timestamp: Date;
  isError?: boolean;
  relatedBooks?: Book[]; // Optional structured data if AI recommends books
  image?: string; // Base64 string of the uploaded image
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  status: 'Available' | 'Borrowed' | 'Maintenance';
  coverUrl: string;
  description: string;
}

export interface LibraryPolicy {
  maxBooks: number;
  loanPeriodDays: number;
  finePerDay: number; // in VND
  openHours: string;
}

export interface LoanRecord {
  id: string;
  bookTitle: string;
  author: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Borrowing' | 'Returned' | 'Overdue' | 'Reserved';
  coverUrl: string;
  pickupTime?: string;
}

export type ViewState = 'dashboard' | 'chat' | 'history' | 'admin-dashboard' | 'admin-books';

export type Theme = 'light' | 'dark';
export type FontSize = 'small' | 'medium' | 'large';

export interface AppSettings {
  theme: Theme;
  fontSize: FontSize;
}

export type UserRole = 'student' | 'admin' | 'librarian';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}