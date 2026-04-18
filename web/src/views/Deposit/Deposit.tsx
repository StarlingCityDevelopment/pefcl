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
      <div className='flex flex-col gap-5 max-w-xl'>
        <div className='flex items-center gap-3 p-4 bg-[var(--gta-panel)] border border-[var(--gta-border)] relative'>
          <div className='absolute top-0 left-0 right-0 h-[2px] bg-[var(--gta-green)]' />
          <div className='w-8 h-8 flex items-center justify-center bg-[var(--gta-green)]/10 border border-[var(--gta-green)]/30 text-[var(--gta-green)] shrink-0'>
            <Wallet className='w-4 h-4' />
          </div>
          <div className='flex flex-col gap-0.5'>
            <Typography variant='pre' className='text-[10px] text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em]'>
              {t('Available Cash')}
            </Typography>
            <Typography className='text-xl font-bold text-[var(--gta-green)] leading-none'>
              {formatMoney(currentCash, general)}
            </Typography>
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col gap-3'>
              <Typography variant='label' className='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] px-0.5'>
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
                  {t('Insufficient physical cash')}
                </Typography>
              )}
              <div className='mt-1 pl-0.5'>
                <NewBalance amount={newCash} isValid={isValidNewBalance} newBalanceText={t('Post-Deposit Wallet')} />
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-3 pt-2'>
            <Button size='lg' disabled={isButtonDisabled} onClick={handleDeposit} className='w-full'>
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>{t('Processing Entry...')}</span>
                </div>
              ) : (
                t('Authorize Deposit')
              )}
            </Button>

            <div className='flex items-start gap-2 px-3 py-3 bg-[var(--gta-surface)] border border-[var(--gta-border)]'>
              <div className='w-1.5 h-1.5 bg-[var(--gta-green)] mt-1 shrink-0' />
              <Typography
                variant='pre'
                className='text-[9px] font-bold text-[var(--gta-text-dim)] leading-relaxed uppercase tracking-[0.1em]'
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
