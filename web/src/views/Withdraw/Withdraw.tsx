import AccountSelect from '@components/AccountSelect';
import Layout from '@components/Layout';
import Button from '@components/ui/Button';
import PriceField from '@components/ui/Fields/PriceField';
import NewBalance from '@components/ui/NewBalance';
import { Typography } from '@components/ui/Typography';
import { accountsAtom } from '@data/accounts';
import { cashAtom } from '@data/cash';
import { transactionBaseAtom } from '@data/transactions';
import { useConfig } from '@hooks/useConfig';
import { useMutation } from '@hooks/useMutation';
import type { ATMInput } from '@typings/Account';
import { AccountEvents } from '@typings/Events';
import { formatMoney } from '@utils/currency';
import { useAtom, useAtomValue } from 'jotai';
import { Loader2, Wallet } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Withdraw = () => {
  const { t } = useTranslation();
  const [currentCash, updateCash] = useAtom(cashAtom);
  const [amount, setAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<number>(0);
  const [, updateAccounts] = useAtom(accountsAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);
  const accounts = useAtomValue(accountsAtom);
  const { general } = useConfig();
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);

  const rawValue = Number.parseInt(amount.replace(/\D/g, ''));
  const value = isNaN(rawValue) ? 0 : rawValue;
  const newAccountBalance = (selectedAccount?.balance ?? 0) - value;
  const isValidNewBalance = newAccountBalance >= 0;
  const isValidTransaction = Boolean(amount) && value > 0 && selectedAccountId > 0;

  const { mutate: mutateWithdraw, isLoading } = useMutation(AccountEvents.WithdrawMoney, {
    onSuccess: async () => {
      setAmount('');
      updateCash();
      await Promise.all([updateAccounts(), updateTransactions()]);
    },
  });

  const isButtonDisabled = !isValidNewBalance || !isValidTransaction || isLoading;

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
    <Layout title={t('Cash Withdrawal')}>
      <div className='flex flex-col gap-5 max-w-xl'>
        <div className='flex items-center gap-3 p-4 bg-[var(--gta-panel)] border border-[var(--gta-border)] relative'>
          <div className='absolute top-0 left-0 right-0 h-[2px] bg-[var(--gta-yellow)]' />
          <div className='w-8 h-8 flex items-center justify-center bg-[var(--gta-yellow)]/10 border border-[var(--gta-yellow)]/30 text-[var(--gta-yellow)] shrink-0'>
            <Wallet className='w-4 h-4' />
          </div>
          <div className='flex flex-col gap-0.5'>
            <Typography variant='pre' className='text-[10px] text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em]'>
              {t('Physical Wallet')}
            </Typography>
            <Typography className='text-xl font-bold text-[var(--gta-yellow)] leading-none'>
              {formatMoney(currentCash, general)}
            </Typography>
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col gap-3'>
              <Typography variant='label' className='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] px-0.5'>
                {t('Source')}
              </Typography>
              <AccountSelect
                accounts={accounts}
                isFromAccount={true}
                onSelect={setSelectedAccountId}
                selectedId={selectedAccountId}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <Typography variant='label' className='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] px-0.5 mb-2'>
                {t('Amount')}
              </Typography>
              <PriceField
                placeholder={t('0.00')}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                error={!isValidNewBalance && value > 0}
              />
              {!isValidNewBalance && value > 0 && (
                <Typography variant='pre' className='text-[var(--gta-red)] text-[10px] uppercase tracking-[0.15em] mt-1 pl-1'>
                  {t('Insufficient account funds')}
                </Typography>
              )}
              <div className='mt-1 pl-0.5'>
                <NewBalance
                  amount={newAccountBalance}
                  isValid={isValidNewBalance}
                  newBalanceText={t('Post-Withdrawal Balance')}
                />
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-3 pt-2'>
            <Button size='lg' disabled={isButtonDisabled} onClick={handleWithdrawal} className='w-full'>
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>{t('Processing Transaction...')}</span>
                </div>
              ) : (
                t('Authorize Withdrawal')
              )}
            </Button>

            <div className='flex items-start gap-2 px-3 py-3 bg-[var(--gta-surface)] border border-[var(--gta-border)]'>
              <div className='w-1.5 h-1.5 bg-[var(--gta-yellow)] mt-1 shrink-0' />
              <Typography
                variant='pre'
                className='text-[9px] font-bold text-[var(--gta-text-dim)] leading-relaxed uppercase tracking-[0.1em]'
              >
                {t(
                  'Funds will be instantly debited from your account and converted to physical currency. Ensure your storage space is sufficient for the liquid assets.',
                )}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Withdraw;
