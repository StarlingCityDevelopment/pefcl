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
      <div className='flex flex-col gap-10'>
        <div className='flex flex-col gap-1'>
          <Typography variant='label' className='text-slate-500 font-bold uppercase tracking-widest px-1'>
            {t('Credential Catalog')}
          </Typography>
          <div className='flex items-center gap-4'>
            <Typography variant='h1' className='text-white font-bold leading-tight tracking-tight text-4xl'>
              {t('Card Access')}
            </Typography>
            <div className='px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md'>
              <Typography
                variant='pre'
                className='text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none'
              >
                {t('Encrypted')}
              </Typography>
            </div>
          </div>
        </div>

        {/* Account selector tabs */}
        <div className='flex flex-col gap-4'>
          <Typography variant='pre' className='text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1'>
            {t('Select Source Entity')}
          </Typography>
          <div className='flex flex-row gap-4 overflow-x-auto pb-6 no-scrollbar custom-scrollbar'>
            {accounts.map((account) => {
              const isActive = account.id === selectedAccountId;
              return (
                <button
                  type='button'
                  key={account.id}
                  onClick={() => handleSelectAccount(account.id)}
                  className={cn(
                    'flex flex-col items-start gap-4 p-6 rounded-[2rem] border transition-all duration-300 min-w-[240px] select-none text-left relative overflow-hidden group',
                    'active:scale-95',
                    isActive
                      ? 'bg-white border-white -[0_20px_40px_-10px_rgba(255,255,255,0.2)]'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10',
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300',
                      isActive
                        ? 'bg-black text-white'
                        : 'bg-white/5 text-slate-500 group-hover:text-white group-hover:bg-white/10',
                    )}
                  >
                    <Wallet className='w-5 h-5' />
                  </div>

                  <div className='flex flex-col gap-1 relative z-10'>
                    <Typography
                      className={cn(
                        'text-sm font-bold tracking-tight transition-colors',
                        isActive ? 'text-black' : 'text-slate-400 group-hover:text-white',
                      )}
                    >
                      {account.accountName}
                    </Typography>
                    <Typography
                      className={cn(
                        'text-xs font-medium tracking-tight leading-none transition-colors',
                        isActive ? 'text-black/60' : 'text-slate-600 group-hover:text-slate-500',
                      )}
                    >
                      {formatMoney(account.balance, config.general)}
                    </Typography>
                  </div>

                  {/* Decorative circle for active state */}
                  {isActive && <div className='absolute -bottom-8 -right-8 w-24 h-24 bg-black/[0.03] rounded-full' />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bank cards for selected account */}
        {selectedAccountId > 0 && (
          <div className='mt-4 flex flex-col gap-6'>
            <div className='flex items-center gap-3 px-1'>
              <ShieldCheck className='w-5 h-5 text-slate-500' />
              <Typography variant='pre' className='text-[10px] text-slate-500 font-bold uppercase tracking-widest'>
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
