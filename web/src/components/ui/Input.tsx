import { cn } from '@utils/cn';
import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, ...props }, ref) => {
    return (
      <div className='flex flex-col gap-1.5 w-full'>
        {label && (
          <label
            htmlFor={props.id}
            className='text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--gta-text-dim)] ml-0.5'
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            'relative flex items-center h-[48px] px-4 transition-all duration-150',
            'bg-[var(--gta-surface)] border border-[var(--gta-border)]',
            'hover:border-[var(--gta-border-light)]',
            'focus-within:border-[var(--gta-green)] focus-within:shadow-[0_0_8px_var(--gta-green-glow)]',
            error && 'border-[var(--gta-red)]/50 focus-within:border-[var(--gta-red)]',
            className,
          )}
        >
          <input
            type={type}
            className='flex-1 bg-transparent border-none p-0 text-sm font-medium text-[var(--gta-text)] placeholder:text-[var(--gta-text-dim)] focus:outline-none focus:ring-0 w-full'
            ref={ref}
            {...props}
          />
        </div>
        {helperText && (
          <span
            className={cn(
              'text-[10px] font-bold uppercase tracking-[0.1em] px-0.5',
              error ? 'text-[var(--gta-red)]' : 'text-[var(--gta-text-dim)]',
            )}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
