import { useConfig } from '@hooks/useConfig';
import { type Transaction, TransactionType } from '@typings/Transaction';
import { Skeleton } from '@ui/Base';
import { Typography } from '@ui/Typography';
import { cn } from '@utils/cn';
import { formatMoney } from '@utils/currency';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';

dayjs.extend(calendar);
dayjs.extend(relativeTime);

interface TransactionItemProps {
  transaction: Transaction;
  isLimitedSpace?: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, isLimitedSpace }) => {
  const { t } = useTranslation();
  const { message, amount, createdAt, toAccount, fromAccount, type } = transaction;
  const config = useConfig();
  const createdAtDate = dayjs(createdAt);

  const isIncoming = type === TransactionType.Incoming;

  return (
    <div
      className={cn(
        'group flex items-center gap-3 p-4 transition-all duration-150',
        'bg-[var(--gta-panel)] border border-[var(--gta-border)]',
        'hover:border-[var(--gta-border-light)] hover:bg-[var(--gta-surface)]',
        'relative overflow-hidden cursor-default',
      )}
    >
      {/* Left accent */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-[2px]',
          isIncoming ? 'bg-[var(--gta-green)]' : 'bg-[var(--gta-red)]/50',
        )}
      />

      <div
        className={cn(
          'flex items-center justify-center w-9 h-9 border transition-all duration-150',
          isIncoming
            ? 'bg-[var(--gta-green)]/10 text-[var(--gta-green)] border-[var(--gta-green)]/30'
            : 'bg-[var(--gta-surface)] text-[var(--gta-text-dim)] border-[var(--gta-border)]',
        )}
      >
        {isIncoming ? <ArrowUpRight className='w-4 h-4' /> : <ArrowDownLeft className='w-4 h-4' />}
      </div>

      <div className='flex-1 flex flex-col min-w-0'>
        <div className='flex justify-between items-start gap-3'>
          <div className='flex flex-col min-w-0'>
            <Typography className='font-bold text-xs text-[var(--gta-text)] truncate uppercase leading-none mb-1'>
              {message}
            </Typography>
            <div className='flex items-center gap-2'>
              <Typography variant='pre' className='text-[9px] text-[var(--gta-text-dim)]'>
                {createdAtDate.fromNow()}
              </Typography>
              {!isLimitedSpace && (
                <>
                  <div className='w-0.5 h-0.5 bg-[var(--gta-border)]' />
                  <Typography variant='pre' className='text-[9px] text-[var(--gta-text-dim)]'>
                    {createdAtDate.format('HH:mm')}
                  </Typography>
                </>
              )}
            </div>
          </div>
          <div className='flex flex-col items-end shrink-0'>
            <Typography
              className={cn(
                'font-bold text-sm leading-none mb-1 transition-all duration-150',
                isIncoming ? 'text-[var(--gta-green)]' : 'text-[var(--gta-text-muted)]',
              )}
            >
              {isIncoming ? '+' : '-'} {formatMoney(amount, config.general)}
            </Typography>
            {!isLimitedSpace && (fromAccount || toAccount) && (
              <Typography
                variant='label'
                className='text-[8px] text-[var(--gta-text-dim)]'
              >
                {isIncoming ? fromAccount?.accountName || t('External') : toAccount?.accountName || t('External')}
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TransactionSkeleton = () => (
  <div className='flex items-center gap-3 p-4 bg-[var(--gta-panel)] border border-[var(--gta-border)] animate-pulse'>
    <Skeleton className='w-9 h-9 shrink-0' />
    <div className='flex-1 flex flex-col gap-2'>
      <div className='flex justify-between'>
        <Skeleton className='w-28 h-3' />
        <Skeleton className='w-16 h-3' />
      </div>
      <div className='flex justify-between'>
        <Skeleton className='w-20 h-2' />
        <Skeleton className='w-12 h-2' />
      </div>
    </div>
  </div>
);

export default TransactionItem;
