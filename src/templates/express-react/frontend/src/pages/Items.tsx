import { useState, useEffect } from 'react';
import { useAPI } from '../hooks/useAPI';
import { Item } from '../types';

export default function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const { get, post, put, del, loading, error } = useAPI();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const data = await get<{ items: Item[] }>('/api/items');
    if (data) setItems(data.items);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const data = await put<{ item: Item }>(`/api/items/${editingId}`, formData);
      if (data) {
        setItems(items.map((item) => (item.id === editingId ? data.item : item)));
        setEditingId(null);
      }
    } else {
      const data = await post<{ item: Item }>('/api/items', formData);
      if (data) setItems([data.item, ...items]);
    }
    setFormData({ title: '', description: '' });
  };

  const handleEdit = (item: Item) => {
    setEditingId(item.id);
    setFormData({ title: item.title, description: item.description || '' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    const success = await del(`/api/items/${id}`);
    if (success) setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Items</h1>

      {/* Create/Edit Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Item' : 'Create New Item'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: '', description: '' });
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Items List */}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                {item.description && (
                  <p className="text-gray-600 mb-2">{item.description}</p>
                )}
                <p className="text-sm text-gray-500">
                  Created {new Date(item.createdAt).toLocaleDateString()}
                  {item.user && ` by ${item.user.name || item.user.email}`}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No items yet. Create your first item above!
        </div>
      )}
    </div>
  );
}

