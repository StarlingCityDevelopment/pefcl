import { cn } from '@utils/cn';
import type React from 'react';

type StatusColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

interface StatusProps {
  label: string;
  color: StatusColor;
  className?: string;
}

const colorMap: Record<StatusColor, string> = {
  default: 'text-[var(--gta-text-muted)] bg-[var(--gta-surface)] border-[var(--gta-border)]',
  primary: 'text-[var(--gta-green)] bg-[var(--gta-green)]/10 border-[var(--gta-green)]/30',
  secondary: 'text-[var(--gta-text-muted)] bg-[var(--gta-surface)] border-[var(--gta-border)]',
  error: 'text-[var(--gta-red)] bg-[var(--gta-red)]/10 border-[var(--gta-red)]/30',
  info: 'text-[var(--gta-cyan)] bg-[var(--gta-cyan)]/10 border-[var(--gta-cyan)]/30',
  success: 'text-[var(--gta-green)] bg-[var(--gta-green)]/10 border-[var(--gta-green)]/30',
  warning: 'text-[var(--gta-yellow)] bg-[var(--gta-yellow)]/10 border-[var(--gta-yellow)]/30',
};

const Status: React.FC<StatusProps> = ({ label, color, className }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center px-2.5 py-1 border text-[10px] font-bold uppercase tracking-[0.15em] leading-none transition-all',
        colorMap[color],
        className,
      )}
    >
      {label}
    </div>
  );
};

export default Status;
