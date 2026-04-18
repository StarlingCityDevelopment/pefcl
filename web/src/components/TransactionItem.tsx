import { useConfig } from '@hooks/useConfig';
import { type Transaction, TransactionType } from '@typings/Transaction';
import { Skeleton } from '@ui/Base';
import { Typography } from '@ui/Typography';
import { cn } from '@utils/cn';
import { formatMoney } from '@utils/currency';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight } from 'lucide-react';
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
        'group flex items-center gap-4 p-5 rounded-[2rem] transition-all duration-300',
        'bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 hover: hover:/60',
        'relative overflow-hidden cursor-default',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-12 h-12 rounded-2xl border transition-all duration-500',
          isIncoming
            ? 'bg-white text-black border-white -[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-110'
            : 'bg-white/[0.03] text-slate-500 border-white/10 group-hover:text-white group-hover:border-white/30',
        )}
      >
        {isIncoming ? <ArrowUpRight className='w-5 h-5' /> : <ArrowDownLeft className='w-5 h-5' />}
      </div>

      <div className='flex-1 flex flex-col min-w-0'>
        <div className='flex justify-between items-start gap-4'>
          <div className='flex flex-col min-w-0'>
            <Typography className='font-black text-sm text-white truncate tracking-tight uppercase italic leading-none mb-1'>
              {message}
            </Typography>
            <div className='flex items-center gap-2'>
              <Typography variant='pre' className='text-[9px] text-slate-500 font-black'>
                {createdAtDate.fromNow()}
              </Typography>
              {!isLimitedSpace && (
                <>
                  <div className='w-0.5 h-0.5 rounded-full bg-slate-800' />
                  <Typography variant='pre' className='text-[9px] text-slate-600 font-black'>
                    {createdAtDate.format('HH:mm')}
                  </Typography>
                </>
              )}
            </div>
          </div>
          <div className='flex flex-col items-end shrink-0'>
            <Typography
              className={cn(
                'font-black text-base tracking-tighter leading-none mb-1 transition-all duration-300',
                isIncoming ? 'text-white' : 'text-slate-400 group-hover:text-white',
              )}
            >
              {isIncoming ? '+' : '-'} {formatMoney(amount, config.general)}
            </Typography>
            {!isLimitedSpace && (fromAccount || toAccount) && (
              <Typography
                variant='label'
                className='text-[8px] text-slate-600 group-hover:text-slate-500 transition-colors'
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
  <div className='flex items-center gap-4 p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 animate-pulse'>
    <Skeleton className='w-12 h-12 rounded-2xl shrink-0' />
    <div className='flex-1 flex flex-col gap-3'>
      <div className='flex justify-between'>
        <Skeleton className='w-32 h-4 rounded-sm' />
        <Skeleton className='w-20 h-4 rounded-sm' />
      </div>
      <div className='flex justify-between'>
        <Skeleton className='w-24 h-3 rounded-sm' />
        <Skeleton className='w-16 h-3 rounded-sm' />
      </div>
    </div>
  </div>
);

export default TransactionItem;
