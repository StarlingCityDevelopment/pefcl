import { totalBalanceAtom } from '@data/accounts';
import { useConfig } from '@hooks/useConfig';
import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { Stack, Typography } from '@mui/material';
import { formatMoney } from '@utils/currency';
import { useAtom } from 'jotai';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heading1 } from './ui/Typography/Headings';

const TotalBalance = () => {
  const config = useConfig();
  const { t } = useTranslation();
  const [totalBalance] = useAtom(totalBalanceAtom);
  const { isMobile } = useGlobalSettings();

  return (
    <Stack spacing={0.25}>
      <Typography
        sx={{
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 600,
          color: 'text.secondary',
          fontSize: isMobile ? '0.5625rem' : '0.6875rem',
        }}
      >
        {isMobile ? t('Total Balance') : t('Net Worth')}
      </Typography>
      <Heading1
        sx={{
          fontSize: isMobile ? '2rem' : '2.5rem',
          fontWeight: 600,
          letterSpacing: '-0.03em',
          color: 'text.primary',
          lineHeight: 1.1,
        }}
      >
        {formatMoney(totalBalance, config.general)}
      </Heading1>
    </Stack>
  );
};

export default TotalBalance;
