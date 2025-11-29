import React, { useState } from 'react';
import { BookOpen, Users, AlertCircle, Plus, Trash2, Search, Edit, X, Download, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Book, UserRole, ViewState, LoanRecord } from '../types';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';

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
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

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

  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  
  // Multi-select state
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const overdueCount = loans ? loans.filter(l => l.status === 'Overdue').length : 0;

  // Single Delete Handlers
  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book);
  };

  const confirmDelete = async () => {
    if (bookToDelete) {
      if (onDeleteBook) {
        await onDeleteBook(bookToDelete.id);
      } else {
        setBooks(prev => prev.filter(b => b.id !== bookToDelete.id));
      }
      // Also remove from selection if present
      setSelectedBookIds(prev => prev.filter(id => id !== bookToDelete.id));
      setBookToDelete(null);
    }
  };

  // Bulk Delete Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
        const allFilteredIds = filteredBooks.map(b => b.id);
        setSelectedBookIds(allFilteredIds);
    } else {
        setSelectedBookIds([]);
    }
  };

  const handleSelectBook = (id: string) => {
    setSelectedBookIds(prev => 
        prev.includes(id) ? prev.filter(bookId => bookId !== id) : [...prev, id]
    );
  };

  const confirmBulkDelete = async () => {
    if (selectedBookIds.length === 0) return;

    if (onDeleteBook) {
        await Promise.all(selectedBookIds.map(id => onDeleteBook(id)));
    } else {
        setBooks(prev => prev.filter(b => !selectedBookIds.includes(b.id)));
    }
    setSelectedBookIds([]);
    setShowBulkDeleteModal(false);
  };

  // Export to CSV
  const exportToCSV = () => {
    const BOM = "\uFEFF"; 
    const headers = ["ID", "Tên sách", "Tác giả", "Danh mục", "Trạng thái", "Mô tả"];
    const rows = filteredBooks.map(book => [
      book.id,
      `"${book.title.replace(/"/g, '""')}"`,
      `"${book.author.replace(/"/g, '""')}"`,
      book.category,
      book.status === 'Available' ? 'Có sẵn' : book.status === 'Borrowed' ? 'Đang mượn' : 'Bảo trì',
      `"${book.description.replace(/"/g, '""')}"`
    ]);

    const csvContent = BOM + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `danh_sach_sach_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    // Use 'name' and 'value' for PieChart
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

  // Check if all filtered books are selected
  const isAllSelected = filteredBooks.length > 0 && filteredBooks.every(b => selectedBookIds.includes(b.id));

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
              {/* Book Categories Pie Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Phân bố sách theo danh mục</h3>
                  <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                              <Pie
                                  data={bookCategoryData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                              >
                                  {bookCategoryData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                              />
                              <Legend />
                          </PieChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              {/* Loan Status Donut Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Trạng thái mượn trả</h3>
                  <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                              <Pie
                                  data={loanStatusData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                              >
                                  {loanStatusData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                  ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                              />
                              <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                iconType="circle"
                              />
                          </PieChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>
        </>
      )}

      {/* Management Section */}
      {currentView === 'admin-books' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 whitespace-nowrap">
                  <BookOpen className="text-brand-600" size={20} />
                  Quản lý kho sách
              </h2>
              
              <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-3 items-center">
                  {/* Bulk Delete Button */}
                  {selectedBookIds.length > 0 && (userRole === 'admin' || userRole === 'librarian') && (
                      <button 
                          onClick={() => setShowBulkDeleteModal(true)}
                          className="w-full sm:w-auto px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors animate-fade-in"
                      >
                          <Trash2 size={18} />
                          Xóa {selectedBookIds.length} sách
                      </button>
                  )}

                  {/* Filter Dropdown */}
                  <div className="relative w-full sm:w-40">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Filter size={16} />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm appearance-none cursor-pointer"
                    >
                        <option value="All">Tất cả trạng thái</option>
                        <option value="Available">Có sẵn</option>
                        <option value="Borrowed">Đang mượn</option>
                        <option value="Maintenance">Bảo trì</option>
                    </select>
                  </div>

                  {/* Search */}
                  <div className="relative flex-1 w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                          type="text" 
                          placeholder="Tìm kiếm sách..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                      />
                  </div>

                  {/* Export Button */}
                  <button 
                      onClick={exportToCSV}
                      className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                      title="Xuất Excel/CSV"
                  >
                      <Download size={18} /> 
                      <span className="hidden sm:inline">Xuất</span>
                  </button>

                  {/* Add Button */}
                  <button 
                      onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                      <Plus size={18} /> 
                      <span className="hidden sm:inline">Thêm</span>
                  </button>
              </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                          {/* Checkbox Column */}
                          {(userRole === 'admin' || userRole === 'librarian') && (
                              <th className="px-6 py-4 w-10">
                                  <input 
                                      type="checkbox" 
                                      checked={isAllSelected}
                                      onChange={handleSelectAll}
                                      className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500 cursor-pointer"
                                  />
                              </th>
                          )}
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-20">Ảnh</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tên sách</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tác giả</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Danh mục</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {paginatedBooks.length > 0 ? (
                          paginatedBooks.map((book) => (
                              <tr key={book.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group ${selectedBookIds.includes(book.id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                                  {/* Checkbox Cell */}
                                  {(userRole === 'admin' || userRole === 'librarian') && (
                                      <td className="px-6 py-3">
                                          <input 
                                              type="checkbox" 
                                              checked={selectedBookIds.includes(book.id)}
                                              onChange={() => handleSelectBook(book.id)}
                                              className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500 cursor-pointer"
                                          />
                                      </td>
                                  )}
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
                                          
                                          {/* Admin and Librarian can delete */}
                                          {(userRole === 'admin' || userRole === 'librarian') && (
                                              <button 
                                                  onClick={() => handleDeleteClick(book)}
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
                              <td colSpan={userRole === 'admin' || userRole === 'librarian' ? 7 : 6} className="px-6 py-8 text-center text-gray-500">
                                  Không tìm thấy sách nào phù hợp.
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredBooks.length)}</span> trong số <span className="font-medium">{filteredBooks.length}</span> sách
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === page
                                    ? 'bg-brand-600 text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Book Modal */}
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

      {/* Single Delete Confirmation Modal */}
      {bookToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setBookToDelete(null)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 animate-fade-in">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        Xóa sách?
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                        Bạn có chắc chắn muốn xóa sách <span className="font-bold text-gray-800 dark:text-white">"{bookToDelete.title}"</span> không? Hành động này không thể hoàn tác.
                    </p>
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setBookToDelete(null)}
                            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                        >
                            Hủy
                        </button>
                        <button 
                            onClick={confirmDelete}
                            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-sm"
                        >
                            Xóa ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBulkDeleteModal(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 animate-fade-in">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        Xóa {selectedBookIds.length} sách?
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                        Bạn có chắc chắn muốn xóa <span className="font-bold text-gray-800 dark:text-white">{selectedBookIds.length}</span> sách đã chọn không? Hành động này không thể hoàn tác.
                    </p>
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setShowBulkDeleteModal(false)}
                            className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                        >
                            Hủy
                        </button>
                        <button 
                            onClick={confirmBulkDelete}
                            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-sm"
                        >
                            Xóa tất cả
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;