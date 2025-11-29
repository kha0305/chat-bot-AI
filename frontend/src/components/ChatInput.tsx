import React, { useState, useRef } from 'react';
import { Send, Mic, Image as ImageIcon, X } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string, image?: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((input.trim() || selectedImage) && !isLoading) {
      onSend(input.trim(), selectedImage || undefined);
      setInput('');
      setSelectedImage(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset value so the same file can be selected again if needed
    e.target.value = '';
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 sticky bottom-0 z-20 transition-colors">
      
      {/* Suggested Questions */}
      {!input && !selectedImage && (
        <div className="max-w-4xl mx-auto mb-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            "Thư viện mở cửa khi nào?",
            "Làm sao để mượn sách?",
            "Tìm sách về AI",
            "Quy định phạt quá hạn",
            "Gặp nhân viên"
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => onSend(q)}
              className="whitespace-nowrap px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-brand-100 dark:hover:bg-brand-900/30 text-gray-600 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-600 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Image Preview */}
      {selectedImage && (
        <div className="max-w-4xl mx-auto mb-2 flex items-start">
          <div className="relative">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="h-20 w-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm"
            />
            <button 
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 shadow-md hover:bg-red-500 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto relative flex items-end gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-xl transition-all shadow-sm">
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        <button 
          onClick={triggerFileInput}
          disabled={isLoading}
          className="p-2 text-gray-400 dark:text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
          title="Gửi ảnh"
        >
          <ImageIcon size={20} />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Hỏi về sách, quy định thư viện..."
          disabled={isLoading}
          className="w-full bg-transparent border-0 focus:ring-0 resize-none py-3 px-2 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 max-h-[120px] overflow-y-auto"
          rows={1}
        />
        
        <button 
          onClick={() => alert("Tính năng nhận diện giọng nói đang phát triển!")}
          className="p-2 text-gray-400 dark:text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block"
          title="Voice Input (Demo)"
        >
          <Mic size={20} />
        </button>

        <button
          onClick={handleSend}
          disabled={(!input.trim() && !selectedImage) || isLoading}
          className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
            (input.trim() || selectedImage) && !isLoading
              ? 'bg-brand-600 text-white shadow-md hover:bg-brand-700 dark:bg-brand-700 dark:hover:bg-brand-600'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
        >
          <Send size={20} />
        </button>
      </div>
      <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
        LibBot có thể mắc lỗi. Hãy kiểm tra lại thông tin quan trọng.
      </div>
    </div>
  );
};

export default ChatInput;