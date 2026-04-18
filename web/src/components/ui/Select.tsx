import { cn } from '@utils/cn';
import { ChevronDown } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from './Typography';

interface SelectProps {
  value?: string | number;
  onChange?: (event: { target: { value: string | number } }) => void;
  options: { value: string | number; label: string | React.ReactNode }[];
  label?: string;
  placeholder?: string;
  className?: string;
  renderValue?: (value: any) => React.ReactNode;
}

const Select = ({ value, onChange, options, label, placeholder, className, renderValue }: SelectProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className='flex flex-col gap-1.5 w-full relative' ref={containerRef}>
      {label && (
        <Typography variant='pre' className='text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1'>
          {label}
        </Typography>
      )}

      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative flex items-center justify-between min-h-[52px] px-5 rounded-2xl transition-all duration-300',
          'bg-white/[0.03] border border-white/5 text-left',
          'hover:bg-white/[0.05] hover:border-white/10',
          isOpen ? 'bg-white/[0.01] border-white ring-4 ring-white/5' : '',
          className,
        )}
      >
        <div className='flex-1 truncate'>
          {renderValue ? (
            renderValue(value)
          ) : selectedOption ? (
            <span className='text-sm font-bold text-white tracking-tight'>{selectedOption.label}</span>
          ) : (
            <span className='text-sm font-medium text-slate-500 tracking-tight'>
              {placeholder || t('Select option')}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn('w-4 h-4 text-slate-500 transition-transform duration-300', isOpen && 'rotate-180 text-white')}
        />
      </button>

      {isOpen && (
        <div className='absolute top-[calc(100%+8px)] left-0 right-0 z-50 overflow-hidden rounded-2xl bg-black/95 border border-white/10 -[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-200'>
          <div className='max-h-[300px] overflow-y-auto no-scrollbar py-2'>
            {options.map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => {
                  onChange?.({ target: { value: option.value } });
                  setIsOpen(false);
                }}
                className={cn(
                  'flex items-center w-full px-5 py-3 text-left transition-all',
                  'text-sm font-medium tracking-tight',
                  option.value === value
                    ? 'bg-white/10 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
