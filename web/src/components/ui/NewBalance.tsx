import { useConfig } from '@hooks/useConfig';
import { Stack, Typography } from '@mui/material';
import { formatMoney } from '@utils/currency';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface NewBalanceProps {
  amount: number;
  isValid: boolean;
  newBalanceText?: string;
}

const NewBalance = ({ amount, isValid, newBalanceText }: NewBalanceProps) => {
  const { t } = useTranslation();
  const { general } = useConfig();

  return (
    <Stack direction='row' spacing={0.5} alignItems='center'>
      <Typography variant='caption' sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
        {newBalanceText ?? t('New balance')}:
      </Typography>
      <Typography
        variant='caption'
        sx={{
          color: isValid ? 'primary.main' : 'error.main',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}
      >
        {formatMoney(amount, general)}
      </Typography>
    </Stack>
  );
};

export default NewBalance;
