import { useConfig } from '@hooks/useConfig';
import type { GetTransactionHistoryResponse } from '@typings/Transaction';
import { cn } from '@utils/cn';
import { formatMoney } from '@utils/currency';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from './ui/Typography';

interface ColumnProps {
  date: Date;
  income: number;
  expenses: number;
  maxHeight: number;
}

const Column = ({ date, income, expenses, maxHeight }: ColumnProps) => {
  const { t } = useTranslation();
  const config = useConfig();
  const [isHovered, setIsHovered] = useState(false);

  const incomeHeight = (income / (maxHeight || 1)) * 100;
  const expenseHeight = (Math.abs(expenses) / (maxHeight || 1)) * 100;

  return (
    <div
      className='relative flex flex-col items-center group cursor-default'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className='absolute bottom-full mb-2 z-50 p-3 bg-[var(--gta-dark)] border border-[var(--gta-green)]/30 shadow-[0_8px_24px_rgba(0,0,0,0.6)] min-w-[120px]'
          >
            <div className='flex flex-col gap-2'>
              <div className='flex flex-col gap-0.5'>
                <Typography variant='pre' className='text-[var(--gta-text-dim)] text-[8px]'>
                  {t('Income')}
                </Typography>
                <Typography className='text-xs font-bold text-[var(--gta-green)]'>
                  {formatMoney(income, config.general)}
                </Typography>
              </div>
              <div className='h-[1px] w-full bg-[var(--gta-border)]' />
              <div className='flex flex-col gap-0.5'>
                <Typography variant='pre' className='text-[var(--gta-text-dim)] text-[8px]'>
                  {t('Expense')}
                </Typography>
                <Typography className='text-xs font-bold text-[var(--gta-red)]'>
                  {formatMoney(expenses, config.general)}
                </Typography>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='flex items-end gap-[2px] h-28 mb-2'>
        <div
          className={cn(
            'w-2 transition-all duration-300',
            'bg-[var(--gta-red)]/30 group-hover:bg-[var(--gta-red)]/60',
          )}
          style={{ height: `${Math.max(4, expenseHeight)}%` }}
        />
        <div
          className={cn(
            'w-2 transition-all duration-300',
            'bg-[var(--gta-green)]/40 group-hover:bg-[var(--gta-green)]',
          )}
          style={{ height: `${Math.max(4, incomeHeight)}%` }}
        />
      </div>

      <Typography
        variant='pre'
        className='text-[9px] font-bold text-[var(--gta-text-dim)] group-hover:text-[var(--gta-green)] transition-colors'
      >
        {date.getDate()}
      </Typography>
    </div>
  );
};

interface WeekGraphProps {
  data: GetTransactionHistoryResponse['lastWeek'];
  className?: string;
}

const WeekGraph = ({ data, className }: WeekGraphProps) => {
  const values = Object.values(data);
  const incomeMax = Math.max(...values.map((v) => v.income), 0);
  const expenseMax = Math.max(...values.map((v) => Math.abs(v.expenses)), 0);
  const maxHeight = Math.max(incomeMax, expenseMax);

  return (
    <div className={cn('flex flex-row items-end justify-between w-full h-full pt-8 px-2', className)}>
      {Object.entries(data).map(([key, value]) => (
        <Column key={key} {...value} maxHeight={maxHeight} date={new Date(key)} />
      ))}
    </div>
  );
};

export default WeekGraph;
