import { totalBalanceAtom } from '@data/accounts';
import { useConfig } from '@hooks/useConfig';
import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { formatMoney } from '@utils/currency';
import { useAtomValue } from 'jotai';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from './ui/Typography';

const TotalBalance = () => {
  const config = useConfig();
  const { t } = useTranslation();
  const totalBalance = useAtomValue(totalBalanceAtom);
  const { isMobile } = useGlobalSettings();

  return (
    <div className='flex flex-col gap-1 group cursor-default'>
      <Typography
        variant='label'
        className='text-[10px] text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.2em]'
      >
        {isMobile ? t('Current Balance') : t('Total Balance')}
      </Typography>
      <Typography
        variant='h1'
        className='text-3xl font-bold text-[var(--gta-green)] leading-none tracking-wide'
      >
        {formatMoney(totalBalance, config.general)}
      </Typography>
    </div>
  );
};

export default TotalBalance;
