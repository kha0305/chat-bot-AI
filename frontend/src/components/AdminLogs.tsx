import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, FileText, RefreshCw } from 'lucide-react';
import { SystemLog, ErrorReport } from '../types';
import { fetchSystemLogs, fetchErrorReports } from '../services/api';

const AdminLogs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'system' | 'errors'>('system');
    const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
    const [errorReports, setErrorReports] = useState<ErrorReport[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'system') {
                const logs = await fetchSystemLogs();
                setSystemLogs(logs);
            } else {
                const reports = await fetchErrorReports();
                setErrorReports(reports);
            }
        } catch (error) {
            console.error("Failed to load logs", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Activity className="text-brand-600" /> Log hệ thống
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Theo dõi hoạt động và báo cáo lỗi</p>
                </div>
                <button
                    onClick={loadData}
                    className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title="Làm mới"
                >
                    <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('system')}
                    className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'system'
                            ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    Hoạt động Chatbot
                </button>
                <button
                    onClick={() => setActiveTab('errors')}
                    className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'errors'
                            ? 'border-red-600 text-red-600 dark:text-red-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    Báo cáo lỗi
                </button>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-bold">Thời gian</th>
                                    <th className="p-4 font-bold">Người dùng</th>
                                    <th className="p-4 font-bold">{activeTab === 'system' ? 'Câu hỏi' : 'Mô tả lỗi'}</th>
                                    <th className="p-4 font-bold">{activeTab === 'system' ? 'Phản hồi' : 'Mức độ'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {activeTab === 'system' ? (
                                    systemLogs.length > 0 ? systemLogs.map(log => (
                                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="p-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleString('vi-VN')}
                                            </td>
                                            <td className="p-4 text-sm font-medium text-gray-800 dark:text-white">
                                                {log.username}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate" title={log.question}>
                                                {log.question}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate" title={log.response}>
                                                {log.response}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-gray-500">Chưa có dữ liệu log.</td>
                                        </tr>
                                    )
                                ) : (
                                    errorReports.length > 0 ? errorReports.map(report => (
                                        <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="p-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                {new Date(report.thoi_gian).toLocaleString('vi-VN')}
                                            </td>
                                            <td className="p-4 text-sm font-medium text-gray-800 dark:text-white">
                                                {report.ten_dang_nhap || 'Ẩn danh'}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate" title={report.mo_ta_loi}>
                                                {report.mo_ta_loi}
                                            </td>
                                            <td className="p-4 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${report.muc_do === 'critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {report.muc_do === 'critical' ? 'Nghiêm trọng' : 'Bình thường'}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-gray-500">Chưa có báo cáo lỗi nào.</td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLogs;
