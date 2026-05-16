// web/src/components/ui/Typography.tsx
import { cn } from "@utils/cn";
import { splitProps, type JSX, type ParentProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

interface TypographyProps extends JSX.HTMLAttributes<HTMLElement>, ParentProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small' | 'muted' | 'pre' | 'label';
  ref?: (el: HTMLElement) => void;
}

export const Typography = (props: TypographyProps) => {
  const [local, others] = splitProps(props, ['class', 'variant', 'ref', 'children']);
  const variant = () => local.variant || 'p';

  const variants = {
    h1: 'text-3xl font-display font-black tracking-tight uppercase text-fg-main leading-none',
    h2: 'text-xl font-display font-bold tracking-tight uppercase text-fg-main leading-tight',
    h3: 'text-lg font-display font-bold tracking-tight uppercase text-fg-main leading-snug',
    h4: 'text-base font-display font-bold tracking-tight uppercase text-fg-main',
    p: 'text-sm font-sans leading-relaxed text-text-muted',
    small: 'text-xs font-sans font-medium leading-none text-text-muted/80',
    muted: 'text-xs font-sans font-medium text-text-muted tracking-wide uppercase',
    pre: 'text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-text-muted',
    label: 'text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-text-muted',
  };

  const componentMap = {
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

  return (
    <Dynamic
      component={componentMap[variant()] || 'p'}
      ref={local.ref}
      class={cn('transition-colors duration-200', variants[variant()], local.class)}
      {...others}
    >
      {local.children}
    </Dynamic>
  );
};
