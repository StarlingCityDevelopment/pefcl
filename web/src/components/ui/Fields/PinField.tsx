// web/src/components/ui/Fields/PinField.tsx
import { PIN_CODE_LENGTH } from "@common/constants";
import { type JSX, For, Show, onMount } from 'solid-js';
import Count from '../Count';
import { Typography } from '../Typography';

interface PinFieldProps {
  label?: string;
  value: string;
  onChange: (event: Event & { currentTarget: HTMLInputElement; target: HTMLInputElement }) => void;
  isLoading?: boolean;
}

const PinField = (props: PinFieldProps) => {
  let inputRef: HTMLInputElement | undefined;
  const pinIndices = Array.from({ length: PIN_CODE_LENGTH }, (_, i) => i);

  onMount(() => {
    inputRef?.focus();
  });

  return (
    <div class='flex flex-col gap-4 w-full'>
      <Show when={props.label}>
        <Typography variant='pre' class='text-[var(--gta-text-dim)]'>
          {props.label}
        </Typography>
      </Show>
      <div class='flex items-center justify-center gap-2 relative'>
        <input
          ref={inputRef}
          type='number'
          value={props.value}
          onInput={props.onChange}
          onBlur={() => inputRef?.focus()}
          // biome-ignore lint/a11y/noAutofocus: Autofocus is required for NUI hardware terminal simulation
          autofocus
          class='absolute inset-0 opacity-0 cursor-default digit-input'
        />

        <For each={pinIndices}>
          {(index) => (
            <Count
              amount={props.value[index] ? '•' : ''}
              focus={
                (props.value.length === index || (index === PIN_CODE_LENGTH - 1 && props.value.length === PIN_CODE_LENGTH)) &&
                !props.isLoading
              }
            />
          )}
        </For>
      </div>
    </div>
  );
};

export default PinField;
