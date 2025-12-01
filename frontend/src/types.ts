export enum Sender {
  USER = 'user',
  BOT = 'model',
  ADMIN = 'admin'
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
  location?: string;
  publishYear?: number;
}

export interface LibraryPolicy {
  maxBooks: number;
  loanPeriodDays: number;
  finePerDay: number; // in VND
  openHours: string;
}

export interface LoanRecord {
  id: string;
  bookId?: string;
  bookTitle: string;
  author: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Borrowing' | 'Returned' | 'Overdue' | 'Reserved';
  coverUrl: string;
  pickupTime?: string;
}

<<<<<<< HEAD
export type ViewState = 'dashboard' | 'chat' | 'history' | 'admin-dashboard' | 'admin-books' | 'admin-chat' | 'support-chat';
=======
export type ViewState = 'dashboard' | 'chat' | 'history' | 'admin-dashboard' | 'admin-books' | 'admin-chat' | 'introduction' | 'notification' | 'admin-faq' | 'admin-ai-training' | 'admin-logs' | 'guide';
>>>>>>> fb1c7d176fb29e659c8d81038222541234973446

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
  email?: string;
  phone?: string;
  studentId?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SystemLog {
  id: string;
  userId: string;
  username: string;
  question: string;
  response: string;
  timestamp: string;
}

export interface ErrorReport {
  id: string;
  nguoi_dung_id: string;
  ten_dang_nhap?: string;
  mo_ta_loi: string;
  muc_do: string;
  thoi_gian: string;
}

export interface Introduction {
  id: string;
  tieu_de: string;
  noi_dung: string;
  hinh_anh: string;
  thu_tu: number;
}

export interface Notification {
  id: string;
  tieu_de: string;
  noi_dung: string;
  loai: 'info' | 'warning' | 'success' | 'error';
  ngay_tao: string;
}

export interface Guide {
  id: string;
  tieu_de: string;
  noi_dung: string;
  thu_tu: number;
}