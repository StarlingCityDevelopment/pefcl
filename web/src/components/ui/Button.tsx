import { cn } from '@utils/cn';
import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'text' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-white text-black hover:bg-white/95 active:bg-white/90',
      secondary: 'bg-white/[0.03] text-white border border-white/10 hover:bg-white/[0.06] hover:border-white/20',
      ghost: 'bg-transparent text-slate-500 hover:text-white hover:bg-white/[0.04]',
      text: 'bg-transparent text-white/70 hover:text-white hover:bg-white/[0.03]',
      outline: 'bg-transparent border border-white/10 text-white hover:border-white/30 hover:bg-white/[0.02]',
      danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40',
    };

    const sizes = {
      sm: 'h-8 px-3 text-[11px] font-bold rounded-xl tracking-tight',
      md: 'h-11 px-6 text-sm font-bold rounded-2xl tracking-tight',
      lg: 'h-14 px-8 text-base font-black rounded-[1.25rem] tracking-tight',
      xl: 'h-16 px-10 text-lg font-black rounded-[1.5rem] tracking-tighter',
      icon: 'h-11 w-11 flex items-center justify-center rounded-2xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]',
          'active:scale-[0.97] disabled:opacity-30 disabled:pointer-events-none select-none',
          'relative overflow-hidden group',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {/* Subtle shimmer effect for premium variants */}
        {(variant === 'primary' || variant === 'secondary') && (
          <span className='absolute inset-0 w-full h-full bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
        )}
        <span className='relative z-10'>{props.children}</span>
      </button>
    );
  },
);
Button.displayName = 'Button';

export default Button;
