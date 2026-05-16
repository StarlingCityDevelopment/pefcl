// web/src/components/TransactionItem.tsx
import { useConfig } from "@hooks/useConfig";
import { type Transaction, TransactionType } from "@typings/Transaction";
import { Skeleton } from "@ui/Base";
import { Typography } from "@ui/Typography";
import { cn } from "@utils/cn";
import { formatMoney } from "@utils/currency";
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-solid';
import i18n from "@utils/i18n";

dayjs.extend(calendar);
dayjs.extend(relativeTime);

interface TransactionItemProps {
  transaction: Transaction;
  isLimitedSpace?: boolean;
}

const TransactionItem = (props: TransactionItemProps) => {
  const { message, amount, createdAt, toAccount, fromAccount, type } = props.transaction;
  const config = useConfig();
  const createdAtDate = () => dayjs(createdAt);

  const isIncoming = () => type === TransactionType.Incoming;

  return (
    <div
      class={cn(
        'group flex items-center gap-3 p-4 transition-all duration-150',
        'bg-[var(--gta-panel)] border border-[var(--gta-border)]',
        'hover:border-[var(--gta-border-light)] hover:bg-[var(--gta-surface)]',
        'relative overflow-hidden cursor-default',
      )}
    >
      {/* Left accent */}
      <div
        class={cn(
          'absolute left-0 top-0 bottom-0 w-[2px]',
          isIncoming() ? 'bg-[var(--gta-green)]' : 'bg-[var(--gta-red)]/50',
        )}
      />

      <div
        class={cn(
          'flex items-center justify-center w-9 h-9 border transition-all duration-150',
          isIncoming()
            ? 'bg-[var(--gta-green)]/10 text-[var(--gta-green)] border-[var(--gta-green)]/30'
            : 'bg-[var(--gta-surface)] text-[var(--gta-text-dim)] border-[var(--gta-border)]',
        )}
      >
        {isIncoming() ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
      </div>

      <div class='flex-1 flex flex-col min-w-0'>
        <div class='flex justify-between items-start gap-3'>
          <div class='flex flex-col min-w-0'>
            <Typography class='font-bold text-xs text-[var(--gta-text)] line-clamp-2 break-words whitespace-normal uppercase mb-1'>
              {message}
            </Typography>
            <div class='flex items-center gap-2'>
              <Typography variant='pre' class='text-[9px] text-[var(--gta-text-dim)]'>
                {createdAtDate().fromNow()}
              </Typography>
              {!props.isLimitedSpace && (
                <>
                  <div class='w-0.5 h-0.5 bg-[var(--gta-border)]' />
                  <Typography variant='pre' class='text-[9px] text-[var(--gta-text-dim)]'>
                    {createdAtDate().format('HH:mm')}
                  </Typography>
                </>
              )}
            </div>
          </div>
          <div class='flex flex-col items-end shrink-0'>
            <Typography
              class={cn(
                'font-bold text-sm leading-none mb-1 transition-all duration-150',
                isIncoming() ? 'text-[var(--gta-green)]' : 'text-[var(--gta-text-muted)]',
              )}
            >
              {isIncoming() ? '+' : '-'} {formatMoney(amount, config()?.general)}
            </Typography>
            {!props.isLimitedSpace && (fromAccount || toAccount) && (
              <Typography
                variant='label'
                class='text-[8px] text-[var(--gta-text-dim)]'
              >
                {isIncoming() ? fromAccount?.accountName || i18n.t('External') : toAccount?.accountName || i18n.t('External')}
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TransactionSkeleton = () => (
  <div class='flex items-center gap-3 p-4 bg-[var(--gta-panel)] border border-[var(--gta-border)] animate-pulse'>
    <Skeleton class='w-9 h-9 shrink-0' />
    <div class='flex-1 flex flex-col gap-2'>
      <div class='flex justify-between'>
        <Skeleton class='w-28 h-3' />
        <Skeleton class='w-16 h-3' />
      </div>
      <div class='flex justify-between'>
        <Skeleton class='w-20 h-2' />
        <Skeleton class='w-12 h-2' />
      </div>
    </div>
  </div>
);

export default TransactionItem;
