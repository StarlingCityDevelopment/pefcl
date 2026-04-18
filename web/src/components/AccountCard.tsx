import { type Account, AccountType } from '@typings/Account';
import { cn } from '@utils/cn';
import copy from 'copy-to-clipboard';
import { Copy, Star } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../hooks/useConfig';
import { formatMoney } from '../utils/currency';
import { Skeleton } from './ui/Base';
import { Typography } from './ui/Typography';

type AccountCardProps = {
  account: Account;
  selected?: boolean;
  withCopy?: boolean;
  isDisabled?: boolean;
};

export const AccountCard = ({ account, selected = false, withCopy = false, isDisabled = false }: AccountCardProps) => {
  const { type, balance, isDefault, accountName, number } = account;
  const { t } = useTranslation();
  const config = useConfig();

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between h-[130px] w-full p-4',
        'bg-[var(--gta-panel)] border border-[var(--gta-border)]',
        'transition-all duration-150 cursor-pointer select-none',
        'hover:border-[var(--gta-green)]/50 hover:bg-[var(--gta-surface)]',
        selected && 'border-[var(--gta-green)] bg-[var(--gta-green)]/5 shadow-[0_0_15px_var(--gta-green-glow)]',
        isDisabled && 'opacity-30 grayscale pointer-events-none',
      )}
    >
      {/* GTA accent line */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-[2px] transition-all',
          selected ? 'bg-[var(--gta-green)]' : 'bg-[var(--gta-border)] group-hover:bg-[var(--gta-green)]/40',
        )}
      />

      <div className='relative z-10 flex justify-between items-start gap-4'>
        <div className='flex flex-col gap-0.5 min-w-0'>
          <Typography variant='label' className='text-[9px] text-[var(--gta-text-dim)] group-hover:text-[var(--gta-text-muted)]'>
            {t('Balance')}
          </Typography>
          <Typography variant='h3' className='text-xl font-bold leading-none text-[var(--gta-green)]'>
            {formatMoney(balance, config.general)}
          </Typography>
        </div>
        <div className='flex flex-wrap justify-end gap-1.5 shrink-0'>
          {isDefault && (
            <div className='flex items-center gap-1 px-2 py-0.5 bg-[var(--gta-yellow)] text-black'>
              <Star className='w-2 h-2 fill-black' />
              <Typography variant='pre' className='text-[7px] font-bold tracking-[0.1em] text-black'>
                {t('DEFAULT')}
              </Typography>
            </div>
          )}
          <div className='flex items-center gap-1 px-2 py-0.5 bg-[var(--gta-surface)] border border-[var(--gta-border)]'>
            <div className={cn('w-1 h-1', type === AccountType.Shared ? 'bg-[var(--gta-cyan)]' : 'bg-[var(--gta-text-dim)]')} />
            <Typography variant='pre' className='text-[7px] text-[var(--gta-text-dim)] font-bold tracking-[0.15em]'>
              {type === AccountType.Shared ? t('SHARED') : t('PERSONAL')}
            </Typography>
          </div>
        </div>
      </div>

      <div className='relative z-10 flex justify-between items-end'>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <Typography
              variant='pre'
              className='text-[9px] text-[var(--gta-text-dim)] font-medium tracking-[0.15em] font-mono opacity-70 group-hover:opacity-100 group-hover:text-[var(--gta-text-muted)] transition-all'
            >
              {number}
            </Typography>
            {withCopy && (
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  copy(number);
                }}
                className='p-0.5 text-[var(--gta-text-dim)] hover:text-[var(--gta-green)] transition-all active:scale-90'
              >
                <Copy className='w-2.5 h-2.5' />
              </button>
            )}
          </div>
          <Typography className='text-sm font-bold text-[var(--gta-text)] tracking-wide uppercase truncate max-w-[160px]'>
            {accountName}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export const LoadingAccountCard = () => {
  return (
    <div className='flex flex-col justify-between h-[130px] w-full p-4 bg-[var(--gta-panel)] border border-[var(--gta-border)] animate-pulse'>
      <div className='space-y-3'>
        <div className='flex justify-between'>
          <Skeleton className='w-24 h-3' />
          <Skeleton className='w-16 h-4' />
        </div>
        <Skeleton className='w-[60%] h-6' />
      </div>
      <div className='flex justify-between items-end'>
        <div className='space-y-1'>
          <Skeleton className='w-32 h-3' />
          <Skeleton className='w-24 h-4' />
        </div>
      </div>
    </div>
  );
};
