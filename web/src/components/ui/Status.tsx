// web/src/components/ui/Status.tsx
import { cn } from "@utils/cn";
import { type Component, splitProps } from 'solid-js';

type StatusColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

interface StatusProps {
  label: string;
  color: StatusColor;
  class?: string;
}

const colorMap: Record<StatusColor, string> = {
  default: 'text-text-muted bg-bg-surface border-border-main',
  primary: 'text-primary bg-primary/10 border-primary/20',
  secondary: 'text-text-muted bg-bg-surface border-border-main',
  error: 'text-red-400 bg-red-400/10 border-red-400/20',
  info: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  success: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  warning: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
};

const Status: Component<StatusProps> = (props) => {
  const [local] = splitProps(props, ['label', 'color', 'class']);
  
  return (
    <div
      class={cn(
        'inline-flex items-center px-2.5 py-1 border text-[10px] font-black uppercase tracking-[0.1em] leading-none transition-all font-mono',
        colorMap[local.color],
        local.class,
      )}
    >
      {local.label}
    </div>
  );
};

export default Status;
