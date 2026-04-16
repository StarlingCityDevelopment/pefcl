import React from 'react';
import { AccountCard } from '@components/AccountCard';
import TotalBalance from '@components/TotalBalance';
import { Heading2, Heading5 } from '@components/ui/Typography/Headings';
import { accountsAtom } from '@data/accounts';
import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import theme from '@utils/theme';

const MobileAccountsView = () => {
  const { t } = useTranslation();
  const [accounts] = useAtom(accountsAtom);

  return (
    <Box p={3} pb={12}>
      <Stack spacing={5}>
        <Stack spacing={0.5}>
          <Heading2 sx={{ fontSize: '2rem' }}>{t('Accounts')}</Heading2>
          <TotalBalance />
        </Stack>

        <Stack spacing={2.5}>
          {accounts.map((account) => {
            return <AccountCard account={account} key={account.id} />;
          })}
        </Stack>

        {accounts.length <= 1 && (
          <Stack
            spacing={1}
            sx={{
              opacity: 0.5,
              textAlign: 'center',
              p: 4,
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '20px',
            }}
          >
            <Heading5 sx={{ fontWeight: 400, lineHeight: 1.6 }}>
              {t('You can create more accounts by visiting the nearest bank.')}
            </Heading5>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default MobileAccountsView;
