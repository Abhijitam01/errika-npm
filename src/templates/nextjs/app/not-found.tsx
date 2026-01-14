import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="p-8 max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto">
          <FileQuestion className="h-8 w-8 text-gray-600 dark:text-gray-400" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link href="/">
          <Button>
            Back to Home
          </Button>
        </Link>
      </Card>
    </div>
  );
}

