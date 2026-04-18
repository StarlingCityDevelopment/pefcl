import { useConfig } from '@hooks/useConfig';
import { cn } from '@utils/cn';
import { formatMoney } from '@utils/currency';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from './Typography';

interface NewBalanceProps {
  amount: number;
  isValid: boolean;
  newBalanceText?: string;
}

const NewBalance = ({ amount, isValid, newBalanceText }: NewBalanceProps) => {
  const { t } = useTranslation();
  const { general } = useConfig();

  return (
    <div className='flex items-center gap-2 px-0.5 py-1'>
      <Typography className='text-[11px] font-medium text-[var(--gta-text-dim)] tracking-wide uppercase'>
        {newBalanceText ?? t('New balance')}:
      </Typography>
      <Typography
        className={cn(
          'text-[11px] font-bold tracking-wide',
          isValid ? 'text-[var(--gta-green)]' : 'text-[var(--gta-red)]',
        )}
      >
        {formatMoney(amount, general)}
      </Typography>
    </div>
  );
};

export default NewBalance;
