import React, { useState, useRef, useEffect } from 'react';
import { Menu, Trash2, MessageSquare, Settings as SettingsIcon, User as UserIcon } from 'lucide-react';
import ChatInput from './components/ChatInput';
import MessageBubble from './components/MessageBubble';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminChat from './components/AdminChat';
import SupportChat from './components/SupportChat';
import Login from './components/Login';
import LoanHistory from './components/LoanHistory';
import SettingsModal from './components/SettingsModal';
import BorrowModal from './components/BorrowModal';
import HelpModal from './components/HelpModal';
import ProfileModal from './components/ProfileModal';
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

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
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
    if (user && messages.length === 0 && user.role === 'student') {
        const initialMsg: ChatMessage = {
            id: 'init',
            sender: Sender.BOT,
            text: `Chào ${user.name}! 👋\n\nMình là **DTU LibBot**, trợ lý ảo chính thức của Thư viện Đại học Duy Tân.\n\nMình sẵn sàng hỗ trợ bạn tra cứu sách, tìm hiểu nội quy thư viện hoặc thông tin về giờ mở cửa. Bạn cần giúp gì cho việc học tập hôm nay?`,
            timestamp: new Date()
        };
        setMessages([initialMsg]);
    }
  }, [user, messages.length]);

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
                    
                    const initialMsg: ChatMessage = {
                        id: 'init',
                        sender: Sender.BOT,
                        text: `Chào ${user.name}! 👋\n\nMình là **DTU LibBot**, trợ lý ảo chính thức của Thư viện Đại học Duy Tân.\n\nMình sẵn sàng hỗ trợ bạn tra cứu sách, tìm hiểu nội quy thư viện hoặc thông tin về giờ mở cửa. Bạn cần giúp gì cho việc học tập hôm nay?`,
                        timestamp: new Date()
                    };
                    
                    setMessages([initialMsg, ...mappedMessages]);
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

  const handleLogin = (role: UserRole, name: string, id: string) => {
    setUser({
      id: id,
      name,
      role
    });
    // Redirect Admin and Librarian to Admin Dashboard initially
    setCurrentView(role === 'student' ? 'dashboard' : 'admin-dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setMessages([]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // Handler to open borrow modal (used in Dashboard AND Chat)
  const handleOpenBorrow = (book: Book) => {
    setSelectedBook(book);
    setIsBorrowModalOpen(true);
  };

  // Handler for successful borrow from Modal
  const handleBorrowSuccess = async (bookTitle: string, date: string, time: string) => {
    // 1. Add to Loan History (Reserved Status)
    if (selectedBook) {
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
    if(window.confirm("Bạn có chắc chắn muốn xóa lịch sử chat?")) {
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
      case 'admin-chat': return 'Hỗ trợ trực tuyến (Admin)';
      case 'chat': return 'DTU LibBot';
      case 'support-chat': return 'Chat với nhân viên';
      case 'history': return 'Sổ tay thư viện';
      default: return 'DTU Library';
    }
  };

  if (!user) {
    return (
        <>
            <SettingsModal 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
                settings={settings}
                onUpdateSettings={setSettings}
            />
            <Login onLogin={handleLogin} />
        </>
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

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        userRole={user.role}
        userName={user.name}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative w-full lg:ml-[280px] transition-all duration-300">
        
        {/* Header */}
        <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sticky top-0 z-10 transition-colors">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex flex-col">
                <h2 className="font-bold text-brand-700 dark:text-brand-500 text-lg transition-colors">
                    {getHeaderTitle()}
                </h2>
                {currentView === 'chat' && (
                    <span className="hidden lg:flex text-[10px] text-green-600 dark:text-green-400 items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Hệ thống Online
                    </span>
                )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentView === 'chat' ? (
                <div className="flex gap-2">
                    <button 
                        onClick={() => setCurrentView('support-chat')}
                        className="p-2 text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:hover:bg-brand-900/40 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                        title="Chat với nhân viên"
                    >
                        <UserIcon size={18} />
                        <span className="hidden sm:inline">Gặp nhân viên</span>
                    </button>
                    <button 
                        onClick={clearHistory}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Xóa lịch sử"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ) : currentView === 'support-chat' ? (
                <button 
                    onClick={() => setCurrentView('chat')}
                    className="p-2 text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:hover:bg-brand-900/40 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                >
                    <MessageSquare size={18} />
                    <span className="hidden sm:inline">Quay lại Bot</span>
                </button>
            ) : user.role === 'student' ? (
                <button 
                    onClick={() => setCurrentView('chat')}
                    className="p-2 text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:hover:bg-brand-900/40 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                >
                    <MessageSquare size={18} />
                    <span className="hidden sm:inline">Hỏi LibBot</span>
                </button>
            ) : null}
            <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
                <SettingsIcon size={18} />
            </button>
          </div>
        </header>

        {/* Main View Content */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50 dark:bg-gray-900 transition-colors">
            {currentView === 'dashboard' && (
                <div className="flex-1 overflow-y-auto">
                    <Dashboard 
                        onNavigateToChat={handleNavigateToChat} 
                        books={books}
                        setBooks={setBooks}
                        onOpenBorrow={handleOpenBorrow}
                        onUpdateBook={handleUpdateBook}
                    />
                </div>
            )}

            {(currentView === 'admin-dashboard' || currentView === 'admin-books') && (
                <div className="flex-1 overflow-y-auto">
                    <AdminDashboard 
                      books={books} 
                      loans={loans}
                      setBooks={setBooks} 
                      userRole={user.role} 
                      currentView={currentView}
                      onAddBook={handleAddBook}
                      onUpdateBook={handleUpdateBook}
                      onDeleteBook={handleDeleteBook}
                    />
                </div>
            )}

            {currentView === 'admin-chat' && (
                <div className="flex-1 p-6 overflow-hidden">
                    <AdminChat adminId={user.id} adminName={user.name} />
                </div>
            )}

            {currentView === 'support-chat' && (
                <div className="flex-1 overflow-hidden">
                    <SupportChat user={user} />
                </div>
            )}

            {currentView === 'history' && (
                <div className="flex-1 overflow-y-auto">
                    <LoanHistory loans={loans} />
                </div>
            )}

            {currentView === 'chat' && (
                <>
                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
                        <div className="max-w-3xl mx-auto flex flex-col gap-2 min-h-full">
                            {messages.length === 0 && (
                                <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                    <p>Đang khởi tạo...</p>
                                </div>
                            )}
                            
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