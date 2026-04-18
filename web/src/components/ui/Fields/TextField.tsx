import { cn } from '@utils/cn';
import type React from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  helperText,
  error,
  className,
  value,
  onChange,
  startAdornment,
  endAdornment,
  ...props
}) => {
  const isError = !!error || !!helperText;

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <label
          htmlFor={props.id}
          className='text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--gta-text-dim)] px-0.5'
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
          isError && 'border-[var(--gta-red)]/30 focus-within:border-[var(--gta-red)]',
        )}
      >
        {startAdornment && (
          <div className='mr-3 text-[var(--gta-text-dim)]'>{startAdornment}</div>
        )}

        <input
          {...props}
          value={value ?? ''}
          onChange={onChange}
          className={cn(
            'w-full bg-transparent border-none outline-none text-sm font-medium text-[var(--gta-text)] placeholder:text-[var(--gta-text-dim)] py-2.5',
          )}
        />

        {endAdornment && (
          <div className='ml-3 text-[var(--gta-text-dim)]'>{endAdornment}</div>
        )}
      </div>

      {helperText && (
        <span className='px-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--gta-red)]'>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default TextField;
