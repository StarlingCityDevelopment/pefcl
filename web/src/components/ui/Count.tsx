// web/src/components/ui/Count.tsx
import { cn } from "@utils/cn";
import { type JSX, splitProps } from 'solid-js';

interface CountProps extends JSX.HTMLAttributes<HTMLDivElement> {
  amount: string | number;
  focus?: boolean;
}

const Count = (props: CountProps) => {
  const [local, others] = splitProps(props, ['amount', 'focus', 'class', 'children']);
  
  return (
    <div
      class={cn(
        'flex justify-center items-center text-center',
        'h-11 min-w-[2.75rem] px-2',
        'font-bold text-sm transition-all duration-150',
        'bg-[var(--gta-surface)] border border-[var(--gta-border)] text-[var(--gta-text-muted)]',
        local.focus && 'border-[var(--gta-green)] text-[var(--gta-green)] shadow-[0_0_10px_var(--gta-green-glow)]',
        local.class,
      )}
      {...others}
    >
      {local.amount}
    </div>
  );
};

export default Count;
