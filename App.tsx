import React, { useState, useRef, useEffect } from 'react';
import { Menu, Trash2, MessageSquare, Settings as SettingsIcon } from 'lucide-react';
import ChatInput from './components/ChatInput';
import MessageBubble from './components/MessageBubble';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import LoanHistory from './components/LoanHistory';
import SettingsModal from './components/SettingsModal';
import BorrowModal from './components/BorrowModal';
import { ChatMessage, Sender, ViewState, AppSettings, User, UserRole, Book, LoanRecord } from './types';
import { createChatSession, sendMessageStream } from './services/geminiService';
import { Chat } from '@google/genai';
import { MOCK_BOOKS, MOCK_HISTORY } from './constants';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  
  // Global Data State
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [loans, setLoans] = useState<LoanRecord[]>(MOCK_HISTORY);

  // Modal State (Lifted from Dashboard)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);

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
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        try {
            chatSessionRef.current = createChatSession();
            const initialMsg: ChatMessage = {
                id: 'init',
                sender: Sender.BOT,
                text: `Chào ${user.name}! 👋\n\nMình là **DTU LibBot**, trợ lý ảo chính thức của Thư viện Đại học Duy Tân.\n\nMình sẵn sàng hỗ trợ bạn tra cứu sách, tìm hiểu nội quy thư viện hoặc thông tin về giờ mở cửa. Bạn cần giúp gì cho việc học tập hôm nay?`,
                timestamp: new Date()
            };
            setMessages([initialMsg]);
        } catch (e) {
            const errorMsg: ChatMessage = {
                id: 'err-init',
                sender: Sender.BOT,
                text: "⚠️ Không tìm thấy API Key.\n\nVui lòng đảm bảo bạn đã cấu hình biến môi trường `API_KEY` trong phần cài đặt của dự án.",
                timestamp: new Date(),
                isError: true
            };
            setMessages([errorMsg]);
        }
    }
  }, [user, messages.length]);

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
  };

  const handleLogout = () => {
    setUser(null);
    setMessages([]);
    chatSessionRef.current = null;
  };

  // Handler to open borrow modal (used in Dashboard AND Chat)
  const handleOpenBorrow = (book: Book) => {
    setSelectedBook(book);
    setIsBorrowModalOpen(true);
  };

  // Handler for successful borrow from Modal
  const handleBorrowSuccess = (bookTitle: string, date: string, time: string) => {
    // 1. Add to Loan History (Reserved Status)
    if (selectedBook) {
        const newLoan: LoanRecord = {
            id: Date.now().toString(),
            bookTitle: selectedBook.title,
            author: selectedBook.author,
            borrowDate: date,
            dueDate: "", // Not determined until picked up
            status: 'Reserved',
            coverUrl: selectedBook.coverUrl,
            pickupTime: time
        };
        setLoans(prev => [newLoan, ...prev]);
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
    if (!chatSessionRef.current) {
        try {
            chatSessionRef.current = createChatSession();
        } catch (e) {
            console.error("Failed to init session", e);
            return;
        }
    }

    const userMsgId = Date.now().toString();
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: Sender.USER,
      text: text,
      image: image,
      timestamp: new Date()
    };

    // Optimistically add user message
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const botMsgId = (Date.now() + 1).toString();
      
      // Create placeholder for bot message
      setMessages(prev => [
        ...prev, 
        {
          id: botMsgId,
          sender: Sender.BOT,
          text: "", // Will fill gradually
          timestamp: new Date()
        }
      ]);

      let accumulatedText = "";

      await sendMessageStream(chatSessionRef.current, text, image, (chunk) => {
        accumulatedText += chunk;
        
        // Update the last message with new chunk
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsgIndex = newMessages.findIndex(m => m.id === botMsgId);
          if (lastMsgIndex !== -1) {
            newMessages[lastMsgIndex] = {
              ...newMessages[lastMsgIndex],
              text: accumulatedText
            };
          }
          return newMessages;
        });
      });

    } catch (error) {
      const errorId = (Date.now() + 2).toString();
      setMessages(prev => [
        ...prev,
        {
          id: errorId,
          sender: Sender.BOT,
          text: "Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng kiểm tra kết nối hoặc API Key.",
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
        try {
            chatSessionRef.current = createChatSession(); // Reset context
            setMessages([{
                id: Date.now().toString(),
                sender: Sender.BOT,
                text: "Lịch sử trò chuyện đã được xóa. Mình có thể giúp gì cho bạn?",
                timestamp: new Date()
            }]);
        } catch (e) {
            console.error("Failed to reset session", e);
        }
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
      case 'chat': return 'DTU LibBot';
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

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenSettings={() => setIsSettingsOpen(true)}
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
                <button 
                    onClick={clearHistory}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Xóa lịch sử"
                >
                    <Trash2 size={18} />
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
                    />
                </div>
            )}

            {(currentView === 'admin-dashboard' || currentView === 'admin-books') && (
                <div className="flex-1 overflow-y-auto">
                    <AdminDashboard books={books} setBooks={setBooks} userRole={user.role} />
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