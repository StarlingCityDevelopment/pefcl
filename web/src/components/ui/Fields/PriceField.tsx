// web/src/components/ui/Fields/PriceField.tsx
import { useConfig } from "@hooks/useConfig";
import { cn } from "@utils/cn";
import { formatMoneyWithoutCurrency, getCurrencySign, getSignLocation } from "@utils/currency";
import { type JSX, createSignal, splitProps, Show } from 'solid-js';
import { Typography } from '../Typography';

interface Props extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}

const PriceField = (props: Props) => {
  const [local, others] = splitProps(props, ['label', 'error', 'class', 'value', 'onChange']);
  const config = useConfig();
  const [isFocused, setIsFocused] = createSignal(false);

  const currencySignLocation = () => getSignLocation(config());
  const isLocationBefore = () => currencySignLocation() === 'before';
  const currencySign = () => getCurrencySign(config());

  const handleInput = (event: Event & { currentTarget: HTMLInputElement; target: HTMLInputElement }) => {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\D/g, '');
    const formattedValue = formatMoneyWithoutCurrency(Number(value), config()?.general?.language);

    if (!value) {
      if (local.onChange) {
          (local.onChange as any)(event);
      }
      return;
    }

    // Update target value and trigger onChange if provided
    target.value = formattedValue;
    if (local.onChange) {
        (local.onChange as any)(event);
    }
  };

  return (
    <div class='flex flex-col gap-2 w-full'>
      <Show when={local.label}>
        <Typography variant='pre' class='text-[var(--gta-text-dim)]'>
          {local.label}
        </Typography>
      </Show>
      <div
        class={cn(
          'flex h-[48px] items-center px-4 transition-all duration-150',
          'bg-[var(--gta-surface)] border border-[var(--gta-border)]',
          'hover:border-[var(--gta-border-light)]',
          isFocused() && 'border-[var(--gta-green)] shadow-[0_0_8px_var(--gta-green-glow)]',
          local.error && 'border-[var(--gta-red)]/50',
          local.class,
        )}
      >
        <Show when={isLocationBefore()}>
          <span class='text-sm font-bold text-[var(--gta-green)] mr-2 select-none'>{currencySign()}</span>
        </Show>

        <input
          {...others}
          type='text'
          value={local.value ?? ''}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onInput={handleInput}
          class={cn(
            'flex-1 bg-transparent border-none outline-none p-0',
            'text-base font-bold text-[var(--gta-text)] placeholder:text-[var(--gta-text-dim)]',
          )}
        />

        <Show when={!isLocationBefore()}>
          <span class='text-sm font-bold text-[var(--gta-green)] ml-2 select-none'>{currencySign()}</span>
        </Show>
      </div>
    </div>
  );
};

export default PriceField;
