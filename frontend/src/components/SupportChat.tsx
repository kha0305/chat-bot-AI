import React, { useState, useEffect, useRef } from 'react';
import { Send, User as UserIcon } from 'lucide-react';
import { User, ChatMessage, Sender } from '../types';
import { createSupportSession, fetchSupportMessages, sendSupportMessage, checkActiveSupportSession } from '../services/api';

interface SupportChatProps {
    user: User;
}

const SupportChat: React.FC<SupportChatProps> = ({ user }) => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Check for active session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await checkActiveSupportSession(user.id);
                if (res.active) {
                    setSessionId(res.sessionId);
                }
            } catch (error) {
                console.error("Error checking session:", error);
            }
        };
        checkSession();
    }, [user.id]);

    // Poll messages if session exists
    useEffect(() => {
        if (!sessionId) return;

        const loadMessages = async () => {
            try {
                const msgs = await fetchSupportMessages(sessionId);
                const mapped: ChatMessage[] = msgs.map((m: any) => ({
                    id: m.id.toString(),
                    sender: m.nguoi_gui_id.toString() === user.id ? Sender.USER : Sender.ADMIN,
                    text: m.noi_dung,
                    timestamp: new Date(m.thoi_gian)
                }));
                setMessages(mapped);
            } catch (error) {
                console.error("Error loading messages:", error);
            }
        };

        loadMessages();
        const interval = setInterval(loadMessages, 3000);
        return () => clearInterval(interval);
    }, [sessionId, user.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleStartChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setIsLoading(true);
        try {
            const res = await createSupportSession(user.id, input);
            if (res.success) {
                setSessionId(res.sessionId);
                setInput('');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !sessionId) return;
        
        // Optimistic update
        const newMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: Sender.USER,
            text: input,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMsg]);
        const msgToSend = input;
        setInput('');

        try {
            await sendSupportMessage(sessionId, user.id, msgToSend);
        } catch (error) {
            console.error(error);
            // Revert or show error
        }
    };

    if (!sessionId) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600 dark:text-brand-400">
                        <UserIcon size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Hỗ trợ trực tuyến</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Kết nối trực tiếp với nhân viên thư viện để được giải đáp thắc mắc nhanh chóng.
                    </p>
                    <form onSubmit={handleStartChat} className="w-full">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập nội dung bạn cần hỗ trợ..."
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none resize-none h-32"
                            required
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Đang kết nối...' : 'Bắt đầu chat'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl ${
                            msg.sender === Sender.USER 
                                ? 'bg-brand-600 text-white rounded-tr-none' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-none'
                        }`}>
                            <p>{msg.text}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
                <button 
                    type="submit" 
                    className="p-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default SupportChat;
