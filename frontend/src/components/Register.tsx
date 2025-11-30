import React, { useState } from 'react';
import { User, Lock, ArrowRight, CheckCircle, AlertCircle, Eye, EyeOff, ArrowLeft, Mail, CreditCard } from 'lucide-react';
import { registerUser } from '../services/api';

interface RegisterProps {
    onRegisterSuccess: (username: string) => void;
    onBack: () => void;
    onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onBack, onSwitchToLogin }) => {
    const [isLoading, setIsLoading] = useState(false);

    // Register State
    const [formData, setFormData] = useState({
        fullName: '',
        studentId: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    // Notification State
    const [notification, setNotification] = useState<{ type: 'error' | 'success', message: string } | null>(null);

    // Password Visibility State
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNotification(null);

        if (formData.password !== formData.confirmPassword) {
            setNotification({ type: 'error', message: 'Mật khẩu xác nhận không khớp' });
            return;
        }

        setIsLoading(true);

        try {
            await registerUser({
                fullName: formData.fullName,
                studentId: formData.studentId,
                email: formData.email,
                username: formData.username,
                password: formData.password
            });

            setNotification({ type: 'success', message: 'Đăng ký thành công! Đang chuyển hướng...' });

            // Delay to show success message
            setTimeout(() => {
                onRegisterSuccess(formData.username);
            }, 1500);

        } catch (error: any) {
            setNotification({ type: 'error', message: error.message || 'Đăng ký thất bại. Vui lòng thử lại.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden"
            style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Duy_Tan_University_campus.jpg/1200px-Duy_Tan_University_campus.jpg")' }}>

            {/* Overlay */}
            <div className="absolute inset-0 bg-brand-900/80 backdrop-blur-sm"></div>

            <button
                onClick={onBack}
                className="absolute top-4 left-4 z-50 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-all"
                title="Quay lại"
            >
                <ArrowLeft size={24} />
            </button>

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
                    <p className="text-brand-100 text-xs mt-1">Đăng ký tài khoản sinh viên</p>
                </div>

                {/* Form Container */}
                <div className="p-8 pt-6">
                    {notification && (
                        <div className={`p-3 mb-4 text-sm rounded-lg text-center font-medium flex items-center justify-center gap-2 ${notification.type === 'error'
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                            : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            }`}>
                            {notification.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                            {notification.message}
                        </div>
                    )}

                    {/* Register Form */}
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Họ và tên</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                                    placeholder="Nguyễn Văn A"
                                    required
                                />
                            </div>
                        </div>

                        {/* Student ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mã sinh viên</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                                    placeholder="28211..."
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                                    placeholder="email@dtu.edu.vn"
                                    required
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên đăng nhập</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                                    placeholder="username"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                                    placeholder="******"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Xác nhận mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                                    placeholder="******"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70 mt-2"
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                            {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Đã có tài khoản?{' '}
                            <button
                                onClick={onSwitchToLogin}
                                className="text-brand-600 hover:text-brand-700 font-bold hover:underline"
                            >
                                Đăng nhập ngay
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
