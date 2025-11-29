import React, { useState } from 'react';
import { X, BookOpen, MessageSquare, Clock, Shield, Phone } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'policy' | 'contact'>('guide');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] animate-fade-in overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Trợ giúp & Hướng dẫn</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Trung tâm hỗ trợ thư viện Đại học Duy Tân</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'guide' 
                ? 'border-brand-600 text-brand-600 dark:text-brand-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <BookOpen size={18} />
            Hướng dẫn sử dụng
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'policy' 
                ? 'border-brand-600 text-brand-600 dark:text-brand-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Shield size={18} />
            Nội quy & Chính sách
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'contact' 
                ? 'border-brand-600 text-brand-600 dark:text-brand-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Phone size={18} />
            Liên hệ
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <MessageSquare size={20} />
                  Chat với LibBot
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                  LibBot là trợ lý ảo thông minh giúp bạn tra cứu sách nhanh chóng. Chỉ cần nhập tên sách, tác giả hoặc chủ đề bạn quan tâm, LibBot sẽ gợi ý những cuốn sách phù hợp nhất.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 dark:text-white text-lg">Quy trình mượn sách</h3>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Tìm kiếm sách</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sử dụng thanh tìm kiếm hoặc chat với LibBot để tìm cuốn sách bạn cần.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Đăng ký mượn</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Nhấn nút "Mượn sách", chọn ngày và giờ hẹn lấy sách tại thư viện.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Nhận sách</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Đến quầy thủ thư đúng giờ hẹn, xuất trình thẻ sinh viên để nhận sách.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'policy' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                    <Clock size={18} className="text-brand-600" />
                    Thời gian mượn
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-1">
                    <li>Giáo trình: Tối đa <strong>14 ngày</strong></li>
                    <li>Sách tham khảo: Tối đa <strong>7 ngày</strong></li>
                    <li>Tạp chí: Đọc tại chỗ</li>
                  </ul>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                    <BookOpen size={18} className="text-brand-600" />
                    Số lượng mượn
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-1">
                    <li>Sinh viên đại học: Tối đa <strong>5 cuốn</strong></li>
                    <li>Học viên cao học: Tối đa <strong>7 cuốn</strong></li>
                    <li>Giảng viên: Tối đa <strong>10 cuốn</strong></li>
                  </ul>
                </div>

                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                  <h4 className="font-bold text-red-700 dark:text-red-400 mb-2">Lưu ý quan trọng</h4>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    Bạn cần trả sách đúng hạn để tránh bị phạt. Mức phạt quá hạn là <strong>5.000đ/ngày/cuốn</strong>. Nếu làm mất sách, bạn phải đền bù gấp 3 lần giá trị cuốn sách.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl text-center">
                  <div className="w-12 h-12 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Phone size={24} className="text-brand-600 dark:text-brand-400" />
                  </div>
                  <h4 className="font-bold text-gray-800 dark:text-white">Hotline</h4>
                  <p className="text-brand-600 dark:text-brand-400 font-bold mt-1">0236.3650403</p>
                  <p className="text-xs text-gray-500 mt-1">Nhánh 102 (Thư viện)</p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl text-center">
                  <div className="w-12 h-12 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <MessageSquare size={24} className="text-brand-600 dark:text-brand-400" />
                  </div>
                  <h4 className="font-bold text-gray-800 dark:text-white">Email</h4>
                  <p className="text-brand-600 dark:text-brand-400 font-bold mt-1">thuvien@duytan.edu.vn</p>
                  <p className="text-xs text-gray-500 mt-1">Hỗ trợ 24/7</p>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                <h4 className="font-bold text-gray-800 dark:text-white mb-3">Địa chỉ thư viện</h4>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex gap-3">
                    <span className="font-bold min-w-[80px]">Cơ sở 1:</span>
                    <span>03 Quang Trung, Hải Châu, Đà Nẵng (Tầng 4)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold min-w-[80px]">Cơ sở 2:</span>
                    <span>K7/25 Quang Trung, Hải Châu, Đà Nẵng (Khu C)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold min-w-[80px]">Cơ sở 3:</span>
                    <span>120 Hoàng Minh Thảo, Liên Chiểu, Đà Nẵng (Tòa nhà Thư viện)</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
