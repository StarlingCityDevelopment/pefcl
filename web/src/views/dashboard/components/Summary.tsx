import WeekGraph from '@components/WeekGraph';
import { useConfig } from '@hooks/useConfig';
import { TransactionEvents } from '@typings/Events';
import type { GetTransactionHistoryResponse } from '@typings/Transaction';
import { Typography } from '@ui/Typography';
import { cn } from '@utils/cn';
import { formatMoney } from '@utils/currency';
import { fetchNui } from '@utils/fetchNui';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DashboardSummary = () => {
  const { t } = useTranslation();
  const config = useConfig();
  const [data, setData] = useState<GetTransactionHistoryResponse | undefined>();

  useEffect(() => {
    fetchNui<GetTransactionHistoryResponse>(TransactionEvents.GetHistory).then(setData);
  }, []);

  return (
    <div className='flex flex-col gap-4 p-5 bg-[var(--gta-panel)] border border-[var(--gta-border)] h-full'>
      <div className='flex flex-col gap-1 pb-3 border-b border-[var(--gta-border)]'>
        <Typography variant='pre' className='text-[var(--gta-text-dim)]'>
          {t('Weekly summary')}
        </Typography>
        <Typography variant='h3' className='text-[var(--gta-text)] font-bold tracking-[0.15em] text-base'>
          {t('Performance')}
        </Typography>
      </div>

      <div className='flex flex-row gap-3'>
        <div className='flex-1 p-4 bg-[var(--gta-surface)] border border-[var(--gta-border)] transition-all hover:border-[var(--gta-green)]/30 group cursor-default relative'>
          <div className='absolute top-0 left-0 right-0 h-[2px] bg-[var(--gta-green)]' />
          <Typography variant='label' className='mb-2 block text-[var(--gta-text-dim)]'>
            {t('Total Income')}
          </Typography>
          <Typography className='text-xl font-bold text-[var(--gta-green)] leading-none'>
            {formatMoney(data?.income ?? 0, config.general)}
          </Typography>
        </div>

        <div className='flex-1 p-4 bg-[var(--gta-surface)] border border-[var(--gta-border)] transition-all hover:border-[var(--gta-red)]/30 group cursor-default relative'>
          <div className='absolute top-0 left-0 right-0 h-[2px] bg-[var(--gta-red)]/50' />
          <Typography variant='label' className='mb-2 block text-[var(--gta-text-dim)]'>
            {t('Total Expenses')}
          </Typography>
          <Typography className='text-xl font-bold text-[var(--gta-red)] leading-none'>
            {formatMoney(data?.expenses ?? 0, config.general)}
          </Typography>
        </div>
      </div>

      <div className='flex-1 flex flex-col gap-3 mt-1'>
        <div className='flex items-center justify-between'>
          <Typography variant='pre' className='text-[var(--gta-text-dim)]'>
            {t('Activity Feed')}
          </Typography>
          <div className='flex gap-3'>
            <div className='flex items-center gap-1.5'>
              <div className='w-2 h-2 bg-[var(--gta-green)]' />
              <Typography variant='pre' className='text-[8px] text-[var(--gta-text-dim)]'>
                {t('Income')}
              </Typography>
            </div>
            <div className='flex items-center gap-1.5'>
              <div className='w-2 h-2 bg-[var(--gta-red)]/50' />
              <Typography variant='pre' className='text-[8px] text-[var(--gta-text-dim)]'>
                {t('Expense')}
              </Typography>
            </div>
          </div>
        </div>

        <div className='flex-1 min-h-[140px] relative'>
          <WeekGraph data={data?.lastWeek ?? {}} />
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
