// web/src/components/ui/Button.tsx
import { cn } from "@utils/cn";
import { type JSX, splitProps } from 'solid-js';

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'text' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
}

const Button = (props: ButtonProps) => {
  const [local, others] = splitProps(props, ['class', 'variant', 'size', 'children', 'ref']);
  
  const variant = () => local.variant || 'primary';
  const size = () => local.size || 'md';

  const variants = {
    primary:
      'bg-primary text-white font-bold hover:bg-primary/90 active:scale-95 uppercase shadow-premium',
    secondary:
      'bg-bg-panel text-fg-main border border-border-main hover:bg-bg-surface hover:border-stroke uppercase',
    ghost: 'bg-transparent text-text-muted hover:text-fg-main hover:bg-bg-panel',
    text: 'bg-transparent text-text-muted hover:text-fg-main uppercase',
    outline:
      'bg-transparent border border-border-main text-fg-main hover:border-primary hover:text-primary uppercase',
    danger:
      'bg-red-400/10 text-red-400 border border-red-400/30 hover:bg-red-400 hover:text-white uppercase',
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
      ref={local.ref}
      class={cn(
        'inline-flex items-center justify-center transition-all duration-150 ease-out',
        'active:scale-[0.97] disabled:opacity-30 disabled:pointer-events-none select-none',
        'relative overflow-hidden',
        variants[variant()],
        sizes[size()],
        local.class,
      )}
      {...others}
    >
      {local.children}
    </button>
  );
};

export default Button;
