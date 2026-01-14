import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm',
          'placeholder:text-gray-500',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
          'dark:placeholder:text-gray-400',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

