import { cn } from '@utils/cn';
import * as React from 'react';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small' | 'muted' | 'pre' | 'label';
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = 'p', ...props }, ref) => {
    const variants = {
      h1: 'text-3xl font-black tracking-wide uppercase text-[var(--gta-text)] leading-none',
      h2: 'text-xl font-bold tracking-wide uppercase text-[var(--gta-text)] leading-tight',
      h3: 'text-lg font-bold tracking-wide uppercase text-[var(--gta-text)] leading-snug',
      h4: 'text-base font-bold tracking-wide uppercase text-[var(--gta-text)]',
      p: 'text-sm leading-relaxed text-[var(--gta-text-muted)]',
      small: 'text-xs font-medium leading-none text-[var(--gta-text-dim)]',
      muted: 'text-xs font-medium text-[var(--gta-text-dim)] tracking-wide uppercase',
      pre: 'text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gta-text-dim)]',
      label: 'text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--gta-text-dim)]',
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
        className={cn('transition-colors duration-200', variants[variant], className)}
        {...props}
      />
    );
  },
);
Typography.displayName = 'Typography';
