import React, { useState } from 'react';
import { BookOpen, Users, AlertCircle, Plus, Trash2, Search, Edit, MoreVertical, CheckCircle } from 'lucide-react';
import { Book, UserRole, ViewState, LoanRecord } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface AdminDashboardProps {
  books: Book[];
  loans?: LoanRecord[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  userRole: UserRole;
  currentView: ViewState;
  onAddBook?: (book: Omit<Book, 'id'>) => Promise<Book>;
  onUpdateBook?: (id: string, book: Partial<Book>) => Promise<Book>;
  onDeleteBook?: (id: string) => Promise<void>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  books, 
  loans,
  setBooks, 
  userRole, 
  currentView,
  onAddBook,
  onUpdateBook,
  onDeleteBook
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<string | null>(null);
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: '',
    author: '',
    category: 'Giáo trình',
    status: 'Available',
    description: ''
  });

  // Filter books
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const overdueCount = loans ? loans.filter(l => l.status === 'Overdue').length : 0;

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sách này không?')) {
      if (onDeleteBook) {
        await onDeleteBook(id);
      } else {
        setBooks(prev => prev.filter(b => b.id !== id));
      }
    }
  };

  const resetForm = () => {
    setNewBook({ title: '', author: '', category: 'Giáo trình', status: 'Available', description: '' });
    setIsEditing(false);
    setCurrentBookId(null);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author) return;

    if (isEditing && currentBookId) {
      if (onUpdateBook) {
        onUpdateBook(currentBookId, newBook);
      } else {
        setBooks(prev => prev.map(book => 
          book.id === currentBookId 
            ? { ...book, ...newBook } as Book 
            : book
        ));
      }
    } else {
      if (onAddBook) {
        onAddBook({
            title: newBook.title!,
            author: newBook.author!,
            category: newBook.category || 'Giáo trình',
            status: newBook.status as any,
            description: newBook.description || 'Chưa có mô tả',
            coverUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/300`
        });
      } else {
        const bookToAdd: Book = {
            id: Date.now().toString(),
            title: newBook.title!,
            author: newBook.author!,
            category: newBook.category || 'Giáo trình',
            status: newBook.status as any,
            description: newBook.description || 'Chưa có mô tả',
            coverUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/300`
        };
        setBooks(prev => [bookToAdd, ...prev]);
      }
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleEditClick = (book: Book) => {
    setNewBook({
      title: book.title,
      author: book.author,
      category: book.category,
      status: book.status,
      description: book.description
    });
    setCurrentBookId(book.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // Prepare Chart Data
  const bookCategoryData = React.useMemo(() => {
    const categories: Record<string, number> = {};
    books.forEach(book => {
      categories[book.category] = (categories[book.category] || 0) + 1;
    });
    return Object.keys(categories).map(key => ({ name: key, value: categories[key] }));
  }, [books]);

  const loanStatusData = React.useMemo(() => {
    if (!loans) return [];
    const statuses: Record<string, number> = {};
    loans.forEach(loan => {
      const statusLabel = loan.status === 'Borrowing' ? 'Đang mượn' 
                        : loan.status === 'Returned' ? 'Đã trả' 
                        : loan.status === 'Overdue' ? 'Quá hạn' 
                        : 'Đã đặt';
      statuses[statusLabel] = (statuses[statusLabel] || 0) + 1;
    });
    return Object.keys(statuses).map(key => ({ name: key, value: statuses[key] }));
  }, [loans]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Stats Row */}
      {currentView === 'admin-dashboard' && (
        <>
          <div className={`grid grid-cols-1 ${userRole === 'admin' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Tổng số sách</p>
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{books.length}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                        <BookOpen size={24} />
                    </div>
                </div>
            </div>
            
            {/* Only Admin sees User Stats */}
            {userRole === 'admin' && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Thành viên</p>
                          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">3,842</h3>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl">
                          <Users size={24} />
                      </div>
                  </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Đang quá hạn</p>
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{overdueCount}</h3>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl">
                        <AlertCircle size={24} />
                    </div>
                </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Book Categories Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Phân bố sách theo danh mục</h3>
                  <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                              <Pie
                                  data={bookCategoryData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                  {bookCategoryData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                          </PieChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              {/* Loan Status Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Trạng thái mượn trả</h3>
                  <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                              data={loanStatusData}
                              layout="vertical"
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis dataKey="name" type="category" width={100} />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="value" name="Số lượng" fill="#82ca9d" />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>
        </>
      )}

      {/* Management Section */}
      {currentView === 'admin-books' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <BookOpen className="text-brand-600" size={20} />
                  Quản lý kho sách
              </h2>
              <div className="flex w-full sm:w-auto gap-3">
                  <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                          type="text" 
                          placeholder="Tìm kiếm sách..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                      />
                  </div>
                  <button 
                      onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                      }}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                      <Plus size={18} /> Thêm sách
                  </button>
              </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-20">Ảnh</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tên sách</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tác giả</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Danh mục</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredBooks.length > 0 ? (
                          filteredBooks.map((book) => (
                              <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                  <td className="px-6 py-3">
                                      <img src={book.coverUrl} alt="" className="w-10 h-14 object-cover rounded shadow-sm border border-gray-200 dark:border-gray-600" />
                                  </td>
                                  <td className="px-6 py-3">
                                      <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">{book.title}</p>
                                  </td>
                                  <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400">{book.author}</td>
                                  <td className="px-6 py-3">
                                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                          {book.category}
                                      </span>
                                  </td>
                                  <td className="px-6 py-3">
                                      <span className={`px-2 py-1 text-xs font-bold rounded-full border ${
                                          book.status === 'Available' 
                                              ? 'bg-green-50 text-green-700 border-green-200' 
                                              : book.status === 'Borrowed'
                                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                                              : 'bg-amber-50 text-amber-700 border-amber-200'
                                      }`}>
                                          {book.status === 'Available' ? 'Có sẵn' : book.status === 'Borrowed' ? 'Đang mượn' : 'Bảo trì'}
                                      </span>
                                  </td>
                                  <td className="px-6 py-3 text-right">
                                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button 
                                              onClick={() => handleEditClick(book)}
                                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                          >
                                              <Edit size={16} />
                                          </button>
                                          
                                          {/* Only Admin can delete */}
                                          {userRole === 'admin' && (
                                              <button 
                                                  onClick={() => handleDelete(book.id)}
                                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                              >
                                                  <Trash2 size={16} />
                                              </button>
                                          )}
                                      </div>
                                  </td>
                              </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                  Không tìm thấy sách nào phù hợp.
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 animate-fade-in">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  {isEditing ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
                </h3>
                <form onSubmit={handleSaveBook} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên sách</label>
                        <input 
                            type="text" 
                            required
                            value={newBook.title}
                            onChange={e => setNewBook({...newBook, title: e.target.value})}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none dark:bg-gray-700 dark:border-gray-600" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tác giả</label>
                        <input 
                            type="text" 
                            required
                            value={newBook.author}
                            onChange={e => setNewBook({...newBook, author: e.target.value})}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none dark:bg-gray-700 dark:border-gray-600" 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Danh mục</label>
                            <select 
                                value={newBook.category}
                                onChange={e => setNewBook({...newBook, category: e.target.value})}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none dark:bg-gray-700 dark:border-gray-600"
                            >
                                <option>Giáo trình</option>
                                <option>Văn học</option>
                                <option>Self-help</option>
                                <option>Khoa học</option>
                                <option>Công nghệ</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trạng thái</label>
                            <select 
                                value={newBook.status}
                                onChange={e => setNewBook({...newBook, status: e.target.value as any})}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none dark:bg-gray-700 dark:border-gray-600"
                            >
                                <option value="Available">Có sẵn</option>
                                <option value="Borrowed">Đang mượn</option>
                                <option value="Maintenance">Bảo trì</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold"
                        >
                            {isEditing ? 'Cập nhật' : 'Lưu sách'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;