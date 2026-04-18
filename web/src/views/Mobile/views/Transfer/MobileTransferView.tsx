import AccountSelect from '@components/AccountSelect';
import Button from '@components/ui/Button';
import PriceField from '@components/ui/Fields/PriceField';
import NewBalance from '@components/ui/NewBalance';
import { Typography } from '@components/ui/Typography';
import { accountsAtom } from '@data/accounts';
import { externalAccountsAtom } from '@data/externalAccounts';
import { transactionBaseAtom } from '@data/transactions';
import { useConfig } from '@hooks/useConfig';
import { GenericErrors } from '@typings/Errors';
import { TransactionEvents } from '@typings/Events';
import { type CreateTransferInput, TransferType } from '@typings/Transaction';
import { cn } from '@utils/cn';
import { formatMoney } from '@utils/currency';
import { fetchNui } from '@utils/fetchNui';
import { useAtom } from 'jotai';
import { AlertCircle, Info } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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

  const rawValue = Number.parseInt(amount.replace(/\D/g, ''));
  const value = isNaN(rawValue) ? 0 : rawValue;
  const newBalance = (selectedFromAccount?.balance ?? 0) - value;
  const isValidNewBalance = newBalance >= 0;
  const isValidTransaction = Boolean(amount) && value > 0 && selectedFromAccountId > 0 && selectedToAccountId > 0;
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
      setSuccess(t('Successfully transferred {{amount}}.', { amount: formatMoney(value, general) }));
      setIsLoading(false);
      updateAccounts();
      updateExternalAccounts();
      updateTransactions();
      setAmount('');
    } catch (error: unknown) {
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
    <div className='p-6 pb-24 flex flex-col gap-10'>
      <div className='flex flex-col gap-1'>
        <Typography variant='h2' className='text-[2rem] leading-none mb-2 italic uppercase'>
          {t('Transfer funds')}
        </Typography>
        <Typography className='text-white/40 font-medium'>
          {t('Transfer between internal & external accounts.')}
        </Typography>
      </div>

      <div className='flex flex-col gap-10'>
        <div className='flex flex-col gap-4'>
          <Typography variant='pre' className='text-primary font-black ml-1'>
            {t('From account')}
          </Typography>
          <AccountSelect
            isFromAccount
            accounts={accounts}
            onSelect={handleFromSelect}
            selectedId={selectedFromAccountId}
          />
        </div>

        <div className='flex flex-col gap-4'>
          <Typography variant='pre' className='text-primary font-black ml-1'>
            {t('To account')}
          </Typography>
          <AccountSelect
            accounts={accounts}
            externalAccounts={externalAccounts}
            onSelect={handleToSelect}
            selectedId={selectedToAccountId}
            isExternalSelected={isToExternal}
          />
        </div>

        <div className='flex flex-col gap-4'>
          <Typography variant='pre' className='text-primary font-black ml-1'>
            {t('Value Specification')}
          </Typography>
          <PriceField value={amount} onChange={handleAmountChange} />
          <NewBalance amount={newBalance} isValid={isValidNewBalance} />
        </div>

        <div className='pt-4'>
          <Button className='w-full h-16 text-lg' onClick={handleTransfer} disabled={isButtonDisabled}>
            {t('Authorize Transfer')}
          </Button>
        </div>

        {success && (
          <div className='p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-4 text-blue-400'>
            <Info className='w-5 h-5 shrink-0' />
            <Typography className='text-blue-400 leading-tight'>{success}</Typography>
          </div>
        )}

        {error && (
          <div className='p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-500'>
            <AlertCircle className='w-5 h-5 shrink-0' />
            <Typography className='text-red-500 leading-tight font-medium'>{error}</Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileTransferView;
