import React, { useState, useEffect } from 'react';
import { fetchIntroduction, addIntroduction, updateIntroduction, deleteIntroduction } from '../services/api';
import { Introduction } from '../types';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';

const AdminIntroduction: React.FC = () => {
    const [introductions, setIntroductions] = useState<Introduction[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Introduction>>({
        tieu_de: '',
        noi_dung: '',
        hinh_anh: '',
        thu_tu: 0
    });

    useEffect(() => {
        loadIntroductions();
    }, []);

    const loadIntroductions = async () => {
        try {
            const data = await fetchIntroduction();
            setIntroductions(data);
        } catch (error) {
            console.error('Failed to load introductions', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateIntroduction(editingId, formData);
            } else {
                await addIntroduction(formData);
            }
            setEditingId(null);
            setFormData({ tieu_de: '', noi_dung: '', hinh_anh: '', thu_tu: 0 });
            loadIntroductions();
        } catch (error) {
            console.error('Failed to save introduction', error);
        }
    };

    const handleEdit = (intro: Introduction) => {
        setEditingId(intro.id);
        setFormData(intro);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteIntroduction(id);
                loadIntroductions();
            } catch (error) {
                console.error('Failed to delete introduction', error);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Introduction</h2>

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
                        className="p-2 border rounded h-32"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={formData.hinh_anh}
                        onChange={(e) => setFormData({ ...formData, hinh_anh: e.target.value })}
                        className="p-2 border rounded"
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
                                    setFormData({ tieu_de: '', noi_dung: '', hinh_anh: '', thu_tu: 0 });
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
                {introductions.map((intro) => (
                    <div key={intro.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg">{intro.tieu_de}</h3>
                            <p className="text-gray-600 mt-1">{intro.noi_dung}</p>
                            {intro.hinh_anh && <img src={intro.hinh_anh} alt={intro.tieu_de} className="mt-2 h-32 object-cover rounded" />}
                            <p className="text-sm text-gray-400 mt-2">Order: {intro.thu_tu}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(intro)} className="text-blue-600 hover:text-blue-800">
                                <Edit size={20} />
                            </button>
                            <button onClick={() => handleDelete(intro.id)} className="text-red-600 hover:text-red-800">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminIntroduction;
