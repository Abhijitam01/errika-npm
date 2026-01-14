'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error occurred:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="p-8 max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mx-auto">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Something went wrong!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error.message || 'An unexpected error occurred'}
          </p>
          {error.digest && (
            <p className="text-sm text-gray-500 dark:text-gray-500 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={() => reset()}>
            Try again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Go home
          </Button>
        </div>
      </Card>
    </div>
  );
}

