// web/src/components/ui/Base.tsx
import { cn } from "@utils/cn";
import { type JSX, splitProps } from 'solid-js';

const Skeleton = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return <div class={cn('animate-pulse bg-[var(--gta-surface)]', local.class)} {...others} />;
};

const Card = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [local, others] = splitProps(props, ['class']);
  return (
    <div
      class={cn('border border-[var(--gta-border)] bg-[var(--gta-panel)] text-[var(--gta-text)]', local.class)}
      {...others}
    />
  );
};

export { Skeleton, Card };
