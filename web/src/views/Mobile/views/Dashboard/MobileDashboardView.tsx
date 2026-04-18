import { AccountCard } from '@components/AccountCard';
import InvoiceItem from '@components/InvoiceItem';
import TotalBalance from '@components/TotalBalance';
import TransactionItem from '@components/TransactionItem';
import { Heading2, Heading4, Heading5 } from '@components/ui/Typography/Headings';
import { unpaidInvoicesAtom } from '@data/invoices';
import { useFetchNui } from '@hooks/useFetchNui';
import { Divider, Stack } from '@mui/material';
import { Box } from '@mui/system';
import type { Account } from '@typings/Account';
import { AccountEvents, TransactionEvents } from '@typings/Events';
import type { Transaction } from '@typings/Transaction';
import { fetchNui } from '@utils/fetchNui';
import theme from '@utils/theme';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SectionHeader = ({ title }: { title: string }) => (
  <Heading4
    sx={{
      color: theme.palette.primary.main,
      fontWeight: 600,
      textTransform: 'uppercase',
      fontSize: '0.75rem',
      letterSpacing: '0.08em',
      opacity: 0.9,
      mb: 1,
    }}
  >
    {title}
  </Heading4>
);

const MobileDashboardView = () => {
  const { t } = useTranslation();
  const [defaultAccount, setDefaultAccount] = useState<Account>();

  const [invoices] = useAtom(unpaidInvoicesAtom);

  useEffect(() => {
    fetchNui<Account[]>(AccountEvents.GetAccounts).then((accounts) => {
      const defaultAccount = accounts?.find((account) => account.isDefault);
      setDefaultAccount(defaultAccount);
    });
  }, []);

  const options = {
    offset: 0,
    limit: 5,
  };
  const { data } = useFetchNui<{ total: number; transactions: Transaction[] }>(TransactionEvents.Get, options);

  return (
    <Box p={3} pb={12}>
      <Stack spacing={5}>
        <Stack spacing={0.5}>
          <Heading2 sx={{ fontSize: '2rem' }}>{t('Dashboard')}</Heading2>
          <TotalBalance />
        </Stack>

        <Stack spacing={2}>
          <SectionHeader title={t('Default account')} />
          {defaultAccount && <AccountCard account={defaultAccount} />}
        </Stack>

        <Stack spacing={2}>
          <SectionHeader title={t('Latest transactions')} />
          <Stack
            spacing={1}
            sx={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '20px',
              p: 2,
              border: '1px solid rgba(255, 255, 255, 0.04)',
            }}
          >
            {data?.transactions?.map((transaction, index) => (
              <React.Fragment key={transaction.id}>
                <TransactionItem transaction={transaction} isLimitedSpace />
                {index < (data?.transactions?.length || 0) - 1 && <Divider sx={{ opacity: 0.05, my: 1 }} />}
              </React.Fragment>
            ))}
            {(!data?.transactions || data.transactions.length === 0) && (
              <Heading5 sx={{ opacity: 0.4, textAlign: 'center', py: 2 }}>{t('No recent transactions')}</Heading5>
            )}
          </Stack>
        </Stack>

        <Stack spacing={2}>
          <SectionHeader title={t('Unpaid invoices')} />
          <Stack spacing={1.5} overflow='hidden'>
            {invoices.map((invoice) => (
              <InvoiceItem key={invoice.id} invoice={invoice} />
            ))}

            {invoices.length <= 0 && (
              <Heading5 sx={{ opacity: 0.4, textAlign: 'center', py: 2 }}>{t('All caught up!')}</Heading5>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default MobileDashboardView;
