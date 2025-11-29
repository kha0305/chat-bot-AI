import React, { useState } from 'react';
import { User, Lock, ArrowRight, UserPlus, Mail, CheckCircle, AlertCircle, CreditCard, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole, name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Notification State
  const [notification, setNotification] = useState<{type: 'error' | 'success', message: string} | null>(null);

  // Password Visibility State
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Check hardcoded admin account
      if (username === 'admin' && password === 'admin') {
        onLogin('admin', 'Quản Trị Viên');
      }
      // Check hardcoded librarian account
      else if (username === 'librarian' && password === 'librarian') {
        onLogin('librarian', 'Nhân viên Thư viện');
      } 
      // Check hardcoded student account
      else if (username === 'student' && password === 'student') {
        onLogin('student', 'Nguyễn Văn A');
      } 
      // Check for the newly registered account (Mock logic for demo)
      else if (regUsername && username === regUsername && password === regPassword) {
        onLogin('student', regName || 'Sinh viên mới');
      }
      else {
        setNotification({ type: 'error', message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        setIsLoading(false);
      }
    }, 800);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    // Validation for Student ID (11 digits)
    if (regStudentId.length !== 11) {
      setNotification({ type: 'error', message: 'Mã số sinh viên phải gồm đúng 11 số!' });
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setNotification({ type: 'error', message: 'Mật khẩu xác nhận không khớp!' });
      return;
    }

    setIsLoading(true);

    // Simulate Registration API
    setTimeout(() => {
      setIsLoading(false);
      setNotification({ type: 'success', message: 'Đăng ký thành công! Vui lòng đăng nhập.' });
      setIsRegistering(false);
      // Pre-fill login with new username
      setUsername(regUsername);
      setPassword('');
      // Note: We deliberately do NOT clear regUsername/regPassword here 
      // so we can use them to validate the mock login in handleLoginSubmit
    }, 1000);
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setNotification(null);
    // Reset forms
    if (!isRegistering) {
      setRegName('');
      setRegStudentId('');
      setRegUsername('');
      setRegPassword('');
      setRegConfirmPassword('');
    } else {
      setUsername('');
      setPassword('');
    }
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and max 11 chars
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 11) {
      setRegStudentId(val);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden"
         style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Duy_Tan_University_campus.jpg/1200px-Duy_Tan_University_campus.jpg")' }}>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-brand-900/80 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in m-4 flex flex-col max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-brand-700 p-6 text-center shrink-0">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <img 
                    src="/dtu-logo.jpg" 
                    alt="DTU Logo" 
                    className="w-12 h-auto object-contain"
                />
            </div>
            <h1 className="text-xl font-bold text-white">DTU Library</h1>
            <p className="text-brand-100 text-xs mt-1">Cổng thông tin thư viện số</p>
        </div>

        {/* Form Container */}
        <div className="p-8 pt-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            {isRegistering ? 'Đăng ký tài khoản' : 'Đăng nhập'}
          </h2>
          
          {notification && (
            <div className={`p-3 mb-4 text-sm rounded-lg text-center font-medium flex items-center justify-center gap-2 ${
              notification.type === 'error' 
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
            }`}>
              {notification.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              {notification.message}
            </div>
          )}

          {isRegistering ? (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                    placeholder="Nhập họ tên sinh viên"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Mã số sinh viên (11 số)</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={regStudentId}
                    onChange={handleStudentIdChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                    placeholder="Ví dụ: 28211203456"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Tên đăng nhập</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                    placeholder="Chọn tên đăng nhập"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showRegPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                    placeholder="Tạo mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Xác nhận mật khẩu</label>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showRegConfirmPassword ? "text" : "password"}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showRegConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng ký ngay'}
                {!isLoading && <UserPlus size={18} />}
              </button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tên đăng nhập</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="Nhập tên đăng nhập"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          )}

          <div className="mt-6 text-center pt-4 border-t border-gray-100 dark:border-gray-700">
             <p className="text-sm text-gray-600 dark:text-gray-400">
                {isRegistering ? 'Đã có tài khoản?' : 'Bạn là sinh viên mới?'}
                <button 
                  onClick={toggleMode}
                  className="ml-2 font-bold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
                >
                  {isRegistering ? 'Đăng nhập ngay' : 'Đăng ký tài khoản'}
                </button>
             </p>
          </div>
          
          {!isRegistering && (
             <div className="mt-4 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                   Tài khoản demo: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">admin / admin</span> hoặc <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">librarian / librarian</span>
                </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;