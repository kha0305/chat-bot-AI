import React from 'react';
import { Bell, Calendar, Info } from 'lucide-react';

const Notification: React.FC = () => {
    const notifications = [
        {
            id: 1,
            title: "Thông báo nghỉ lễ Quốc Khánh 2/9",
            date: "30/08/2024",
            content: "Thư viện sẽ đóng cửa nghỉ lễ từ ngày 01/09 đến hết ngày 03/09. Thư viện mở cửa lại bình thường vào ngày 04/09.",
            type: "urgent"
        },
        {
            id: 2,
            title: "Cập nhật sách mới tháng 8",
            date: "25/08/2024",
            content: "Thư viện vừa nhập thêm 500 đầu sách chuyên ngành Công nghệ thông tin và Kinh tế. Mời các bạn sinh viên đến tham khảo.",
            type: "info"
        },
        {
            id: 3,
            title: "Bảo trì hệ thống thư viện số",
            date: "20/08/2024",
            content: "Hệ thống sẽ tạm ngưng phục vụ để bảo trì từ 22h00 đến 24h00 ngày 22/08. Mong quý độc giả thông cảm.",
            type: "warning"
        }
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                <Bell className="text-brand-600" />
                Thông Báo Mới Nhất
            </h1>

            <div className="space-y-4">
                {notifications.map((notif) => (
                    <div key={notif.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">{notif.title}</h3>
                            <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                <Calendar size={12} />
                                {notif.date}
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {notif.content}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${notif.type === 'urgent' ? 'bg-red-50 text-red-600 border-red-100' :
                                    notif.type === 'warning' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                        'bg-blue-50 text-blue-600 border-blue-100'
                                }`}>
                                {notif.type === 'urgent' ? 'Quan trọng' : notif.type === 'warning' ? 'Lưu ý' : 'Tin tức'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notification;
