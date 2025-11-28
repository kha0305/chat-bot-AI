import React from 'react';
import { LayoutDashboard, MessageSquare, BookMarked, HelpCircle, LogOut, Settings, BookOpen, Users } from 'lucide-react';
import { ViewState, UserRole } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  onOpenSettings?: () => void;
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentView, onViewChange, onOpenSettings, userRole, userName, onLogout }) => {
  
  const handleNavigation = (view: ViewState) => {
    onViewChange(view);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const getMainMenuItems = () => {
    if (userRole === 'admin' || userRole === 'librarian') {
      return [
        { id: 'admin-dashboard' as ViewState, label: userRole === 'admin' ? 'Tổng quan Admin' : 'Tổng quan Thư viện', icon: LayoutDashboard },
        { id: 'admin-books' as ViewState, label: 'Quản lý sách', icon: BookOpen },
      ];
    }
    return [
      { id: 'dashboard' as ViewState, label: 'Tổng quan (Dashboard)', icon: LayoutDashboard },
      { id: 'chat' as ViewState, label: 'Trợ lý ảo LibBot', icon: MessageSquare },
    ];
  };

  const getPersonalMenuItems = () => {
    if (userRole === 'admin' || userRole === 'librarian') {
      return [
        // Admin specific personal items if any, currently simple
      ];
    }
    return [
      { id: 'history' as ViewState, label: 'Lịch sử mượn sách', icon: BookMarked, badge: '2' },
    ];
  };

  const mainMenuItems = getMainMenuItems();
  const personalMenuItems = getPersonalMenuItems();

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <div className={`fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-40 transform transition-transform duration-300 lg:translate-x-0 flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors">
          <img 
            src="https://upload.wikimedia.org/wikipedia/vi/a/ac/Logo_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_Duy_T%C3%A2n.png" 
            alt="DTU Logo" 
            className="h-12 w-auto mr-3 object-contain"
          />
          <div>
            <h1 className="font-bold text-brand-700 dark:text-brand-500 text-lg tracking-tight leading-none">DTU Library</h1>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
              {userRole === 'admin' ? 'Admin Portal' : userRole === 'librarian' ? 'Librarian Portal' : 'Student Portal'}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Menu Chính</div>
          
          {mainMenuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                currentView === item.id 
                  ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100 dark:bg-gray-800 dark:text-brand-400 dark:ring-gray-700' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon size={20} className={currentView === item.id ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500'} />
              {item.label}
            </button>
          ))}

          {personalMenuItems.length > 0 && (
            <>
              <div className="px-3 mt-6 mb-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Cá nhân</div>
              {personalMenuItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    currentView === item.id 
                      ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100 dark:bg-gray-800 dark:text-brand-400 dark:ring-gray-700' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon size={20} className={currentView === item.id ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500'} />
                  {item.label}
                  {item.badge && (
                    <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${
                      currentView === item.id 
                        ? 'bg-brand-200 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300' 
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </>
          )}

          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors mt-2">
            <HelpCircle size={20} className="text-gray-400 dark:text-gray-500" />
            Trợ giúp & Hướng dẫn
          </button>

          <button 
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Settings size={20} className="text-gray-400 dark:text-gray-500" />
            Cài đặt giao diện
          </button>
        </div>

        {/* Footer User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border ${
              userRole === 'admin' 
                ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400' 
                : userRole === 'librarian'
                ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400'
                : 'bg-brand-100 text-brand-700 border-brand-200 dark:bg-brand-900/30 dark:text-brand-400'
            }`}>
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{userName}</p>
              <p className="text-[10px] text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Đang trực tuyến
              </p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors py-1"
          >
            <LogOut size={14} /> Đăng xuất
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;