// web/src/components/Layout.tsx
import { cn } from "@utils/cn";
import { Loader2 } from 'lucide-solid';
import { type ParentProps, Show, Suspense } from 'solid-js';
import i18n from "@utils/i18n";
import { Typography } from './ui/Typography';

interface LayoutProps extends ParentProps {
  title?: string;
  class?: string;
}

const Layout = (props: LayoutProps) => {
  return (
    <div class={cn('relative p-5 w-full h-full flex flex-col', props.class)}>
      <Show when={props.title}>
        <div class='mb-6 pb-4 border-b border-border-main'>
          <Typography variant='h2' class='text-fg-main font-display font-black tracking-[0.1em] text-lg'>
            {props.title}
          </Typography>
        </div>
      </Show>

      <Suspense
        fallback={
          <div class='flex flex-col items-center justify-center h-full gap-4 text-text-muted'>
            <Loader2 size={24} class='animate-spin text-primary opacity-80' />
            <Typography variant='pre' class='text-text-muted font-mono'>
              {i18n.t('ESTABLISHING SECURE LINK...', { name: props.title || '' })}
            </Typography>
          </div>
        }
      >
        {props.children}
      </Suspense>
    </div>
  );
};

export default Layout;
