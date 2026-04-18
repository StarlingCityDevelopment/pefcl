import { cn } from '@utils/cn';
import { Check } from 'lucide-react';
import type React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, className, checked, onChange, ...props }) => {
  return (
    <label className={cn('inline-flex items-center gap-3 cursor-pointer group', className)}>
      <div className='relative'>
        <input type='checkbox' className='peer sr-only' checked={checked} onChange={onChange} {...props} />
        <div
          className={cn(
            'w-6 h-6 rounded-lg border transition-all duration-200 flex items-center justify-center',
            'bg-white/[0.04] border-white/10 peer-hover:border-white/20',
            'peer-checked:bg-white peer-checked:border-white peer-checked:text-black',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-white/20',
          )}
        >
          <Check
            className={cn(
              'w-4 h-4 transition-transform duration-200 scale-0 peer-checked:scale-100',
              'text-black font-bold',
            )}
            strokeWidth={3}
          />
        </div>
      </div>
      {label && (
        <span className='text-sm font-medium text-white/70 group-hover:text-white transition-colors'>{label}</span>
      )}
    </label>
  );
};

export default Checkbox;
