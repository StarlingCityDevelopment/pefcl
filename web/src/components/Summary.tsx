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
      <Typography className={cn('text-xs font-medium uppercase tracking-wide', isTotal ? 'text-[var(--gta-text-muted)]' : 'text-[var(--gta-text-dim)]')}>
        {label}
      </Typography>
      <Typography
        className={cn(
          'text-sm font-bold',
          isTotal ? 'text-[var(--gta-green)]' : 'text-[var(--gta-text)]',
        )}
      >
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
    <div className='flex flex-col gap-1 p-4 bg-[var(--gta-panel)] border border-[var(--gta-border)]'>
      <Typography variant='pre' className='text-[10px] text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] mb-2'>
        {t('Financial Summary')}
      </Typography>

      <div className='flex flex-col divide-y divide-[var(--gta-border)]'>
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
