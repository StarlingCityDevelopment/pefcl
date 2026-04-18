import { cn } from '@utils/cn';
import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'text' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary:
        'bg-[var(--gta-green)] text-black font-bold hover:bg-[var(--gta-green)]/90 active:bg-[var(--gta-green-dark)] uppercase',
      secondary:
        'bg-[var(--gta-surface)] text-[var(--gta-text)] border border-[var(--gta-border-light)] hover:bg-[var(--gta-border)] hover:border-[var(--gta-text-dim)] uppercase',
      ghost: 'bg-transparent text-[var(--gta-text-dim)] hover:text-[var(--gta-text)] hover:bg-[var(--gta-surface)]',
      text: 'bg-transparent text-[var(--gta-text-muted)] hover:text-[var(--gta-text)] uppercase',
      outline:
        'bg-transparent border border-[var(--gta-border-light)] text-[var(--gta-text)] hover:border-[var(--gta-green)] hover:text-[var(--gta-green)] uppercase',
      danger:
        'bg-[var(--gta-red)]/10 text-[var(--gta-red)] border border-[var(--gta-red)]/30 hover:bg-[var(--gta-red)] hover:text-white uppercase',
    };

    const sizes = {
      sm: 'h-8 px-3 text-[10px] font-bold tracking-[0.15em]',
      md: 'h-10 px-5 text-xs font-bold tracking-[0.12em]',
      lg: 'h-12 px-6 text-sm font-bold tracking-[0.1em]',
      xl: 'h-14 px-8 text-sm font-black tracking-[0.1em]',
      icon: 'h-10 w-10 flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-150 ease-out',
          'active:scale-[0.97] disabled:opacity-30 disabled:pointer-events-none select-none',
          'relative overflow-hidden',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {props.children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export default Button;
