import { useState } from 'react';
import { api } from '../services/api';

export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const get = async <T>(url: string): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(url);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Request failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const post = async <T>(url: string, data?: any): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(url, data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Request failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const put = async <T>(url: string, data?: any): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(url, data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Request failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const del = async (url: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(url);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Request failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { get, post, put, del, loading, error };
}

