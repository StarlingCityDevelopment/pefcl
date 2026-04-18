import { cn } from '@utils/cn';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../hooks/useConfig';
import { formatMoney } from '../utils/currency';
import { Typography } from './ui/Typography';

interface SummaryRowProps {
  label: string;
  amount: number;
  isTotal?: boolean;
}

const SummaryRow: React.FC<SummaryRowProps> = ({ label, amount, isTotal }) => {
  const config = useConfig();
  return (
    <div className='flex justify-between items-center py-2'>
      <Typography className={cn('text-xs font-medium', isTotal ? 'text-slate-400' : 'text-slate-500')}>
        {label}
      </Typography>
      <Typography className={cn('text-sm tracking-tight', isTotal ? 'text-white font-black' : 'text-white font-bold')}>
        {formatMoney(amount, config.general)}
      </Typography>
    </div>
  );
};

interface SummaryProps {
  balance: number;
  payment: number;
}

const Summary: React.FC<SummaryProps> = ({ balance, payment }) => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col gap-1 p-5 rounded-3xl bg-white/[0.02] border border-white/5'>
      <Typography variant='pre' className='text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2'>
        {t('Financial Summary')}
      </Typography>

      <div className='flex flex-col divide-y divide-white/[0.03]'>
        <SummaryRow label={t('Current Balance')} amount={balance} />
        <SummaryRow label={t('Initial Payment')} amount={-payment} />
        <div className='pt-2'>
          <SummaryRow label={t('New balance')} amount={balance - payment} isTotal />
        </div>
      </div>
    </div>
  );
};

export default Summary;
