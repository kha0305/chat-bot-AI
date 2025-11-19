import React from 'react';
import { ChatMessage, Sender, FontSize } from '../types';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  fontSize?: FontSize;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, fontSize = 'medium' }) => {
  const isUser = message.sender === Sender.USER;

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

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in group`}>
      <div className={`flex max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${isUser ? 'bg-brand-600 dark:bg-brand-700' : 'bg-emerald-600 dark:bg-emerald-700'} text-white shadow-sm mt-0.5`}>
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0`}>
          <div 
            className={`px-5 py-3.5 shadow-md overflow-hidden transition-all ${getTextSizeClass()} ${
              isUser 
                ? 'bg-brand-600 dark:bg-brand-700 text-white rounded-2xl rounded-tr-none' 
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
          <span className={`text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);