import { cn } from "@utils/cn";
import { Check } from 'lucide-react';
import type React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox: Component<CheckboxProps> = (props) => {
  const [local, others] = splitProps(props, ['label', 'class', 'checked']);
 
  return (
    <label class={cn('inline-flex items-center gap-3 cursor-pointer group', local.class)}>
      <div class='relative'>
        <input 
          type='checkbox' 
          class='peer sr-only' 
          checked={local.checked} 
          {...others} 
        />
        <div
          class={cn(
            'w-5 h-5 border transition-all duration-150 flex items-center justify-center',
            'bg-bg-surface border-border-main peer-hover:border-primary/50',
            'peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white',
            'peer-focus-visible:ring-1 peer-focus-visible:ring-primary',
          )}
        >
          <Check
            class={cn(
              'w-3.5 h-3.5 transition-transform duration-150 scale-0 peer-checked:scale-100',
              'text-white font-bold',
            )}
            strokeWidth={3}
          />
        </div>
      </div>
      <Show when={local.label}>
        <span class='text-sm font-medium text-text-muted group-hover:text-fg-main transition-colors'>
          {local.label}
        </span>
      </Show>
    </label>
  );
};

export default Checkbox;
