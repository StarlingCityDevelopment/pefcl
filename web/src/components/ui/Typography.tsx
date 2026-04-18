import { cn } from '@utils/cn';
import * as React from 'react';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small' | 'muted' | 'pre' | 'label';
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = 'p', ...props }, ref) => {
    const variants = {
      h1: 'scroll-m-20 text-5xl font-black tracking-tighter italic text-white uppercase leading-none',
      h2: 'scroll-m-20 text-3xl font-black tracking-tight text-white leading-tight',
      h3: 'scroll-m-20 text-2xl font-bold tracking-tight text-white leading-snug',
      h4: 'scroll-m-20 text-xl font-bold tracking-tight text-white',
      p: 'text-base leading-relaxed text-white/80',
      small: 'text-[13px] font-medium leading-none text-white/60',
      muted: 'text-sm font-medium text-slate-500 tracking-tight',
      pre: 'text-[9px] font-black uppercase tracking-[0.25em] text-slate-500',
      label: 'text-[11px] font-bold uppercase tracking-widest text-white/40',
    };

    const ComponentMap: Record<string, keyof React.JSX.IntrinsicElements> = {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      p: 'p',
      small: 'span',
      muted: 'span',
      pre: 'div',
      label: 'label',
    };

    const Component = ComponentMap[variant] || 'p';

    return (
      <Component
        ref={ref as any}
        className={cn('transition-colors duration-300', variants[variant], className)}
        {...props}
      />
    );
  },
);
Typography.displayName = 'Typography';
