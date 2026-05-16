// web/src/components/ui/Select.tsx
import { cn } from "@utils/cn";
import { ChevronDown } from 'lucide-solid';
import { type JSX, createSignal, onMount, onCleanup, For, Show } from 'solid-js';
import i18n from "@utils/i18n";
import { Typography } from './Typography';

interface SelectProps {
  value?: string | number;
  onChange?: (event: { target: { value: string | number } }) => void;
  options: { value: string | number; label: string | JSX.Element }[];
  label?: string;
  placeholder?: string;
  class?: string;
  renderValue?: (value: any) => JSX.Element;
}

const Select = (props: SelectProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef && !containerRef.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener('mousedown', handleClickOutside);
  });

  const selectedOption = () => props.options.find((opt) => opt.value === props.value);

  return (
    <div class='flex flex-col gap-1.5 w-full relative' ref={containerRef}>
      <Show when={props.label}>
        <Typography variant='pre' class='text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--gta-text-dim)] ml-0.5'>
          {props.label}
        </Typography>
      </Show>

      <button
        type='button'
        onClick={() => setIsOpen(!isOpen())}
        class={cn(
          'relative flex items-center justify-between h-[48px] px-4 transition-all duration-150',
          'bg-[var(--gta-surface)] border border-[var(--gta-border)] text-left',
          'hover:border-[var(--gta-border-light)]',
          isOpen() ? 'border-[var(--gta-green)] shadow-[0_0_8px_var(--gta-green-glow)]' : '',
          props.class,
        )}
      >
        <div class='flex-1 truncate'>
          {props.renderValue ? (
            props.renderValue(props.value)
          ) : (
            <Show when={selectedOption()} fallback={
              <span class='text-sm font-medium text-[var(--gta-text-dim)]'>
                {props.placeholder || i18n.t('Select option')}
              </span>
            }>
              <span class='text-sm font-bold text-[var(--gta-text)]'>{selectedOption()?.label}</span>
            </Show>
          )}
        </div>
        <ChevronDown
          size={16}
          class={cn(
            'text-[var(--gta-text-dim)] transition-transform duration-150',
            isOpen() && 'rotate-180 text-[var(--gta-green)]',
          )}
        />
      </button>

      <Show when={isOpen()}>
        <div class='absolute top-[calc(100%+4px)] left-0 right-0 z-50 overflow-hidden bg-[var(--gta-dark)] border border-[var(--gta-green)] shadow-[0_8px_24px_rgba(0,0,0,0.6)]'>
          <div class='max-h-[300px] overflow-y-auto no-scrollbar'>
            <For each={props.options}>
              {(option) => (
                <button
                  type='button'
                  onClick={() => {
                    props.onChange?.({ target: { value: option.value } });
                    setIsOpen(false);
                  }}
                  class={cn(
                    'flex items-center w-full px-4 py-3 text-left transition-all duration-100 border-b border-[var(--gta-border)]/50 last:border-b-0',
                    'text-sm font-medium',
                    option.value === props.value
                      ? 'bg-[var(--gta-green)]/15 text-[var(--gta-green)] font-bold'
                      : 'text-[var(--gta-text-muted)] hover:text-[var(--gta-text)] hover:bg-[var(--gta-surface)]',
                  )}
                >
                  {option.label}
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Select;
