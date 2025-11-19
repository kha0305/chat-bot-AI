import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import { MOCK_HISTORY } from '../constants';
import { LoanRecord } from '../types';

const LoanHistory: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Borrowing' | 'Returned'>('All');

  const filteredHistory = MOCK_HISTORY.filter(record => {
    if (filter === 'All') return true;
    if (filter === 'Borrowing') return record.status === 'Borrowing' || record.status === 'Overdue';
    if (filter === 'Returned') return record.status === 'Returned';
    return true;
  });

  const getStatusBadge = (status: LoanRecord['status']) => {
    switch (status) {
      case 'Borrowing':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            <Clock size={12} /> Đang mượn
          </span>
        );
      case 'Overdue':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">
            <AlertCircle size={12} /> Quá hạn
          </span>
        );
      case 'Returned':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
            <CheckCircle size={12} /> Đã trả
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="text-brand-600" />
          Lịch sử mượn sách
        </h1>
        <p className="text-gray-500 mt-1">Theo dõi trạng thái và lịch sử mượn trả tài liệu của bạn.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl border border-gray-200 w-fit">
        {['All', 'Borrowing', 'Returned'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === tab
                ? 'bg-brand-50 text-brand-700 shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {tab === 'All' ? 'Tất cả' : tab === 'Borrowing' ? 'Đang mượn' : 'Đã trả'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((record) => (
            <div 
              key={record.id} 
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all flex gap-4 items-start"
            >
              <img 
                src={record.coverUrl} 
                alt={record.bookTitle} 
                className="w-16 h-24 object-cover rounded-lg shadow-sm border border-gray-100"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800 truncate pr-2">{record.bookTitle}</h3>
                    <p className="text-sm text-gray-500 mb-2">{record.author}</p>
                  </div>
                  {getStatusBadge(record.status)}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm mt-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={14} className="text-gray-400" />
                    <span>Ngày mượn: <span className="font-medium text-gray-900">{record.borrowDate}</span></span>
                  </div>
                  
                  {record.status === 'Returned' ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <CheckCircle size={14} className="text-green-500" />
                      <span>Đã trả ngày: <span className="font-medium text-gray-900">{record.returnDate}</span></span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={14} className={record.status === 'Overdue' ? 'text-red-500' : 'text-blue-500'} />
                      <span>Hạn trả: <span className={`font-medium ${record.status === 'Overdue' ? 'text-red-600' : 'text-gray-900'}`}>{record.dueDate}</span></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-gray-900 font-medium">Chưa có dữ liệu</h3>
            <p className="text-gray-500 text-sm">Bạn chưa có lịch sử mượn sách nào ở trạng thái này.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanHistory;