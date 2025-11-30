import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { FAQItem } from '../types';
import { fetchFAQs, createFAQ, updateFAQ, deleteFAQ } from '../services/api';

const AdminFAQ: React.FC = () => {
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Omit<FAQItem, 'id'>>({ question: '', answer: '', category: 'Chung' });
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadFAQs();
    }, []);

    const loadFAQs = async () => {
        setIsLoading(true);
        try {
            const data = await fetchFAQs();
            setFaqs(data);
        } catch (error) {
            console.error("Failed to load FAQs", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (faq: FAQItem) => {
        setIsEditing(faq.id);
        setEditForm({ question: faq.question, answer: faq.answer, category: faq.category });
        setIsAdding(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
            try {
                await deleteFAQ(id);
                setFaqs(prev => prev.filter(f => f.id !== id));
            } catch (error) {
                alert('Lỗi khi xóa FAQ');
            }
        }
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await updateFAQ(isEditing, editForm);
                setFaqs(prev => prev.map(f => f.id === isEditing ? { ...f, ...editForm } : f));
                setIsEditing(null);
            } else if (isAdding) {
                const newFaq = await createFAQ(editForm);
                setFaqs(prev => [newFaq, ...prev]);
                setIsAdding(false);
            }
            setEditForm({ question: '', answer: '', category: 'Chung' });
        } catch (error) {
            alert('Lỗi khi lưu FAQ');
        }
    };

    const handleCancel = () => {
        setIsEditing(null);
        setIsAdding(false);
        setEditForm({ question: '', answer: '', category: 'Chung' });
    };

    return (
        <div className="p-6 max-w-5xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Quản lý FAQ</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Cập nhật câu hỏi thường gặp cho Chatbot</p>
                </div>
                <button
                    onClick={() => { setIsAdding(true); setIsEditing(null); setEditForm({ question: '', answer: '', category: 'Chung' }); }}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                    <Plus size={18} /> Thêm câu hỏi
                </button>
            </div>

            {(isAdding || isEditing) && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 animate-slide-in">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{isAdding ? 'Thêm câu hỏi mới' : 'Chỉnh sửa câu hỏi'}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Câu hỏi</label>
                            <input
                                type="text"
                                value={editForm.question}
                                onChange={e => setEditForm({ ...editForm, question: e.target.value })}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none dark:bg-gray-700 dark:text-white"
                                placeholder="Nhập câu hỏi..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Câu trả lời</label>
                            <textarea
                                value={editForm.answer}
                                onChange={e => setEditForm({ ...editForm, answer: e.target.value })}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none dark:bg-gray-700 dark:text-white h-24"
                                placeholder="Nhập câu trả lời..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Danh mục</label>
                            <select
                                value={editForm.category}
                                onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none dark:bg-gray-700 dark:text-white"
                            >
                                <option>Chung</option>
                                <option>Giờ giấc</option>
                                <option>Thủ tục</option>
                                <option>Quy định</option>
                                <option>Tài khoản</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={handleCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg">Hủy</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg flex items-center gap-2">
                                <Save size={18} /> Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
            ) : (
                <div className="grid gap-4">
                    {faqs.length === 0 && <p className="text-center text-gray-500">Chưa có câu hỏi nào.</p>}
                    {faqs.map(faq => (
                        <div key={faq.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                                            {faq.category}
                                        </span>
                                        <h4 className="font-bold text-gray-800 dark:text-white">{faq.question}</h4>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{faq.answer}</p>
                                </div>
                                <div className="flex items-center gap-1 ml-4">
                                    <button
                                        onClick={() => handleEdit(faq)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faq.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminFAQ;
