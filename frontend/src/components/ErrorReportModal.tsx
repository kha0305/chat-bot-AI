import React, { useState } from 'react';
import { AlertTriangle, X, Send } from 'lucide-react';
import { sendErrorReport } from '../services/api';

interface ErrorReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId?: string;
}

const ErrorReportModal: React.FC<ErrorReportModalProps> = ({ isOpen, onClose, userId }) => {
    const [description, setDescription] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        try {
            await sendErrorReport(userId, description, 'normal');
            setSent(true);
            setTimeout(() => {
                setSent(false);
                setDescription('');
                onClose();
            }, 2000);
        } catch (error) {
            alert('Gửi báo cáo thất bại. Vui lòng thử lại.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6 animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Báo cáo lỗi</h3>
                </div>

                {sent ? (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                            <Send size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Đã gửi báo cáo!</h4>
                        <p className="text-gray-500 dark:text-gray-400">Cảm ơn bạn đã đóng góp ý kiến.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Mô tả sự cố
                            </label>
                            <textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:bg-gray-700 dark:text-white resize-none"
                                placeholder="Vui lòng mô tả chi tiết lỗi bạn gặp phải..."
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg font-medium"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isSending || !description.trim()}
                                className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center gap-2 ${isSending ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSending ? 'Đang gửi...' : 'Gửi báo cáo'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ErrorReportModal;
