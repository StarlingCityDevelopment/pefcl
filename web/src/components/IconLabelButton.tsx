// web/src/components/IconLabelButton.tsx
import { cn } from "@utils/cn";
import { type Component, type JSX, splitProps } from 'solid-js';

interface IconButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: JSX.Element;
  children?: JSX.Element;
}

export const IconButton: Component<IconButtonProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'icon', 'class']);
  
  return (
    <button
      class={cn(
        'inline-flex items-center justify-center gap-3 px-6 py-2 bg-primary text-white font-display font-black uppercase tracking-tight transition-all hover:brightness-110 active:scale-95',
        local.class,
      )}
      {...others}
    >
      {local.children}
      <span class='shrink-0'>{local.icon}</span>
    </button>
  );
};

interface IconLabelButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: JSX.Element;
  children: JSX.Element;
}

const IconLabelButton: Component<IconLabelButtonProps> = (props) => {
  const [local, others] = splitProps(props, ['children', 'icon', 'class']);
  
  return (
    <button
      class={cn(
        'inline-flex items-center justify-center gap-3 px-8 py-4 bg-fg-main text-bg-main font-display font-black uppercase tracking-tight transition-all hover:opacity-90 active:scale-[0.98]',
        local.class,
      )}
      {...others}
    >
      {local.children}
      <span class='shrink-0'>{local.icon}</span>
    </button>
  );
};

export default IconLabelButton;
