import React from 'react';
import { X, Moon, Sun, Type, Monitor } from 'lucide-react';
import { AppSettings, Theme, FontSize } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  if (!isOpen) return null;

  const handleThemeChange = (theme: Theme) => {
    onUpdateSettings({ ...settings, theme });
  };

  const handleFontSizeChange = (fontSize: FontSize) => {
    onUpdateSettings({ ...settings, fontSize });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in transform transition-all border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
            <SettingsIcon size={20} className="text-brand-600 dark:text-brand-500" /> 
            Cài đặt
          </h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3 uppercase tracking-wider">Giao diện</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleThemeChange('light')}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  settings.theme === 'light' 
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-gray-700 dark:border-brand-400 dark:text-brand-400' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-brand-200 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Sun size={24} />
                <span className="text-sm font-medium">Sáng</span>
              </button>
              <button 
                onClick={() => handleThemeChange('dark')}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  settings.theme === 'dark' 
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-gray-700 dark:border-brand-400 dark:text-brand-400' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-brand-200 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Moon size={24} />
                <span className="text-sm font-medium">Tối</span>
              </button>
            </div>
          </div>

          {/* Font Size Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3 uppercase tracking-wider">Cỡ chữ Chat</label>
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              <button 
                onClick={() => handleFontSizeChange('small')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                  settings.fontSize === 'small' 
                    ? 'bg-white dark:bg-gray-600 text-brand-700 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <span className="text-xs">A</span> Nhỏ
              </button>
              <button 
                onClick={() => handleFontSizeChange('medium')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                  settings.fontSize === 'medium' 
                    ? 'bg-white dark:bg-gray-600 text-brand-700 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <span className="text-sm">A</span> Vừa
              </button>
              <button 
                onClick={() => handleFontSizeChange('large')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                  settings.fontSize === 'large' 
                    ? 'bg-white dark:bg-gray-600 text-brand-700 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <span className="text-lg">A</span> Lớn
              </button>
            </div>
          </div>

        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper icon for the header
const SettingsIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

export default SettingsModal;