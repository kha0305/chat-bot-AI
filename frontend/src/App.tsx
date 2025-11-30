import React, { useState, useRef, useEffect } from 'react';
import { Menu, Trash2, MessageSquare, Settings as SettingsIcon, ArrowLeft } from 'lucide-react';
import ChatInput from './components/ChatInput';
import MessageBubble from './components/MessageBubble';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminChat from './components/AdminChat';
import Login from './components/Login';
import Register from './components/Register';
import LoanHistory from './components/LoanHistory';
import SettingsModal from './components/SettingsModal';
import BorrowModal from './components/BorrowModal';
import HelpModal from './components/HelpModal';
import ProfileModal from './components/ProfileModal';
import Introduction from './components/Introduction';
import Notification from './components/Notification';
import AdminFAQ from './components/AdminFAQ';
import AdminAITraining from './components/AdminAITraining';
import AdminLogs from './components/AdminLogs';
import ErrorReportModal from './components/ErrorReportModal';
import AdminIntroduction from './components/AdminIntroduction';
import AdminNotification from './components/AdminNotification';
import AdminGuide from './components/AdminGuide';
import { ChatMessage, Sender, ViewState, AppSettings, User, UserRole, Book, LoanRecord } from './types';
import { fetchBooks, fetchLoans, createLoan, createBook, updateBook, deleteBook, sendMessage, fetchUserChatHistory } from './services/api';
import { MOCK_BOOKS, MOCK_HISTORY } from './constants';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);

  // Global Data State
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<LoanRecord[]>([]);

  // Modal State (Lifted from Dashboard)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isErrorReportOpen, setIsErrorReportOpen] = useState(false);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('introduction');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Guest View State
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // App Settings State
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    fontSize: 'medium'
  });

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedBooks, fetchedLoans] = await Promise.all([
          fetchBooks(),
          fetchLoans()
        ]);
        setBooks(fetchedBooks);
        setLoans(fetchedLoans);
      } catch (error) {
        console.error("Failed to load data:", error);
        setBooks(MOCK_BOOKS);
        setLoans(MOCK_HISTORY);
      }
    };
    loadData();
  }, []);

  // Book Management Handlers
  const handleAddBook = async (book: Omit<Book, 'id'>) => {
    try {
      const newBook = await createBook(book);
      setBooks(prev => [newBook, ...prev]);
      return newBook;
    } catch (error) {
      console.error("Failed to add book:", error);
      throw error;
    }
  };

  const handleUpdateBook = async (id: string, book: Partial<Book>) => {
    try {
      const updatedBook = await updateBook(id, book);
      setBooks(prev => prev.map(b => b.id === id ? updatedBook : b));
      return updatedBook;
    } catch (error) {
      console.error("Failed to update book:", error);
      throw error;
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      await deleteBook(id);
      setBooks(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error("Failed to delete book:", error);
      throw error;
    }
  };

  // Apply Theme
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Initial Greeting (Only when starting chat)
  useEffect(() => {
    if (messages.length === 0) {
      if (user && user.role === 'student') {
        const initialMsg: ChatMessage = {
          id: 'init',
          sender: Sender.BOT,
          text: `Chào ${user.name}! 👋\n\nMình là **DTU LibBot**, trợ lý ảo chính thức của Thư viện Đại học Duy Tân.\n\nMình sẵn sàng hỗ trợ bạn tra cứu sách, tìm hiểu nội quy thư viện hoặc thông tin về giờ mở cửa. Bạn cần giúp gì cho việc học tập hôm nay?`,
          timestamp: new Date()
        };
        setMessages([initialMsg]);
      } else if (!user && currentView === 'chat') {
        const initialMsg: ChatMessage = {
          id: 'init',
          sender: Sender.BOT,
          text: `Chào bạn! 👋\n\nMình là **DTU LibBot**, trợ lý ảo chính thức của Thư viện Đại học Duy Tân.\n\nMình sẵn sàng hỗ trợ bạn tra cứu sách, tìm hiểu nội quy thư viện hoặc thông tin về giờ mở cửa. Bạn cần giúp gì cho việc học tập hôm nay?`,
          timestamp: new Date()
        };
        setMessages([initialMsg]);
      }
    }
  }, [user, messages.length, currentView]);

  // Poll for new messages when in chat view
  useEffect(() => {
    if (currentView === 'chat' && user) {
      const pollMessages = async () => {
        try {
          const history = await fetchUserChatHistory(user.id);
          if (history && history.length > 0) {
            const mappedMessages = history.map((msg: any) => ({
              id: msg.id,
              sender: (msg.sender === 'admin' || msg.sender === 'librarian') ? Sender.ADMIN : (msg.sender === 'user' ? Sender.USER : Sender.BOT),
              text: msg.text,
              timestamp: new Date(msg.timestamp),
              isError: false
            }));

            if (messages.length === 0) {
              const initialMsg: ChatMessage = {
                id: 'init',
                sender: Sender.BOT,
                text: `Chào ${user.name}! 👋\n\nMình là **DTU LibBot**, trợ lý ảo chính thức của Thư viện Đại học Duy Tân.\n\nMình sẵn sàng hỗ trợ bạn tra cứu sách, tìm hiểu nội quy thư viện hoặc thông tin về giờ mở cửa. Bạn cần giúp gì cho việc học tập hôm nay?`,
                timestamp: new Date()
              };
              setMessages([initialMsg, ...mappedMessages]);
            } else {
              // Simple set for now
              // setMessages(mappedMessages);
            }
          }
        } catch (error) {
          console.error("Polling error", error);
        }
      };

      const interval = setInterval(pollMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [currentView, user]);

  // Auto-scroll
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (currentView === 'chat') {
      scrollToBottom();
    }
  }, [messages, currentView]);

  const handleLogin = (role: UserRole, name: string) => {
    setUser({
      id: Date.now().toString(),
      name,
      role
    });
    // Redirect Admin and Librarian to Admin Dashboard initially
    setCurrentView(role === 'student' ? 'dashboard' : 'admin-dashboard');
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
    setMessages([]);
    setCurrentView('introduction');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // Handler to open borrow modal (used in Dashboard AND Chat)
  const handleOpenBorrow = (book: Book) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setSelectedBook(book);
    setIsBorrowModalOpen(true);
  };

  // Handler for successful borrow from Modal
  const handleBorrowSuccess = async (bookTitle: string, date: string, time: string) => {
    // 1. Add to Loan History (Reserved Status)
    if (selectedBook && user) {
      const newLoanData: Omit<LoanRecord, 'id'> = {
        bookId: selectedBook.id,
        bookTitle: selectedBook.title,
        author: selectedBook.author,
        borrowDate: date,
        dueDate: "", // Not determined until picked up
        status: 'Reserved',
        coverUrl: selectedBook.coverUrl,
        pickupTime: time
      };

      try {
        const newLoan = await createLoan(newLoanData);
        setLoans(prev => [newLoan, ...prev]);
      } catch (error) {
        console.error("Failed to create loan:", error);
        // Fallback for UI if API fails
        const fallbackLoan: LoanRecord = {
          ...newLoanData,
          id: Date.now().toString()
        };
        setLoans(prev => [fallbackLoan, ...prev]);
      }
    }

    // 2. Send Success Message to Chat
    const successMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: Sender.BOT,
      text: `✅ Đăng ký mượn sách **${bookTitle}** thành công!\n\nVui lòng đến thư viện nhận sách vào lúc **${time} ngày ${date}**.\n\nBạn có thể kiểm tra lại trong phần "Lịch sử mượn sách".`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, successMsg]);

    // Optional: Scroll to bottom if we are in chat
    if (currentView === 'chat') {
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleSend = async (text: string, image?: string) => {
    const userMsgId = Date.now().toString();
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: Sender.USER,
      text: text,
      image: image,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Pass userId and userName to backend for chat history
      const response = await sendMessage(text, user?.id, user?.name);

      const botMsgId = (Date.now() + 1).toString();
      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: Sender.BOT,
        text: response.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      const errorId = (Date.now() + 2).toString();
      setMessages(prev => [
        ...prev,
        {
          id: errorId,
          sender: Sender.BOT,
          text: "Xin lỗi, đã có lỗi xảy ra khi kết nối với server.",
          timestamp: new Date(),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch sử chat?")) {
      setMessages([{
        id: Date.now().toString(),
        sender: Sender.BOT,
        text: "Lịch sử trò chuyện đã được xóa. Mình có thể giúp gì cho bạn?",
        timestamp: new Date()
      }]);
    }
  };

  const handleNavigateToChat = (initialMessage?: string) => {
    setCurrentView('chat');
    if (initialMessage) {
      // Small timeout to allow view transition before sending
      setTimeout(() => {
        handleSend(initialMessage);
      }, 300);
    }
  };

  const getHeaderTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Tổng quan';
      case 'admin-dashboard': return user?.role === 'admin' ? 'Tổng quan Admin' : 'Tổng quan Thư viện';
      case 'admin-books': return 'Quản lý sách';
      case 'admin-chat': return 'Hỗ trợ trực tuyến';
      case 'admin-faq': return 'Quản lý FAQ';
      case 'admin-ai-training': return 'Huấn luyện AI';
      case 'admin-logs': return 'Log hệ thống';
      case 'chat': return 'DTU LibBot';
      case 'history': return 'Sổ tay thư viện';
      case 'introduction': return 'Giới thiệu';
      case 'notification': return 'Thông báo';
      case 'guide': return 'Hướng dẫn';
      default: return 'DTU Library';
    }
  };

  if (showLogin) {
    return (
      <div className="relative animate-fade-in">
        <Login
          onLogin={handleLogin}
          onBack={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      </div>
    );
  }

  if (showRegister) {
    return (
      <div className="relative animate-fade-in">
        <Register
          onRegisterSuccess={(username) => {
            setShowRegister(false);
            setShowLogin(true);
          }}
          onBack={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden ${settings.theme === 'dark' ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      <BorrowModal
        book={selectedBook}
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        onBorrowSuccess={handleBorrowSuccess}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
      />

      <ErrorReportModal
        isOpen={isErrorReportOpen}
        onClose={() => setIsErrorReportOpen(false)}
        userId={user?.id}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        userRole={user?.role}
        userName={user?.name}
        onLogout={handleLogout}
        onLogin={() => setShowLogin(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative lg:ml-[280px] transition-all duration-300">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
            >
              <Menu size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-bold text-red-700 dark:text-red-500">
              {getHeaderTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden md:flex items-center gap-2 mr-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user.name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-gray-600 text-brand-600 dark:text-brand-400 font-bold border border-gray-200 dark:border-gray-500 uppercase">
                  {user.role}
                </span>
              </div>
            )}
            {currentView === 'chat' && (
              <button
                onClick={clearHistory}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Xóa lịch sử chat"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <SettingsIcon size={20} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 relative">
          {currentView === 'dashboard' && (
            <Dashboard
              books={books}
              setBooks={setBooks}
              onOpenBorrow={handleOpenBorrow}
              onNavigateToChat={handleNavigateToChat}
              onViewChange={setCurrentView}
            />
          )}

          {(currentView === 'admin-dashboard' || currentView === 'admin-books') && (
            <AdminDashboard
              books={books}
              loans={loans}
              setBooks={setBooks}
              userRole={user?.role || 'student'}
              currentView={currentView}
              onAddBook={handleAddBook}
              onUpdateBook={handleUpdateBook}
              onDeleteBook={handleDeleteBook}
            />
          )}

          {currentView === 'admin-chat' && <AdminChat adminName={user?.name || 'Admin'} />}
          {currentView === 'admin-faq' && <AdminFAQ />}
          {currentView === 'admin-ai-training' && <AdminAITraining />}
          {currentView === 'admin-logs' && <AdminLogs />}

          {currentView === 'introduction' && (user?.role === 'admin' || user?.role === 'librarian') && <AdminIntroduction />}
          {currentView === 'notification' && (user?.role === 'admin' || user?.role === 'librarian') && <AdminNotification />}
          {currentView === 'guide' && (user?.role === 'admin' || user?.role === 'librarian') && <AdminGuide />}

          {currentView === 'history' && (
            <LoanHistory loans={loans} />
          )}

          {currentView === 'introduction' && (!user || user.role === 'student') && (
            <Introduction
              onRequireLogin={() => setShowLogin(true)}
              books={books}
              user={user}
              onOpenBorrow={handleOpenBorrow}
            />
          )}

          {currentView === 'notification' && (!user || user.role === 'student') && (
            <Notification />
          )}

          {currentView === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 pb-20 scroll-smooth">
                <div className="max-w-3xl mx-auto space-y-6">
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      fontSize={settings.fontSize}
                      books={books}
                      onBorrow={handleOpenBorrow}
                    />
                  ))}

                  {isLoading && messages[messages.length - 1]?.sender === Sender.USER && (
                    <div className="flex justify-start mb-4 animate-pulse">
                      <div className="bg-gray-200 dark:bg-gray-700 h-8 w-16 rounded-2xl rounded-tl-none"></div>
                    </div>
                  )}

                  <div ref={messagesEndRef} className="h-4" />
                </div>
              </div>

              {/* Input Area */}
              <ChatInput onSend={handleSend} isLoading={isLoading} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;