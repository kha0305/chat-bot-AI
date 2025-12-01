import React, { useState } from 'react';
import { User, Lock, ArrowRight, CheckCircle, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { UserRole } from '../types';
import { loginUser } from '../services/api';

interface LoginProps {
<<<<<<< HEAD
  onLogin: (role: UserRole, name: string, id: string) => void;
=======
  onLogin: (role: UserRole, name: string) => void;
  onBack?: () => void;
  onSwitchToRegister?: () => void;
>>>>>>> fb1c7d176fb29e659c8d81038222541234973446
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack, onSwitchToRegister }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Notification State
  const [notification, setNotification] = useState<{ type: 'error' | 'success', message: string } | null>(null);

  // Password Visibility State
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    setIsLoading(true);

    try {
<<<<<<< HEAD
        const user = await loginUser(username, password);
        onLogin(user.role, user.name, user.id);
=======
      const user = await loginUser(username, password);
      onLogin(user.role, user.name);
>>>>>>> fb1c7d176fb29e659c8d81038222541234973446
    } catch (error) {
      setNotification({ type: 'error', message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Duy_Tan_University_campus.jpg/1200px-Duy_Tan_University_campus.jpg")' }}>

      {/* Overlay */}
      <div className="absolute inset-0 bg-brand-900/80 backdrop-blur-sm"></div>

      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-50 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-all"
          title="Quay lại"
        >
          <ArrowLeft size={24} />
        </button>
      )}

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
            Đăng nhập hệ thống
          </h2>

          {notification && (
            <div className={`p-3 mb-4 text-sm rounded-lg text-center font-medium flex items-center justify-center gap-2 ${notification.type === 'error'
              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
              : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              }`}>
              {notification.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              {notification.message}
            </div>
          )}

          {/* Login Form */}
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

          <div className="mt-4 text-center space-y-2">
            {onSwitchToRegister && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chưa có tài khoản?{' '}
                <button
                  onClick={onSwitchToRegister}
                  className="text-brand-600 hover:text-brand-700 font-bold hover:underline"
                >
                  Đăng ký ngay
                </button>
              </p>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">
              Tài khoản demo: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">admin / 123admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;