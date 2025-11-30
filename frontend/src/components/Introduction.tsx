import React, { useState } from 'react';
import { Book, User } from '../types';
import { Search, Book as BookIcon, CalendarCheck, Clock, ArrowRight, BookOpen, Library } from 'lucide-react';

interface IntroductionProps {
    books?: Book[];
    onRequireLogin?: () => void;
    user?: User | null;
    onOpenBorrow?: (book: Book) => void;
}

const Introduction: React.FC<IntroductionProps> = ({ books = [], onRequireLogin, user, onOpenBorrow }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(12);

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 12);
    };

    const handleAction = (book: Book) => {
        if (user && user.role === 'student') {
            if (book.status === 'Available' && onOpenBorrow) {
                onOpenBorrow(book);
            } else {
                // View details logic could go here, for now just alert or no-op
                alert(`Thông tin sách: ${book.title}\nTác giả: ${book.author}\nTrạng thái: ${book.status === 'Available' ? 'Có sẵn' : 'Đã mượn'}`);
            }
        } else {
            if (onRequireLogin) onRequireLogin();
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in pb-20">
            {/* Hero Section with Better Image */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-12 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10" />
                <div className="h-[400px] relative">
                    <img
                        src="https://images.unsplash.com/photo-1507842217121-9e962835d75d?q=80&w=2070&auto=format&fit=crop"
                        alt="Library Interior"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                        <span className="text-brand-400 font-bold tracking-widest uppercase text-sm mb-4 animate-slide-down">Chào mừng đến với</span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl animate-scale-in">
                            Thư viện Đại học Duy Tân
                        </h1>
                        <p className="text-gray-200 text-lg md:text-xl max-w-2xl leading-relaxed animate-slide-up">
                            Khám phá kho tàng tri thức vô tận với hàng ngàn đầu sách, tài liệu nghiên cứu và không gian học tập hiện đại bậc nhất.
                        </p>

                        {!user && (
                            <button
                                onClick={onRequireLogin}
                                className="mt-8 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-bold shadow-lg hover:shadow-brand-500/50 transition-all flex items-center gap-3 animate-bounce-subtle"
                            >
                                <Library size={20} />
                                Đăng nhập để trải nghiệm ngay
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Section with Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="relative h-48 rounded-2xl overflow-hidden group shadow-lg">
                    <div className="absolute inset-0 bg-brand-900/80 z-10 group-hover:bg-brand-900/70 transition-colors" />
                    <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1000" alt="Books" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="relative z-20 h-full flex flex-col items-center justify-center text-white p-6 text-center">
                        <BookOpen size={40} className="mb-3 text-brand-300" />
                        <h3 className="text-4xl font-bold mb-1">{books.length > 0 ? books.length : '50.000+'}</h3>
                        <p className="text-brand-100 font-medium">Đầu sách đa dạng</p>
                    </div>
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden group shadow-lg">
                    <div className="absolute inset-0 bg-blue-900/80 z-10 group-hover:bg-blue-900/70 transition-colors" />
                    <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1000" alt="Digital" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="relative z-20 h-full flex flex-col items-center justify-center text-white p-6 text-center">
                        <Clock size={40} className="mb-3 text-blue-300" />
                        <h3 className="text-4xl font-bold mb-1">24/7</h3>
                        <p className="text-blue-100 font-medium">Truy cập mọi lúc</p>
                    </div>
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden group shadow-lg">
                    <div className="absolute inset-0 bg-purple-900/80 z-10 group-hover:bg-purple-900/70 transition-colors" />
                    <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000" alt="Space" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="relative z-20 h-full flex flex-col items-center justify-center text-white p-6 text-center">
                        <Library size={40} className="mb-3 text-purple-300" />
                        <h3 className="text-4xl font-bold mb-1">Modern</h3>
                        <p className="text-purple-100 font-medium">Không gian hiện đại</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3 mb-2">
                            <BookIcon className="text-brand-600" size={32} />
                            Kho Tài Liệu
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">Tra cứu và mượn sách trực tuyến nhanh chóng</p>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sách, tác giả..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all shadow-sm group-hover:shadow-md"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-brand-500 transition-colors" size={20} />
                    </div>
                </div>

                {/* Book Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredBooks.slice(0, visibleCount).map((book) => (
                        <div
                            key={book.id}
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden group h-full"
                        >
                            <div className="relative h-80 overflow-hidden bg-gray-100 dark:bg-gray-900">
                                <img
                                    src={book.coverUrl}
                                    alt={book.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=1000";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="absolute top-3 right-3 z-10">
                                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md ${book.status === 'Available'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-500 text-white'
                                        }`}>
                                        {book.status === 'Available' ? 'Có sẵn' : 'Đã mượn'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <div className="mb-4">
                                    <h3 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-2 mb-1 leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" title={book.title}>{book.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{book.author}</p>
                                </div>

                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2.5 py-1 rounded-md border border-brand-100 dark:border-brand-800">
                                        {book.category}
                                    </span>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        onClick={() => handleAction(book)}
                                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md ${book.status === 'Available'
                                            ? 'bg-brand-600 hover:bg-brand-700 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {book.status === 'Available' ? (
                                            <>
                                                <CalendarCheck size={18} />
                                                {user && user.role === 'student' ? 'Mượn sách ngay' : 'Đăng nhập để mượn'}
                                            </>
                                        ) : (
                                            <>
                                                <Clock size={18} />
                                                {user && user.role === 'student' ? 'Xem chi tiết' : 'Đăng nhập để xem'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredBooks.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                        <BookIcon size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Không tìm thấy sách nào phù hợp.</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-4 text-brand-600 hover:underline"
                        >
                            Xóa bộ lọc tìm kiếm
                        </button>
                    </div>
                )}

                {filteredBooks.length > visibleCount && (
                    <div className="flex justify-center pt-8 pb-12">
                        <button
                            onClick={handleLoadMore}
                            className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-full font-bold shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all flex items-center gap-3 group"
                        >
                            Xem thêm {filteredBooks.length - visibleCount} sách khác
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Introduction;
