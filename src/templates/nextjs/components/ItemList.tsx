'use client';

import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Trash2, Edit2, Save, X } from 'lucide-react';
import { Input } from './ui/Input';

type Item = {
  id: number;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function ItemList({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems(items.filter((item) => item.id !== id));
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const handleEdit = (item: Item) => {
    setEditingId(item.id);
    setEditForm({
      title: item.title,
      description: item.description || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: '', description: '' });
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setItems(
          items.map((item) => (item.id === id ? updatedItem : item))
        );
        setEditingId(null);
      } else {
        alert('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item');
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="p-6">
          {editingId === item.id ? (
            <div className="space-y-4">
              <Input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                placeholder="Title"
              />
              <Input
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Description"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSaveEdit(item.id)}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                {item.description && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Created {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

