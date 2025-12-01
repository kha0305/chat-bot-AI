import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Search, Send } from 'lucide-react';
import { fetchSupportSessions, fetchSupportMessages, sendSupportMessage } from '../services/api';

interface SupportSession {
  id: number;
  nguoi_dung_id: number;
  ten_nguoi_dung: string;
  noi_dung: string;
  trang_thai: string;
  thoi_gian_tao: string;
}

interface AdminChatProps {
  adminId: string;
  adminName: string;
}

const AdminChat: React.FC<AdminChatProps> = ({ adminId, adminName }) => {
  const [sessions, setSessions] = useState<SupportSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll for sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await fetchSupportSessions();
        setSessions(data);
      } catch (error) {
        console.error("Failed to load sessions", error);
      }
    };

    loadSessions();
    const interval = setInterval(loadSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  // Poll for messages
  useEffect(() => {
    if (!selectedSessionId) return;

    const loadMessages = async () => {
      try {
        const data = await fetchSupportMessages(selectedSessionId.toString());
        const mapped = data.map((m: any) => ({
            id: m.id,
            text: m.noi_dung,
            sender: m.nguoi_gui_id.toString() === adminId ? 'admin' : 'user',
            timestamp: m.thoi_gian,
            senderName: m.ten_nguoi_gui
        }));
        setMessages(mapped);
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedSessionId, adminId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedSessionId) return;

    const text = inputText;
    setInputText('');

    // Optimistic update
    const tempMsg = {
<<<<<<< HEAD
        id: Date.now(),
        sender: 'admin',
        text: text,
        timestamp: new Date().toISOString()
=======
      id: Date.now().toString(),
      sender: 'admin',
      text: text,
      timestamp: new Date().toISOString()
>>>>>>> fb1c7d176fb29e659c8d81038222541234973446
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      await sendSupportMessage(selectedSessionId.toString(), adminId, text);
    } catch (error) {
      console.error("Failed to send", error);
    }
  };

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden animate-fade-in">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <MessageSquare size={20} className="text-brand-600" />
            Hỗ trợ trực tuyến
          </h2>
<<<<<<< HEAD
=======
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm sinh viên..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
>>>>>>> fb1c7d176fb29e659c8d81038222541234973446
        </div>

        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
<<<<<<< HEAD
            <div className="p-8 text-center text-gray-500 text-sm">
              Chưa có yêu cầu hỗ trợ nào.
=======
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <MessageSquare size={32} className="mb-3 opacity-50" />
              <p className="text-sm">Chưa có cuộc hội thoại nào</p>
>>>>>>> fb1c7d176fb29e659c8d81038222541234973446
            </div>
          ) : (
            sessions.map(session => (
              <button
<<<<<<< HEAD
                key={session.id}
                onClick={() => setSelectedSessionId(session.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left border-b border-gray-100 dark:border-gray-700/50 ${
                  selectedSessionId === session.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
=======
                key={session.user.id}
                onClick={() => setSelectedSessionId(session.user.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left border-b border-gray-100 dark:border-gray-700/50 ${selectedSessionId === session.user.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
>>>>>>> fb1c7d176fb29e659c8d81038222541234973446
              >
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 font-bold shrink-0">
                  {session.ten_nguoi_dung.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                      {session.ten_nguoi_dung}
                    </h3>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
<<<<<<< HEAD
                      {new Date(session.thoi_gian_tao).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
=======
                      {new Date(session.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
>>>>>>> fb1c7d176fb29e659c8d81038222541234973446
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                    {session.noi_dung}
                  </p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block ${
                      session.trang_thai === 'cho_xu_ly' ? 'bg-yellow-100 text-yellow-700' : 
                      session.trang_thai === 'dang_xu_ly' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                      {session.trang_thai === 'cho_xu_ly' ? 'Chờ xử lý' : 
                       session.trang_thai === 'dang_xu_ly' ? 'Đang hỗ trợ' : 'Đã xong'}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900/50">
        {selectedSessionId ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 font-bold">
                  {selectedSession?.ten_nguoi_dung.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white text-sm">
                    {selectedSession?.ten_nguoi_dung}
                  </h3>
                  <p className="text-xs text-gray-500">
                    ID: {selectedSession?.nguoi_dung_id}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => {
                const isMe = msg.sender === 'admin';
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${isMe
                        ? 'bg-brand-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700 rounded-bl-none'
                      }`}>
                      <p>{msg.text}</p>
                      <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-brand-200' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p>Chọn một cuộc hội thoại để bắt đầu hỗ trợ</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
