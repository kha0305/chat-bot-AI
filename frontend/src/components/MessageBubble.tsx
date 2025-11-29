import React from 'react';
import { ChatMessage, Sender, FontSize, Book } from '../types';
import { User, Bot, CalendarCheck, Book as BookIcon, ChevronRight, ShieldCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  fontSize?: FontSize;
  books?: Book[];
  onBorrow?: (book: Book) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, fontSize = 'medium', books, onBorrow }) => {
  const isUser = message.sender === Sender.USER;
  const isAdmin = message.sender === Sender.ADMIN;

  // Simple parser to handle bolding
  const formatText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <b key={index} className="font-bold text-brand-700 dark:text-brand-400">{part.slice(2, -2)}</b>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Determine text size class based on setting
  const getTextSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-xs sm:text-sm leading-relaxed';
      case 'large': return 'text-base sm:text-lg leading-relaxed';
      default: return 'text-sm sm:text-[15px] leading-relaxed';
    }
  };

  // Extract Mentioned Books
  // We look for book titles from our 'books' prop that appear in the message text.
  let mentionedBooks: Book[] = [];
  if (!isUser && !isAdmin && books && onBorrow) {
    // Sort books by title length descending to match longest titles first to avoid partial matches errors
    const sortedBooks = [...books].sort((a, b) => b.title.length - a.title.length);
    // Use a Set to avoid duplicates if book is mentioned multiple times
    const foundBooks = new Set<string>();
    
    sortedBooks.forEach(book => {
        if (message.text.includes(book.title)) {
            foundBooks.add(book.id);
        }
    });

    // Convert back to Book objects, maintaining the order of availability or relevance if needed
    // Here we just map ids back to books
    mentionedBooks = books.filter(b => foundBooks.has(b.id));
  }

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in group`}>
      <div className={`flex max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
          isUser ? 'bg-brand-600 dark:bg-brand-700' : 
          isAdmin ? 'bg-orange-500 dark:bg-orange-600' : 'bg-emerald-600 dark:bg-emerald-700'
        } text-white shadow-sm mt-0.5`}>
          {isUser ? <User size={18} /> : isAdmin ? <ShieldCheck size={18} /> : <Bot size={18} />}
        </div>

        {/* Bubble content wrapper */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0 w-full`}>
          <div 
            className={`px-5 py-3.5 shadow-md overflow-hidden transition-all ${getTextSizeClass()} ${
              isUser 
                ? 'bg-brand-600 dark:bg-brand-700 text-white rounded-2xl rounded-tr-none' 
                : isAdmin
                ? 'bg-orange-50 dark:bg-orange-900/20 text-gray-800 dark:text-gray-100 border border-orange-200 dark:border-orange-800 rounded-2xl rounded-tl-none'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-none'
            } ${message.isError ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' : ''}`}
          >
            {message.image && (
              <div className="mb-3 -mt-1 -mx-2">
                <img 
                  src={message.image} 
                  alt="User uploaded" 
                  className="max-w-full rounded-lg border border-white/20" 
                  style={{ maxHeight: '250px' }}
                />
              </div>
            )}

            {message.isError ? (
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{message.text}</span>
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words">
                {formatText(message.text)}
              </div>
            )}
          </div>

          {/* Book Action Cards (Horizontal Scroll if multiple) */}
          {mentionedBooks.length > 0 && onBorrow && (
            <div className="mt-3 w-full overflow-x-auto pb-2 -mx-1 px-1 custom-scrollbar">
              <div className="flex gap-3">
                {mentionedBooks.map(book => (
                  <div key={book.id} className="min-w-[240px] max-w-[240px] p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-2 animate-fade-in hover:shadow-md transition-shadow">
                    <div className="flex gap-3">
                      <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden shrink-0">
                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-gray-800 dark:text-white line-clamp-2" title={book.title}>{book.title}</h4>
                        <p className="text-[10px] text-gray-500 line-clamp-1">{book.author}</p>
                        <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded border ${
                          book.status === 'Available' 
                            ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {book.status === 'Available' ? 'Có sẵn' : 'Đã hết'}
                        </span>
                      </div>
                    </div>
                    
                    {book.status === 'Available' ? (
                      <button 
                        onClick={() => onBorrow(book)}
                        className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5 text-xs font-bold uppercase"
                      >
                        <CalendarCheck size={14} />
                        Đặt lịch mượn
                      </button>
                    ) : (
                      <button disabled className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-400 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-bold uppercase cursor-not-allowed">
                        Tạm hết sách
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <span className={`text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);