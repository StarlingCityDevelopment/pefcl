import AccountSelect from '@components/AccountSelect';
import Layout from '@components/Layout';
import Button from '@components/ui/Button';
import PriceField from '@components/ui/Fields/PriceField';
import NewBalance from '@components/ui/NewBalance';
import { Heading2, Heading6 } from '@components/ui/Typography/Headings';
import { accountsAtom } from '@data/accounts';
import { transactionBaseAtom } from '@data/transactions';
import { useConfig } from '@hooks/useConfig';
import { LinearProgress, Stack, Typography } from '@mui/material';
import { ATMInput } from '@typings/Account';
import { AccountEvents } from '@typings/Events';
import { formatMoney } from '@utils/currency';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@hooks/useMutation';
import { cashAtom } from '@data/cash';

const Withdraw = () => {
  const { t } = useTranslation();
  const [currentCash, updateCash] = useAtom(cashAtom);
  const [amount, setAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<number>(0);
  const [, updateAccounts] = useAtom(accountsAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);
  const [accounts] = useAtom(accountsAtom);
  const { general } = useConfig();
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);
  const rawValue = parseInt(amount.replace(/\D/g, ''));
  const value = isNaN(rawValue) ? 0 : rawValue;
  const newBalance = (selectedAccount?.balance ?? 0) - value;
  const isValidNewBalance = newBalance >= 0;
  const isValidTransaction = Boolean(amount) && value > 0 && selectedAccountId > 0;

  const { mutate: mutateWithdraw, isLoading } = useMutation(AccountEvents.WithdrawMoney, {
    successMessage: t('Successfully withdrew {{amount}}.', {
      amount: formatMoney(value, general),
    }),
    onSuccess: async () => {
      setAmount('');
      updateCash();
      await Promise.all([updateAccounts(), updateTransactions()]);
    },
  });

  const isButtonDisabled = !isValidNewBalance || !isValidTransaction || isLoading;

  useEffect(() => {
    updateCash();
  }, []);

  const handleWithdrawal = () => {
    if (!selectedAccountId) return;

    const payload: ATMInput = {
      amount: value,
      message: t('Withdrew {{amount}} from account.', { amount: formatMoney(value, general) }),
      accountId: selectedAccountId,
    };
    mutateWithdraw(payload);
  };

  return (
    <Layout title={t('Withdraw')}>
      <Stack spacing={1} marginTop={1}>
        <Heading6
          sx={{
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontSize: '0.6875rem',
            fontWeight: 600,
          }}
        >
          {t('Current cash')}
        </Heading6>
        <Typography sx={{ fontWeight: 600, fontSize: '1.125rem', letterSpacing: '-0.01em' }}>
          {formatMoney(currentCash, general)}
        </Typography>
      </Stack>

      <Stack spacing={2.5} marginTop={3} maxWidth="24rem">
        <Stack spacing={0.75}>
          <Heading6
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontSize: '0.6875rem',
              fontWeight: 600,
            }}
          >
            {t('Select account')}
          </Heading6>
          <AccountSelect
            isFromAccount
            accounts={accounts}
            onSelect={setSelectedAccountId}
            selectedId={selectedAccountId}
          />
        </Stack>

        <Stack spacing={0.75}>
          <Heading6
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontSize: '0.6875rem',
              fontWeight: 600,
            }}
          >
            {t('Amount')}
          </Heading6>
          <PriceField
            placeholder={t('Amount')}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
          <NewBalance amount={newBalance} isValid={isValidNewBalance} />
        </Stack>

        <Button size="large" disabled={isButtonDisabled} onClick={handleWithdrawal}>
          {t('Withdraw')}
        </Button>

        {/* useMutation handles error reporting via snackbar */}
        {isLoading && <LinearProgress />}
      </Stack>
    </Layout>
  );
};

export default Withdraw;
