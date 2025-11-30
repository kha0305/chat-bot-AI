import React, { useState, useEffect } from 'react';
import { fetchGuides, addGuide, updateGuide, deleteGuide } from '../services/api';
import { Guide } from '../types';
import { Trash2, Edit, Save, X } from 'lucide-react';

const AdminGuide: React.FC = () => {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Guide>>({
        tieu_de: '',
        noi_dung: '',
        thu_tu: 0
    });

    useEffect(() => {
        loadGuides();
    }, []);

    const loadGuides = async () => {
        try {
            const data = await fetchGuides();
            setGuides(data);
        } catch (error) {
            console.error('Failed to load guides', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateGuide(editingId, formData);
            } else {
                await addGuide(formData);
            }
            setEditingId(null);
            setFormData({ tieu_de: '', noi_dung: '', thu_tu: 0 });
            loadGuides();
        } catch (error) {
            console.error('Failed to save guide', error);
        }
    };

    const handleEdit = (guide: Guide) => {
        setEditingId(guide.id);
        setFormData(guide);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this guide?')) {
            try {
                await deleteGuide(id);
                loadGuides();
            } catch (error) {
                console.error('Failed to delete guide', error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Guides</h2>

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
                        placeholder="Content (Markdown supported)"
                        value={formData.noi_dung}
                        onChange={(e) => setFormData({ ...formData, noi_dung: e.target.value })}
                        className="p-2 border rounded h-64 font-mono text-sm"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Order"
                        value={formData.thu_tu}
                        onChange={(e) => setFormData({ ...formData, thu_tu: parseInt(e.target.value) })}
                        className="p-2 border rounded"
                    />
                    <div className="flex gap-2">
                        <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            <Save size={18} /> {editingId ? 'Update' : 'Add'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setFormData({ tieu_de: '', noi_dung: '', thu_tu: 0 });
                                }}
                                className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                <X size={18} /> Cancel
                            </button>
                        )}
                    </div>
                </div>
            </form>

            <div className="grid gap-4">
                {guides.map((guide) => (
                    <div key={guide.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{guide.tieu_de}</h3>
                            <div className="text-gray-600 mt-1 whitespace-pre-wrap max-h-32 overflow-hidden text-ellipsis">
                                {guide.noi_dung}
                            </div>
                            <p className="text-sm text-gray-400 mt-2">Order: {guide.thu_tu}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                            <button onClick={() => handleEdit(guide)} className="text-blue-600 hover:text-blue-800">
                                <Edit size={20} />
                            </button>
                            <button onClick={() => handleDelete(guide.id)} className="text-red-600 hover:text-red-800">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminGuide;
