import Layout from '@components/Layout';
import { Typography } from '@components/ui/Typography';
import { accountsAtom } from '@data/accounts';
import { selectedAccountIdAtom } from '@data/cards';
import { useConfig } from '@hooks/useConfig';
import { cn } from '@utils/cn';
import { formatMoney } from '@utils/currency';
import { useAtom, useAtomValue } from 'jotai';
import { ShieldCheck, Wallet } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BankCards from './components/BankCards';

const CardsView = () => {
  const [selectedCardId, setSelectedCardId] = useState(0);
  const [selectedAccountId, setSelectedAccountId] = useAtom(selectedAccountIdAtom);
  const accounts = useAtomValue(accountsAtom);
  const { t } = useTranslation();
  const config = useConfig();

  // Auto-select first account if none selected
  useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId, setSelectedAccountId]);

  const handleSelectAccount = (accountId: number) => {
    setSelectedAccountId(accountId);
    setSelectedCardId(0); // Reset card selection when switching accounts
  };

  return (
    <Layout>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-1'>
          <Typography variant='label' className='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.2em] px-0.5'>
            {t('Credential Catalog')}
          </Typography>
          <div className='flex items-center gap-3'>
            <Typography variant='h1' className='text-[var(--gta-text)] font-bold leading-tight tracking-[0.15em] text-2xl'>
              {t('Card Access')}
            </Typography>
            <div className='px-2 py-1 bg-[var(--gta-green)]/10 border border-[var(--gta-green)]/30'>
              <Typography
                variant='pre'
                className='text-[10px] text-[var(--gta-green)] font-bold uppercase tracking-[0.15em] leading-none'
              >
                {t('Encrypted')}
              </Typography>
            </div>
          </div>
        </div>

        {/* Account selector tabs */}
        <div className='flex flex-col gap-3'>
          <Typography variant='pre' className='text-[10px] text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] px-0.5'>
            {t('Select Source Entity')}
          </Typography>
          <div className='flex flex-row gap-2 overflow-x-auto pb-4 no-scrollbar custom-scrollbar'>
            {accounts.map((account) => {
              const isActive = account.id === selectedAccountId;
              return (
                <button
                  type='button'
                  key={account.id}
                  onClick={() => handleSelectAccount(account.id)}
                  className={cn(
                    'flex flex-col items-start gap-3 p-4 border transition-all duration-150 min-w-[200px] select-none text-left relative overflow-hidden group',
                    'active:scale-95',
                    isActive
                      ? 'bg-[var(--gta-green)] border-[var(--gta-green)] text-black'
                      : 'bg-[var(--gta-panel)] border-[var(--gta-border)] hover:border-[var(--gta-green)]/50 hover:bg-[var(--gta-surface)]',
                  )}
                >
                  {/* Top accent */}
                  {!isActive && <div className='absolute top-0 left-0 right-0 h-[1px] bg-[var(--gta-border)] group-hover:bg-[var(--gta-green)]/30 transition-colors' />}

                  <div
                    className={cn(
                      'flex items-center justify-center w-9 h-9 border transition-all duration-150',
                      isActive
                        ? 'bg-black/20 border-black/20 text-black'
                        : 'bg-[var(--gta-surface)] border-[var(--gta-border)] text-[var(--gta-text-dim)] group-hover:text-[var(--gta-green)] group-hover:border-[var(--gta-green)]/30',
                    )}
                  >
                    <Wallet className='w-4 h-4' />
                  </div>

                  <div className='flex flex-col gap-0.5 relative z-10'>
                    <Typography
                      className={cn(
                        'text-xs font-bold tracking-wide uppercase transition-colors',
                        isActive ? 'text-black' : 'text-[var(--gta-text-muted)] group-hover:text-[var(--gta-text)]',
                      )}
                    >
                      {account.accountName}
                    </Typography>
                    <Typography
                      className={cn(
                        'text-xs font-medium leading-none transition-colors',
                        isActive ? 'text-black/70' : 'text-[var(--gta-text-dim)]',
                      )}
                    >
                      {formatMoney(account.balance, config.general)}
                    </Typography>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bank cards for selected account */}
        {selectedAccountId > 0 && (
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2 px-0.5 pb-2 border-b border-[var(--gta-border)]'>
              <ShieldCheck className='w-4 h-4 text-[var(--gta-green)]' />
              <Typography variant='pre' className='text-[10px] text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em]'>
                {t('Active Credentials Registry')}
              </Typography>
            </div>

            <BankCards
              selectedCardId={selectedCardId}
              onSelectCardId={setSelectedCardId}
              accountId={selectedAccountId}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CardsView;
