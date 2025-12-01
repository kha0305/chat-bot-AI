import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Cpu, RefreshCw, MessageSquare, Send } from 'lucide-react';
import { trainAI, fetchAIStats, sendMessage } from '../services/api';

const AdminAITraining: React.FC = () => {
    const [trainingText, setTrainingText] = useState('');
    const [isTraining, setIsTraining] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [stats, setStats] = useState({ accuracy: 0, dataLearned: 0, lastUpdated: '' });

    // Test AI State
    const [testQuestion, setTestQuestion] = useState('');
    const [testResponse, setTestResponse] = useState('');
    const [isTesting, setIsTesting] = useState(false);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await fetchAIStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to load stats", error);
        }
    };

    const handleTrain = async () => {
        if (!trainingText.trim()) return;

        setIsTraining(true);
        setStatus('idle');

        try {
            await trainAI(trainingText);
            setStatus('success');
            setTrainingText('');
            loadStats(); // Reload stats
        } catch (error) {
            setStatus('error');
        } finally {
            setIsTraining(false);
        }
    };

    const handleTestAI = async () => {
        if (!testQuestion.trim()) return;

        setIsTesting(true);
        setTestResponse('');

        try {
            // Use 'admin-test' as a dummy user ID for testing
            const response = await sendMessage(testQuestion, 'admin-test', 'Admin');
            setTestResponse(response.message);
        } catch (error) {
            setTestResponse("Lỗi khi kết nối với AI.");
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Cpu className="text-brand-600" /> Huấn luyện AI
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Cập nhật kiến thức cho Chatbot bằng cách cung cấp văn bản hoặc tài liệu mới.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Input Section */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Nhập văn bản huấn luyện
                        </label>
                        <textarea
                            value={trainingText}
                            onChange={(e) => setTrainingText(e.target.value)}
                            className="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:bg-gray-700 dark:text-white resize-none"
                            placeholder="Ví dụ: Thư viện mới cập nhật quy định về mượn sách giáo trình. Sinh viên được mượn tối đa 7 cuốn trong 30 ngày..."
                        />
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-xs text-gray-400">
                                {trainingText.length} ký tự
                            </span>
                            <button
                                onClick={handleTrain}
                                disabled={isTraining || !trainingText.trim()}
                                className={`px-6 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 transition-all ${isTraining || !trainingText.trim()
                                    ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                                    : 'bg-brand-600 hover:bg-brand-700 shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isTraining ? (
                                    <>
                                        <RefreshCw size={18} className="animate-spin" /> Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <Cpu size={18} /> Bắt đầu huấn luyện
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Status Messages */}
                    {status === 'success' && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-xl flex items-center gap-3 text-green-700 dark:text-green-400 animate-fade-in">
                            <CheckCircle size={24} />
                            <div>
                                <p className="font-bold">Huấn luyện thành công!</p>
                                <p className="text-sm">Dữ liệu mới đã được cập nhật vào mô hình AI.</p>
                            </div>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400 animate-fade-in">
                            <AlertCircle size={24} />
                            <div>
                                <p className="font-bold">Huấn luyện thất bại!</p>
                                <p className="text-sm">Vui lòng thử lại sau.</p>
                            </div>
                        </div>
                    )}

                    {/* Test AI Section */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <MessageSquare size={20} className="text-blue-600" /> Thử nghiệm Model
                        </h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={testQuestion}
                                onChange={(e) => setTestQuestion(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleTestAI()}
                                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white"
                                placeholder="Đặt câu hỏi để kiểm tra AI..."
                            />
                            <button
                                onClick={handleTestAI}
                                disabled={isTesting || !testQuestion.trim()}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700"
                            >
                                {isTesting ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} />}
                            </button>
                        </div>

                        {testResponse && (
                            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 animate-fade-in">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">AI trả lời:</p>
                                <p className="text-gray-800 dark:text-gray-200">{testResponse}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                        <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                            <FileText size={20} /> Hướng dẫn
                        </h3>
                        <ul className="space-y-3 text-sm text-blue-700 dark:text-blue-400">
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                Cung cấp thông tin rõ ràng, mạch lạc.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                Tránh sử dụng từ ngữ địa phương hoặc tiếng lóng.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                Cập nhật từng chủ đề một để AI học tốt nhất.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-4">Trạng thái Model</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500 dark:text-gray-400">Độ chính xác</span>
                                    <span className="font-bold text-green-600">{stats.accuracy}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: `${stats.accuracy}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500 dark:text-gray-400">Dữ liệu đã học</span>
                                    <span className="font-bold text-blue-600">{stats.dataLearned} mẫu</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: '75%' }}></div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-xs text-gray-400">
                                    Cập nhật lần cuối: {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString('vi-VN') : 'Chưa có dữ liệu'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAITraining;
