import React, { useState } from 'react';
import { Box, LinearProgress, Stack } from '@mui/material';
import { useAtom } from 'jotai';
import { accountsAtom, defaultAccountAtom } from '../data/accounts';
import { Heading6 } from './ui/Typography/Headings';
import AccountSelect from './AccountSelect';
import Button from './ui/Button';
import { useTranslation } from 'react-i18next';
import PriceField from './ui/Fields/PriceField';
import { transactionBaseAtom } from '@data/transactions';
import { TransactionEvents } from '@typings/Events';
import { CreateTransferInput, TransferType } from '@typings/Transaction';
import { externalAccountsAtom } from '@data/externalAccounts';
import NewBalance from './ui/NewBalance';
import { useMutation } from '@hooks/useMutation';

const TransferFunds: React.FC<{ onClose?(): void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [accounts, updateAccounts] = useAtom(accountsAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);
  const [defaultAccount] = useAtom(defaultAccountAtom);
  const [externalAccounts] = useAtom(externalAccountsAtom);
  const [fromAccountId, setFromAccountId] = useState(defaultAccount?.id ?? 0);
  const [toAccountId, setToAccountId] = useState(0);
  const [isToExternal, setIsToExternal] = useState(false);

  const { mutate: mutateTransfer, isLoading: isTransfering } = useMutation(
    TransactionEvents.CreateTransfer,
    {
      successMessage: t('Successfully transferred funds'),
      onSuccess: async () => {
        await updateAccounts();
        await updateTransactions();
        onClose?.();
        setAmount('');
      },
    },
  );

  const parsedAmount = Number(amount.replace(/\D/g, ''));
  const fromAccount = accounts.find((account) => account.id === fromAccountId);

  const message = isToExternal ? t('External transfer') : t('Internal transfer');
  const type = isToExternal ? TransferType.External : TransferType.Internal;

  const handleTransfer = () => {
    const payload: CreateTransferInput = {
      type,
      message,
      amount: parsedAmount,
      fromAccountId,
      toAccountId,
    };
    mutateTransfer(payload);
  };

  const handleToSelect = (id: number, isExternal?: boolean) => {
    setToAccountId(id);
    setIsToExternal(isExternal ?? false);
  };

  const isAmountTooHigh = fromAccount && fromAccount.balance < parsedAmount;
  const isAmountTooLow = parsedAmount <= 0;
  const isToAccountSelected = toAccountId > 0;
  const isSameAccount = !isToExternal && toAccountId === fromAccountId;
  const isDisabled =
    isSameAccount || !parsedAmount || !isToAccountSelected || isAmountTooHigh || isAmountTooLow;

  const rawValue = parseInt(amount.replace(/\D/g, ''));
  const value = isNaN(rawValue) ? 0 : rawValue;
  const newBalance = (fromAccount?.balance ?? 0) - value;
  const isValidNewBalance = newBalance >= 0;

  return (
    <>
      <Box pt={2} display="flex" flexDirection="column">
        <Stack spacing={3}>
          <Stack direction="row" spacing={3}>
            <Stack flex={1} spacing={0.75}>
              <Heading6
                sx={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                }}
              >
                {t('From account')}
              </Heading6>
              <AccountSelect
                isFromAccount
                onSelect={(id) => setFromAccountId(id)}
                accounts={accounts}
                selectedId={fromAccountId}
              />
            </Stack>

            <Stack flex={1} spacing={0.75}>
              <Heading6
                sx={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                }}
              >
                {t('To account')}
              </Heading6>
              <AccountSelect
                onSelect={handleToSelect}
                accounts={accounts}
                excludeId={fromAccountId}
                selectedId={toAccountId}
                isExternalSelected={isToExternal}
                externalAccounts={externalAccounts}
              />
            </Stack>
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

          {/* useMutation handles error reporting via snackbar */}

          <Stack alignSelf="flex-end" direction="row" spacing={2}>
            <Button disabled={isDisabled} onClick={handleTransfer}>
              {t('Transfer funds')}
            </Button>
          </Stack>
        </Stack>
      </Box>
      {isTransfering && <LinearProgress />}
    </>
  );
};

export default TransferFunds;
