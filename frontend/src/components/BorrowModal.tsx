import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle, MapPin, AlignLeft } from 'lucide-react';
import { Book } from '../types';

interface BorrowModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onBorrowSuccess?: (bookTitle: string, date: string, time: string) => void;
}

const BorrowModal: React.FC<BorrowModalProps> = ({ book, isOpen, onClose, onBorrowSuccess }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen || !book) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setStep('success');
      // Trigger the chat message in the background
      if (onBorrowSuccess) {
        onBorrowSuccess(book.title, date, time);
      }
    }, 500);
  };

  const handleClose = () => {
    setStep('form');
    setDate('');
    setTime('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in transform transition-all border border-gray-100 dark:border-gray-700">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full text-gray-500 dark:text-gray-400 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {step === 'form' ? (
          <div className="flex flex-col h-full">
            {/* Header with Book Info */}
            <div className="bg-brand-50 dark:bg-brand-900/20 p-6 border-b border-brand-100 dark:border-brand-900">
              <h2 className="text-lg font-bold text-brand-800 dark:text-brand-300 mb-1">Đăng ký mượn sách</h2>
              <p className="text-sm text-brand-600 dark:text-brand-400">Vui lòng chọn lịch hẹn lấy sách</p>
              
              <div className="mt-4 flex gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl border border-brand-100 dark:border-gray-700 shadow-sm">
                <img 
                  src={book.coverUrl} 
                  alt={book.title} 
                  className="w-12 h-16 object-cover rounded-md shadow-sm"
                />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-1">{book.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{book.author}</p>
                  <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 rounded font-medium">
                    Có sẵn tại kho
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Ngày hẹn lấy</label>
                    <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="date" 
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-9 pr-2 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
                    />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Giờ hẹn</label>
                    <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="time" 
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        min="07:00"
                        max="21:00"
                        className="w-full pl-9 pr-2 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
                    />
                    </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Ghi chú (Tùy chọn)</label>
                <div className="relative">
                    <AlignLeft className="absolute left-3 top-3 text-gray-400" size={16} />
                    <textarea
                        rows={2}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ví dụ: Nhờ thủ thư bọc bìa giúp..."
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm resize-none"
                    />
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-800 flex gap-2 items-start">
                <MapPin size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  Địa điểm nhận sách: <span className="font-semibold">Quầy Dịch vụ - Tầng 1, Thư viện ĐH Duy Tân (03 Quang Trung)</span>.
                </p>
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-600 text-white font-bold uppercase tracking-wide py-3.5 rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all shadow-md hover:shadow-lg mt-2"
              >
                Xác nhận đăng ký
              </button>
            </form>
          </div>
        ) : (
          <div className="p-0 bg-gray-50 dark:bg-gray-900 h-full flex flex-col">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-b-3xl shadow-sm flex flex-col items-center justify-center pb-10 z-10">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4 animate-bounce shadow-sm">
                <CheckCircle size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Đăng ký thành công!</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center px-6">
                Vui lòng đến đúng giờ để nhận sách.
                </p>
            </div>
            
            <div className="px-6 -mt-4 relative z-0 flex-1 flex flex-col">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4 relative overflow-hidden ticket-tear">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 via-red-500 to-brand-600"></div>
                    
                    <div className="flex justify-between items-end border-b border-dashed border-gray-200 dark:border-gray-700 pb-4">
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">Mã phiếu mượn</p>
                            <p className="text-2xl font-mono font-bold text-gray-800 dark:text-gray-100 tracking-wider">LB-{Math.floor(Math.random() * 10000)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase font-bold">Trạng thái</p>
                            <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full border border-green-100 dark:border-green-800">Đã xác nhận</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Sách:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100 text-right w-2/3 truncate">{book.title}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Thời gian:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{time}, {date}</span>
                        </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Người mượn:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">Sinh viên DTU</span>
                        </div>
                        {note && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Ghi chú:</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100 text-right w-2/3 truncate italic">"{note}"</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-auto pb-6 pt-4">
                    <button 
                    onClick={handleClose}
                    className="w-full py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
                    >
                    Đóng phiếu
                    </button>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowModal;