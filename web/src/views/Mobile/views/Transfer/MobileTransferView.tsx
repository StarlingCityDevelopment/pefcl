import AccountSelect from '@components/AccountSelect';
import Button from '@components/ui/Button';
import PriceField from '@components/ui/Fields/PriceField';
import NewBalance from '@components/ui/NewBalance';
import { Heading2, Heading5 } from '@components/ui/Typography/Headings';
import { accountsAtom } from '@data/accounts';
import { externalAccountsAtom } from '@data/externalAccounts';
import { transactionBaseAtom } from '@data/transactions';
import { useConfig } from '@hooks/useConfig';
import { Alert, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { GenericErrors } from '@typings/Errors';
import { TransactionEvents } from '@typings/Events';
import { CreateTransferInput, TransferType } from '@typings/Transaction';
import { formatMoney } from '@utils/currency';
import { fetchNui } from '@utils/fetchNui';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import theme from '@utils/theme';

const MobileTransferView = () => {
  const { t } = useTranslation();
  const { general } = useConfig();

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedFromAccountId, setSelectedFromAccountId] = useState<number>(0);
  const [selectedToAccountId, setSelectedToAccountId] = useState<number>(0);
  const [isToExternal, setIsToExternal] = useState(false);
  const [accounts, updateAccounts] = useAtom(accountsAtom);
  const [externalAccounts, updateExternalAccounts] = useAtom(externalAccountsAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);

  const selectedFromAccount = accounts.find((account) => account.id === selectedFromAccountId);

  const rawValue = parseInt(amount.replace(/\D/g, ''));
  const value = isNaN(rawValue) ? 0 : rawValue;
  const newBalance = (selectedFromAccount?.balance ?? 0) - value;
  const isValidNewBalance = newBalance >= 0;
  const isValidTransaction =
    Boolean(amount) && value > 0 && selectedFromAccountId > 0 && selectedToAccountId > 0;
  const isSameAccount = !isToExternal && selectedFromAccountId === selectedToAccountId;
  const isButtonDisabled = !isValidNewBalance || !isValidTransaction || isSameAccount || isLoading;

  const message = isToExternal ? t('External transfer') : t('Internal transfer');
  const type = isToExternal ? TransferType.External : TransferType.Internal;

  const handleToSelect = (id: number, isExternal?: boolean) => {
    setSuccess('');
    setError('');
    setSelectedToAccountId(id);
    setIsToExternal(isExternal ?? false);
  };

  const handleFromSelect = (id: number) => {
    setSuccess('');
    setError('');
    setSelectedFromAccountId(id);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSuccess('');
    setError('');
    setAmount(event.target.value);
  };

  const handleTransfer = async () => {
    if (!selectedFromAccountId || !selectedToAccountId) {
      return;
    }

    setIsLoading(true);
    const transfer: CreateTransferInput = {
      amount: value,
      fromAccountId: selectedFromAccountId,
      toAccountId: selectedToAccountId,
      message,
      type,
    };

    try {
      await fetchNui(TransactionEvents.CreateTransfer, transfer);
      setSuccess(
        t('Successfully transferred {{amount}}.', { amount: formatMoney(value, general) }),
      );
      setIsLoading(false);
      updateAccounts();
      updateExternalAccounts();
      updateTransactions();
      setAmount('');
    } catch (error: Error | unknown) {
      if (error instanceof Error && error.message === GenericErrors.NotFound) {
        setError(t('No account found to receive transfer.'));
      } else {
        setError(t('Something went wrong, please try again later.'));
      }
      setIsLoading(false);
      updateAccounts();
      updateExternalAccounts();
      updateTransactions();
    }
  };

  return (
    <Box p={3} pb={12}>
      <Stack spacing={4}>
        <Stack spacing={0.5}>
          <Heading2 sx={{ fontSize: '2rem' }}>{t('Transfer funds')}</Heading2>
          <Heading5 sx={{ opacity: 0.6, fontWeight: 400 }}>
            {t('Transfer between internal & external accounts.')}
          </Heading5>
        </Stack>

        <Stack spacing={4}>
          <Stack spacing={1.5}>
            <Heading5
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
              }}
            >
              {t('From account')}
            </Heading5>
            <AccountSelect
              isFromAccount
              accounts={accounts}
              onSelect={handleFromSelect}
              selectedId={selectedFromAccountId}
            />
          </Stack>

          <Stack spacing={1.5}>
            <Heading5
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
              }}
            >
              {t('To account')}
            </Heading5>
            <AccountSelect
              accounts={accounts}
              externalAccounts={externalAccounts}
              onSelect={handleToSelect}
              selectedId={selectedToAccountId}
              isExternalSelected={isToExternal}
            />
          </Stack>

          <Stack spacing={1.5}>
            <Heading5
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
              }}
            >
              {t('Amount')}
            </Heading5>
            <PriceField value={amount} onChange={handleAmountChange} />
            <NewBalance amount={newBalance} isValid={isValidNewBalance} />
          </Stack>

          <Box pt={2}>
            <Button size="large" fullWidth onClick={handleTransfer} disabled={isButtonDisabled}>
              {t('Transfer funds')}
            </Button>
          </Box>

          {success && (
            <Alert
              color="info"
              variant="filled"
              sx={{
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              {success}
            </Alert>
          )}
          {error && (
            <Alert
              color="error"
              variant="filled"
              sx={{
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              {error}
            </Alert>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default MobileTransferView;
