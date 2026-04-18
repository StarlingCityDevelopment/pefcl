import { AccountCard, LoadingAccountCard } from '@components/AccountCard';
import CreateAccountModal from '@components/Modals/CreateAccount';
import { orderedAccountsAtom } from '@data/accounts';
import { useConfig } from '@hooks/useConfig';
import { Plus } from 'lucide-react';
import { Modal } from './ui/Modal';
import { useAtom, useAtomValue } from 'jotai';
import React, { useState } from 'react';
import { cn } from '@utils/cn';
import { useTranslation } from 'react-i18next';

interface AccountCardsProps {
 selectedAccountId?: number;
 onSelectAccount?: (id: number) => void;
 hideCreate?: boolean;
}

interface CreateAccountActionProps {
  onSuccess: () => void;
  maxAccounts: number;
  currentCount: number;
}

const CreateAccountAction = ({ onSuccess, maxAccounts, currentCount }: CreateAccountActionProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  if (currentCount >= maxAccounts) return null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center justify-center h-[150px] rounded-2xl w-full",
          "border border-dashed border-white/10 text-slate-600",
          "transition-all duration-300 hover:text-slate-400 hover:border-white/20 hover:bg-white/[0.02] active:scale-95"
        )}
        title='create-account'
      >
        <Plus className="w-5 h-5" />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('Create Account')}>
        <CreateAccountModal onClose={() => {
          setIsOpen(false);
          onSuccess();
        }} />
      </Modal>
    </>
  );
};

const AccountCards = ({ onSelectAccount, selectedAccountId, hideCreate }: AccountCardsProps) => {
 const config = useConfig();
 const { t } = useTranslation();
 const orderedAccounts = useAtomValue(orderedAccountsAtom);
 const [, updateAccounts] = useAtom(orderedAccountsAtom);

 return (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3 w-full">
  {orderedAccounts.map((account) => (
  <div 
  key={account.id} 
  onClick={() => onSelectAccount?.(account.id)}
  className="flex flex-col min-w-0"
  >
  <AccountCard account={account} selected={account.id === selectedAccountId} withCopy />
  </div>
  ))}

  {!hideCreate && (
    <CreateAccountAction 
      onSuccess={() => updateAccounts()} 
      maxAccounts={config.accounts.maximumNumberOfAccounts || 4}
      currentCount={orderedAccounts.length}
    />
  )}
  </div>
 );
};


export const LoadingCards = ({ hideCreate }: { hideCreate?: boolean }) => {
 return (
 <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 w-full">
 <LoadingAccountCard />
 <LoadingAccountCard />
 <LoadingAccountCard />
 {!hideCreate && (
 <div className="flex items-center justify-center min-h-[150px] rounded-2xl border-2 border-dashed border-white/5 opacity-5 animate-pulse">
 <Plus className="w-8 h-8" />
 </div>
 )}
 </div>
 );
};

export default AccountCards;
