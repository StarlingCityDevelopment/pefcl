// web/src/components/ui/Fields/TextField.tsx
import { cn } from "@utils/cn";
import { type JSX, splitProps, Show } from 'solid-js';

interface TextFieldProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  startAdornment?: JSX.Element;
  endAdornment?: JSX.Element;
}

const TextField = (props: TextFieldProps) => {
  const [local, others] = splitProps(props, [
    'label',
    'helperText',
    'error',
    'class',
    'value',
    'onChange',
    'startAdornment',
    'endAdornment',
    'id'
  ]);

  const isError = () => !!local.error || !!local.helperText;

  return (
    <div class={cn('flex flex-col gap-1.5 w-full', local.class)}>
      <Show when={local.label}>
        <label
          for={local.id}
          class='text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--gta-text-dim)] px-0.5'
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
          isError() && 'border-[var(--gta-red)]/30 focus-within:border-[var(--gta-red)]',
        )}
      >
        <Show when={local.startAdornment}>
          <div class='mr-3 text-[var(--gta-text-dim)]'>{local.startAdornment}</div>
        </Show>

        <input
          {...others}
          id={local.id}
          value={local.value ?? ''}
          onInput={(e) => {
              // Handle Solid's onInput for value changes
              if (local.onChange) {
                  const target = e.target as HTMLInputElement;
                  (local.onChange as any)({ target: { value: target.value } });
              }
          }}
          class={cn(
            'w-full bg-transparent border-none outline-none text-sm font-medium text-[var(--gta-text)] placeholder:text-[var(--gta-text-dim)] py-2.5',
          )}
        />

        <Show when={local.endAdornment}>
          <div class='ml-3 text-[var(--gta-text-dim)]'>{local.endAdornment}</div>
        </Show>
      </div>

      <Show when={local.helperText}>
        <span class='px-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--gta-red)]'>
          {local.helperText}
        </span>
      </Show>
    </div>
  );
};

export default TextField;
