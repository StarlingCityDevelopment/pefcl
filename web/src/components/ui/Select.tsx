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
        <Typography variant='pre' className='text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--gta-text-dim)] ml-0.5'>
          {label}
        </Typography>
      )}

      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative flex items-center justify-between h-[48px] px-4 transition-all duration-150',
          'bg-[var(--gta-surface)] border border-[var(--gta-border)] text-left',
          'hover:border-[var(--gta-border-light)]',
          isOpen ? 'border-[var(--gta-green)] shadow-[0_0_8px_var(--gta-green-glow)]' : '',
          className,
        )}
      >
        <div className='flex-1 truncate'>
          {renderValue ? (
            renderValue(value)
          ) : selectedOption ? (
            <span className='text-sm font-bold text-[var(--gta-text)]'>{selectedOption.label}</span>
          ) : (
            <span className='text-sm font-medium text-[var(--gta-text-dim)]'>
              {placeholder || t('Select option')}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-[var(--gta-text-dim)] transition-transform duration-150',
            isOpen && 'rotate-180 text-[var(--gta-green)]',
          )}
        />
      </button>

      {isOpen && (
        <div className='absolute top-[calc(100%+4px)] left-0 right-0 z-50 overflow-hidden bg-[var(--gta-dark)] border border-[var(--gta-green)] shadow-[0_8px_24px_rgba(0,0,0,0.6)]'>
          <div className='max-h-[300px] overflow-y-auto no-scrollbar'>
            {options.map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => {
                  onChange?.({ target: { value: option.value } });
                  setIsOpen(false);
                }}
                className={cn(
                  'flex items-center w-full px-4 py-3 text-left transition-all duration-100 border-b border-[var(--gta-border)]/50 last:border-b-0',
                  'text-sm font-medium',
                  option.value === value
                    ? 'bg-[var(--gta-green)]/15 text-[var(--gta-green)] font-bold'
                    : 'text-[var(--gta-text-muted)] hover:text-[var(--gta-text)] hover:bg-[var(--gta-surface)]',
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
