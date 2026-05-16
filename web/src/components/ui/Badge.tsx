// web/src/components/ui/Badge.tsx
import { cn } from "@utils/cn";
import { type ParentProps, Show, Suspense, type Accessor } from 'solid-js';

interface BadgeProps extends ParentProps {
  count: Accessor<number> | number;
  class?: string;
}

const Badge = (props: BadgeProps) => {
  const getCount = () => typeof props.count === 'function' ? props.count() : props.count;

  return (
    <Suspense
      fallback={
        <div class='relative inline-flex'>
          {props.children}
          <span class='absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-white/20 animate-pulse' />
        </div>
      }
    >
      <div class='relative inline-flex'>
        {props.children}
        <Show when={getCount() > 0}>
          <span
            class={cn(
              'absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-white text-black text-[10px] font-bold tracking-tight transition-all duration-300',
              props.class,
            )}
          >
            {getCount()}
          </span>
        </Show>
      </div>
    </Suspense>
  );
};

export default Badge;
