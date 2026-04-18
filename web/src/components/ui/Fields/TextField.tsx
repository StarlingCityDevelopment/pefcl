import React from 'react';
import { cn } from '@utils/cn';

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
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-white/40 px-1 italic">
          {label}
        </label>
      )}
      
      <div className={cn(
        "relative flex items-center min-h-[44px] px-3.5 rounded-xl transition-all duration-200",
        "bg-white/[0.03] border border-white/5",
        "hover:bg-white/[0.05] hover:border-white/10",
        "focus-within:bg-black focus-within:border-white/20 focus-within:ring-4 focus-within:ring-white/[0.02]",
        isError && "bg-red-500/5 border-red-500/20 hover:border-red-500/30 focus-within:border-red-500/40 focus-within:ring-red-500/5"
      )}>
        {startAdornment && (
          <div className="mr-3 text-white/20 group-focus-within:text-white/40 transition-colors">
            {startAdornment}
          </div>
        )}
        
        <input
          {...props}
          value={value ?? ''}
          onChange={onChange}
          className={cn(
            "w-full bg-transparent border-none outline-none text-sm font-medium text-white placeholder:text-white/20 py-2.5",
            "autofill:bg-transparent"
          )}
        />

        {endAdornment && (
          <div className="ml-3 text-white/20 group-focus-within:text-white/40 transition-colors">
            {endAdornment}
          </div>
        )}
      </div>

      {helperText && (
        <span className="px-1 text-[10px] font-bold uppercase tracking-widest text-red-500 italic">
          {helperText}
        </span>
      )}
    </div>
  );
};

export default TextField;


