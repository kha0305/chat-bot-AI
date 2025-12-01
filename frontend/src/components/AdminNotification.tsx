import React, { useState, useEffect } from 'react';
import { fetchNotifications, addNotification, deleteNotification } from '../services/api';
import { Notification } from '../types';
import { Trash2, Plus, Save } from 'lucide-react';

const AdminNotification: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<Partial<Notification>>({
        tieu_de: '',
        noi_dung: '',
        loai: 'info'
    });

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await fetchNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to load notifications', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addNotification(formData);
            setFormData({ tieu_de: '', noi_dung: '', loai: 'info' });
            loadNotifications();
        } catch (error) {
            console.error('Failed to add notification', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this notification?')) {
            try {
                await deleteNotification(id);
                loadNotifications();
            } catch (error) {
                console.error('Failed to delete notification', error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Notifications</h2>

            <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 gap-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={formData.tieu_de}
                        onChange={(e) => setFormData({ ...formData, tieu_de: e.target.value })}
                        className="p-2 border rounded"
                        required
                    />
                    <textarea
                        placeholder="Content"
                        value={formData.noi_dung}
                        onChange={(e) => setFormData({ ...formData, noi_dung: e.target.value })}
                        className="p-2 border rounded h-24"
                        required
                    />
                    <select
                        value={formData.loai}
                        onChange={(e) => setFormData({ ...formData, loai: e.target.value as any })}
                        className="p-2 border rounded"
                    >
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="success">Success</option>
                        <option value="error">Error</option>
                    </select>
                    <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-fit">
                        <Plus size={18} /> Add Notification
                    </button>
                </div>
            </form>

            <div className="grid gap-4">
                {notifications.map((notif) => (
                    <div key={notif.id} className={`p-4 rounded-lg shadow flex justify-between items-start border-l-4 ${notif.loai === 'info' ? 'border-blue-500 bg-blue-50' :
                            notif.loai === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                                notif.loai === 'success' ? 'border-green-500 bg-green-50' :
                                    'border-red-500 bg-red-50'
                        }`}>
                        <div>
                            <h3 className="font-bold text-lg">{notif.tieu_de}</h3>
                            <p className="text-gray-700 mt-1">{notif.noi_dung}</p>
                            <p className="text-xs text-gray-400 mt-2">{new Date(notif.ngay_tao).toLocaleString()}</p>
                        </div>
                        <button onClick={() => handleDelete(notif.id)} className="text-red-600 hover:text-red-800">
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminNotification;
