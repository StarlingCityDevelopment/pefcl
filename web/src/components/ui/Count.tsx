import { cn } from '@utils/cn';
import type React from 'react';

interface CountProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: string | number;
  focus?: boolean;
}

const Count: React.FC<CountProps> = ({ amount, focus = false, className, ...props }) => {
  return (
    <div
      className={cn(
        'flex justify-center items-center text-center',
        'h-11 min-w-[2.75rem] px-2',
        'font-bold text-sm transition-all duration-150',
        'bg-[var(--gta-surface)] border border-[var(--gta-border)] text-[var(--gta-text-muted)]',
        focus && 'border-[var(--gta-green)] text-[var(--gta-green)] shadow-[0_0_10px_var(--gta-green-glow)]',
        className,
      )}
      {...props}
    >
      {amount}
    </div>
  );
};

export default Count;
