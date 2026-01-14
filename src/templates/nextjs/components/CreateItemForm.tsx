'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export function CreateItemForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setForm({ title: '', description: '' });
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create item');
      }
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        required
        placeholder="Item title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <Input
        placeholder="Item description (optional)"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Item'}
      </Button>
    </form>
  );
}

