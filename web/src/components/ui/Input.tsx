// web/src/components/ui/Input.tsx
import { cn } from "@utils/cn";
import { type JSX, splitProps, Show } from 'solid-js';

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  helperText?: string;
}

const Input = (props: InputProps) => {
  const [local, others] = splitProps(props, ['class', 'type', 'label', 'error', 'helperText', 'ref', 'id']);
  
  return (
    <div class='flex flex-col gap-1.5 w-full'>
      <Show when={local.label}>
        <label
          for={local.id}
          class='text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--gta-text-dim)] ml-0.5'
        >
          {local.label}
        </label>
      </Show>
      <div
        class={cn(
          'relative flex items-center h-[48px] px-4 transition-all duration-150',
          'bg-[var(--gta-surface)] border border-[var(--gta-border)]',
          'hover:border-[var(--gta-border-light)]',
          'focus-within:border-[var(--gta-green)] focus-within:shadow-[0_0_8px_var(--gta-green-glow)]',
          local.error && 'border-[var(--gta-red)]/50 focus-within:border-[var(--gta-red)]',
          local.class,
        )}
      >
        <input
          id={local.id}
          type={local.type}
          class='flex-1 bg-transparent border-none p-0 text-sm font-medium text-[var(--gta-text)] placeholder:text-[var(--gta-text-dim)] focus:outline-none focus:ring-0 w-full'
          ref={local.ref}
          {...others}
        />
      </div>
      <Show when={local.helperText}>
        <span
          class={cn(
            'text-[10px] font-bold uppercase tracking-[0.1em] px-0.5',
            local.error ? 'text-[var(--gta-red)]' : 'text-[var(--gta-text-dim)]',
          )}
        >
          {local.helperText}
        </span>
      </Show>
    </div>
  );
};

export { Input };
