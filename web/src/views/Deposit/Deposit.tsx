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
import { ArrowUpCircle, Loader2, Wallet } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Deposit = () => {
  const { t } = useTranslation();
  const [currentCash, updateCash] = useAtom(cashAtom);
  const [amount, setAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<number>(0);
  const [, updateAccounts] = useAtom(accountsAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);
  const accounts = useAtomValue(accountsAtom);
  const { general } = useConfig();

  const rawValue = Number.parseInt(amount.replace(/\D/g, ''));
  const value = isNaN(rawValue) ? 0 : rawValue;
  const newCash = currentCash - value;
  const isValidNewBalance = newCash >= 0;
  const isValidTransaction = Boolean(amount) && value > 0 && selectedAccountId > 0;

  const { mutate: mutateDeposit, isLoading } = useMutation(AccountEvents.DepositMoney, {
    onSuccess: async () => {
      setAmount('');
      updateCash();
      await Promise.all([updateAccounts(), updateTransactions()]);
    },
  });

  const isButtonDisabled = !isValidNewBalance || !isValidTransaction || isLoading;

  const handleDeposit = () => {
    if (!selectedAccountId) return;

    const payload: ATMInput = {
      amount: value,
      message: t('Deposited {{amount}} into account.', {
        amount: formatMoney(value, general),
      }),
      accountId: selectedAccountId,
    };
    mutateDeposit(payload);
  };

  return (
    <Layout title={t('Deposit Funds')}>
      <div className='flex flex-col gap-6 max-w-xl'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-white/60 shrink-0'>
            <Wallet className='w-4 h-4' />
          </div>
          <div className='flex flex-col gap-0.5'>
            <Typography variant='pre' className='text-[10px] text-slate-500 font-medium uppercase tracking-widest'>
              {t('Available Cash')}
            </Typography>
            <Typography className='text-2xl font-light text-white tracking-tight leading-none'>
              {formatMoney(currentCash, general)}
            </Typography>
          </div>
        </div>

        <div className='flex flex-col gap-5'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='flex flex-col gap-4'>
              <Typography variant='label' className='text-slate-500 font-black uppercase tracking-widest px-1'>
                {t('Destination')}
              </Typography>
              <AccountSelect
                accounts={accounts}
                isFromAccount={false}
                onSelect={setSelectedAccountId}
                selectedId={selectedAccountId}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <Typography variant='label' className='text-slate-500 font-black uppercase tracking-widest px-1 mb-3'>
                {t('Amount')}
              </Typography>
              <PriceField
                placeholder={t('0.00')}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                error={!isValidNewBalance && value > 0}
              />
              {!isValidNewBalance && value > 0 && (
                <Typography variant='pre' className='text-red-500 text-[10px] uppercase tracking-widest mt-1 pl-2'>
                  {t('Insufficient physical cash')}
                </Typography>
              )}
              <div className='mt-2 pl-1'>
                <NewBalance amount={newCash} isValid={isValidNewBalance} newBalanceText={t('Post-Deposit Wallet')} />
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-4 pt-2'>
            <Button size='xl' disabled={isButtonDisabled} onClick={handleDeposit} className='w-full'>
              {isLoading ? (
                <div className='flex items-center gap-3'>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  <span>{t('Processing Entry...')}</span>
                </div>
              ) : (
                t('Authorize Deposit')
              )}
            </Button>

            <div className='flex items-start gap-3 px-4 py-4 rounded-2xl bg-white/[0.01] border border-white/5'>
              <div className='w-1.5 h-1.5 rounded-full bg-slate-700 mt-1.5 shrink-0' />
              <Typography
                variant='pre'
                className='text-[10px] font-black text-slate-500 leading-relaxed uppercase tracking-widest'
              >
                {t(
                  'Funds will be electronically verified and instantly cleared. This action initiates a secure transfer of physical cash to the digital ledger.',
                )}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Deposit;
