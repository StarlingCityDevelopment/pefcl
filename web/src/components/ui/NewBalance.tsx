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
    <div className='flex items-center gap-1.5 px-1 py-1'>
      <Typography className='text-[11px] font-medium text-slate-500 tracking-tight'>
        {newBalanceText ?? t('New balance')}:
      </Typography>
      <Typography
        className={cn('text-[11px] font-black tracking-tight', isValid ? 'text-white opacity-80' : 'text-red-400')}
      >
        {formatMoney(amount, general)}
      </Typography>
    </div>
  );
};

export default NewBalance;
