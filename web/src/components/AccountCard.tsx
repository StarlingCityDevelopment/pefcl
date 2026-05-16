// web/src/components/AccountCard.tsx
import { type Account, AccountType } from "@typings/Account";
import { cn } from "@utils/cn";
import copy from 'copy-to-clipboard';
import { Copy, Star } from 'lucide-solid';
import { Show } from 'solid-js';
import i18n from "@utils/i18n";
import { useConfig } from "@hooks/useConfig";
import { formatMoney } from "@utils/currency";
import { Skeleton } from './ui/Base';
import { Typography } from './ui/Typography';

type AccountCardProps = {
  account: Account;
  selected?: boolean;
  withCopy?: boolean;
  isDisabled?: boolean;
};

export const AccountCard = (props: AccountCardProps) => {
  const config = useConfig();

  return (
    <div
      class={cn(
        'group relative flex flex-col justify-between h-[130px] w-full p-5',
        'bg-bg-panel border border-border-main',
        'transition-all duration-200 cursor-pointer select-none shadow-sm',
        'hover:border-primary/40 hover:bg-bg-surface hover:shadow-premium',
        props.selected && 'border-primary bg-primary/5 shadow-premium',
        props.isDisabled && 'opacity-30 grayscale pointer-events-none',
      )}
    >
      {/* Active indicator */}
      <div
        class={cn(
          'absolute top-0 left-0 right-0 h-[2px] transition-all duration-300',
          props.selected ? 'bg-primary' : 'bg-transparent group-hover:bg-primary/30',
        )}
      />

      <div class='relative z-10 flex justify-between items-start gap-4'>
        <div class='flex flex-col gap-1 min-w-0'>
          <Typography variant='label' class='text-[9px] text-text-muted font-sans font-bold'>
            {i18n.t('Balance')}
          </Typography>
          <Typography variant='h3' class='text-2xl font-display font-black leading-none text-primary'>
            {formatMoney(props.account.balance, config()?.general)}
          </Typography>
        </div>
        <div class='flex flex-wrap justify-end gap-2 shrink-0'>
          <Show when={props.account.isDefault}>
            <div class='flex items-center gap-1 px-2 py-0.5 bg-amber-400 text-black'>
              <Star size={8} class='fill-black' />
              <Typography variant='pre' class='text-[7px] font-black tracking-[0.1em] text-black'>
                {i18n.t('DEFAULT')}
              </Typography>
            </div>
          </Show>
          <div class='flex items-center gap-1.5 px-2 py-1 bg-bg-surface border border-border-main'>
            <div class={cn('w-1.5 h-1.5 rounded-full', props.account.type === AccountType.Shared ? 'bg-blue-500' : 'bg-slate-400')} />
            <Typography variant='pre' class='text-[7px] text-text-muted font-bold tracking-[0.15em] font-mono'>
              {props.account.type === AccountType.Shared ? i18n.t('SHARED') : i18n.t('PERSONAL')}
            </Typography>
          </div>
        </div>
      </div>

      <div class='relative z-10 flex justify-between items-end'>
        <div class='flex flex-col gap-1.5 min-w-0'>
          <div class='flex items-center gap-2'>
            <Typography
              variant='pre'
              class='text-[9px] text-text-muted font-bold tracking-[0.2em] font-mono group-hover:text-primary/70 transition-all'
            >
              {props.account.number}
            </Typography>
            <Show when={props.withCopy}>
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  copy(props.account.number);
                }}
                class='p-1 text-text-muted hover:text-primary transition-all active:scale-90'
              >
                <Copy size={10} />
              </button>
            </Show>
          </div>
          <Typography class='text-sm font-sans font-black text-fg-main tracking-tight uppercase truncate max-w-[200px]'>
            {props.account.accountName}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export const LoadingAccountCard = () => {
  return (
    <div class='flex flex-col justify-between h-[130px] w-full p-4 bg-[var(--gta-panel)] border border-[var(--gta-border)] animate-pulse'>
      <div class='space-y-3'>
        <div class='flex justify-between'>
          <Skeleton class='w-24 h-3' />
          <Skeleton class='w-16 h-4' />
        </div>
        <Skeleton class='w-[60%] h-6' />
      </div>
      <div class='flex justify-between items-end'>
        <div class='space-y-1'>
          <Skeleton class='w-32 h-3' />
          <Skeleton class='w-24 h-4' />
        </div>
      </div>
    </div>
  );
};
