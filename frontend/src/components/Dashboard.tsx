import React, { useRef, useState } from 'react';
import { BookOpen, Users, Activity, ArrowRight, Book as BookIcon, Clock, Search, RotateCcw, FileQuestion, BookPlus, CalendarCheck, Info, Star, CheckCircle, AlertTriangle, Camera } from 'lucide-react';
import { Book, ViewState } from '../types';

interface DashboardProps {
  onNavigateToChat: (message?: string) => void;
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  onOpenBorrow: (book: Book) => void;
  onUpdateBook?: (id: string, book: Partial<Book>) => Promise<Book>;
  onViewChange: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToChat, books, setBooks, onOpenBorrow, onUpdateBook, onViewChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentBookId, setCurrentBookId] = useState<string | null>(null);

  // Calculate stats
  const totalBooks = books.length;
  const availableBooks = books.filter(b => b.status === 'Available').length;
  const borrowedBooks = books.filter(b => b.status === 'Borrowed').length;
  const maintenanceBooks = books.filter(b => b.status === 'Maintenance').length;

  // Get categories
  const categories = Array.from(new Set(books.map(b => b.category)));

  const quickMenu = [
    {
      icon: <Search size={24} />,
      label: "Tra cứu nhanh",
      desc: "Tìm sách, tài liệu",
      action: "Tôi muốn tìm sách",
      color: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900 hover:border-blue-300 dark:hover:border-blue-700"
    },
    {
      icon: <RotateCcw size={24} />,
      label: "Gia hạn sách",
      desc: "Thủ tục & Hướng dẫn",
      action: "Hướng dẫn gia hạn sách online",
      color: "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900 hover:border-green-300 dark:hover:border-green-700"
    },
    {
      icon: <BookPlus size={24} />,
      label: "Đề xuất mua",
      desc: "Yêu cầu sách mới",
      action: "Tôi muốn đề xuất thư viện mua thêm sách",
      color: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700"
    },
    {
      icon: <FileQuestion size={24} />,
      label: "Hỏi đáp & Nội quy",
      desc: "Quy định thư viện",
      action: "Nội quy thư viện là gì?",
      color: "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900 hover:border-orange-300 dark:hover:border-orange-700"
    },
  ];

  const statusCards = [
    {
      label: "Sách có sẵn",
      count: availableBooks,
      total: totalBooks,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      barColor: "bg-emerald-500",
      icon: <CheckCircle size={20} />,
      query: "Liệt kê các sách đang có sẵn"
    },
    {
      label: "Đang được mượn",
      count: borrowedBooks,
      total: totalBooks,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      barColor: "bg-blue-500",
      icon: <Clock size={20} />,
      query: "Liệt kê các sách đang được mượn"
    },
    {
      label: "Đang bảo trì",
      count: maintenanceBooks,
      total: totalBooks,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      barColor: "bg-amber-500",
      icon: <AlertTriangle size={20} />,
      query: "Liệt kê các sách đang bảo trì"
    }
  ];

  const handleBorrowClick = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation(); // Prevent navigating to chat details
    onOpenBorrow(book);
  };

  const handleUploadClick = (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    setCurrentBookId(bookId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentBookId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newUrl = reader.result as string;

        if (onUpdateBook) {
          onUpdateBook(currentBookId, { coverUrl: newUrl });
        } else {
          // Update state passed from parent
          setBooks(prev => prev.map(b =>
            b.id === currentBookId
              ? { ...b, coverUrl: newUrl }
              : b
          ));
        }

        setCurrentBookId(null);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #94a3b8; /* Slate-400 for better visibility */
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #64748b; /* Slate-500 */
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #475569; /* Slate-600 for dark mode */
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #64748b;
        }
      `}</style>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-brand-700 to-brand-600 dark:from-brand-900 dark:to-brand-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Xin chào, Sinh viên DTU! 👋</h1>
          <p className="text-brand-100 max-w-2xl text-lg mb-6">
            Chào mừng bạn đến với Thư viện số Đại học Duy Tân. Tra cứu tài liệu, kiểm tra trạng thái sách và hỏi đáp với AI LibBot ngay hôm nay.
          </p>
          <button
            onClick={() => onNavigateToChat()}
            className="bg-white dark:bg-gray-800 text-brand-700 dark:text-brand-400 px-6 py-3 rounded-xl font-semibold hover:bg-brand-50 dark:hover:bg-gray-700 transition-colors shadow-md flex items-center gap-2"
          >
            <BookIcon size={20} />
            Bắt đầu tra cứu ngay
          </button>
        </div>
      </div>

      {/* Quick Menu Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Tiện ích nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickMenu.map((item, index) => (
            <button
              key={index}
              onClick={() => onNavigateToChat(item.action)}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col items-start gap-3 hover:shadow-md text-left ${item.color} bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700`}
            >
              <div className={`p-3 rounded-xl ${item.color.split(' ')[0]} ${item.color.split(' ')[1]}`}>
                {item.icon}
              </div>
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-100">{item.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Book Status Summary */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Tình trạng tài liệu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statusCards.map((stat, index) => (
            <button
              key={index}
              onClick={() => onNavigateToChat(stat.query)}
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800 transition-all text-left group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-600">
                  {Math.round((stat.count / stat.total) * 100)}%
                </span>
              </div>

              <div className="mb-3">
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-0.5">{stat.label}</h3>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.count}</p>
                  <span className="text-xs text-gray-400 font-medium">/ {stat.total} cuốn</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${stat.barColor} transition-all duration-700 ease-out group-hover:opacity-80`}
                  style={{ width: `${(stat.count / stat.total) * 100}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* General Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Tổng số đầu sách</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{totalBooks * 150}+</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Thành viên hoạt động</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">3,842</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Lượt truy cập tuần</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">1,240</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Books - Horizontal Carousel */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <BookIcon size={24} className="text-brand-600 dark:text-brand-500" />
              Sách Nổi Bật
            </h2>
            <button
              onClick={() => onViewChange('introduction')}
              className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
            >
              Xem tất cả <ArrowRight size={16} />
            </button>
          </div>

          {/* Scroll Container */}
          <div className="flex overflow-x-auto gap-6 pb-4 pt-2 snap-x snap-mandatory custom-scrollbar -mx-2 px-2">
            {books.map((book: Book) => (
              <div
                key={book.id}
                className="min-w-[260px] w-[260px] flex-none snap-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Large Cover Image */}
                <div
                  className="relative h-[360px] overflow-hidden cursor-pointer group/image"
                  onClick={() => onNavigateToChat(`Thông tin về sách "${book.title}"`)}
                >
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-40 transition-opacity" />

                  {/* Upload Button */}
                  <button
                    onClick={(e) => handleUploadClick(e, book.id)}
                    className="absolute top-3 left-3 p-2.5 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-md z-30 hover:scale-110"
                    title="Cập nhật ảnh bìa"
                  >
                    <Camera size={16} />
                  </button>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md ${book.status === 'Available'
                      ? 'bg-white/90 text-green-700 border border-green-200'
                      : 'bg-white/90 text-red-700 border border-red-200'
                      }`}>
                      {book.status === 'Available' ? 'Có sẵn' : 'Đã mượn'}
                    </span>
                  </div>

                  {/* Hover Overlay with Info Icon */}
                  <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover/image:opacity-100 pointer-events-none">
                    <div className="bg-white/90 p-3 rounded-full shadow-lg transform scale-90 group-hover/image:scale-100 transition-transform">
                      <Info size={24} className="text-brand-600" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 relative">
                  <div
                    className="cursor-pointer mb-4"
                    onClick={() => onNavigateToChat(`Thông tin về sách "${book.title}"`)}
                  >
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-1 mb-1" title={book.title}>{book.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{book.author}</p>

                    <div className="flex items-center gap-2">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded border border-brand-100 dark:border-brand-800">
                        {book.category}
                      </span>
                      <div className="flex text-yellow-400 gap-0.5">
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                        <Star size={12} fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  {/* Prominent Action Button */}
                  <div className="mt-auto pt-2">
                    {book.status === 'Available' ? (
                      <button
                        onClick={(e) => handleBorrowClick(e, book)}
                        className="w-full flex items-center justify-center gap-2 bg-brand-700 text-white text-sm font-bold uppercase tracking-wide py-3.5 rounded-xl hover:bg-brand-800 active:scale-[0.98] shadow-md hover:shadow-brand-500/30 transition-all"
                      >
                        <CalendarCheck size={18} strokeWidth={2} />
                        MƯỢN SÁCH NGAY
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-sm font-bold uppercase tracking-wide py-3.5 rounded-xl cursor-not-allowed border border-gray-200 dark:border-gray-600"
                      >
                        <Clock size={18} />
                        TẠM HẾT SÁCH
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* "See More" Card */}
            <div className="min-w-[100px] flex items-center justify-center snap-center">
              <button
                onClick={() => onViewChange('introduction')}
                className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-200 flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:scale-110"
              >
                <ArrowRight size={28} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Info & Categories (Right Column) */}
        <div className="space-y-6 lg:mt-12">

          {/* Library Hours */}
          <div className="bg-brand-50 dark:bg-brand-900/20 rounded-2xl p-6 border border-brand-100 dark:border-brand-900">
            <h3 className="font-bold text-brand-800 dark:text-brand-300 mb-4 flex items-center gap-2">
              <Clock size={18} /> Giờ mở cửa
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-start pb-2 border-b border-brand-200/50 dark:border-brand-800/50">
                <span className="text-brand-700 dark:text-brand-400 font-medium">Thứ 2 - Thứ 6</span>
                <span className="text-brand-900 dark:text-brand-200">7:00 - 21:00</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-brand-700 dark:text-brand-400 font-medium">Thứ 7 - CN</span>
                <span className="text-brand-900 dark:text-brand-200">8:00 - 17:00</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">Danh mục phổ biến</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigateToChat(`Tìm sách thuộc thể loại ${cat}`)}
                  className="text-xs px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-gray-600 hover:border-brand-200 hover:text-brand-700 dark:hover:text-white transition-all"
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={() => onNavigateToChat("Danh sách các thể loại sách")}
                className="text-xs px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                + Xem thêm
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;