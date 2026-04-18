import { AccountCard, LoadingAccountCard } from '@components/AccountCard';
import CreateAccountModal from '@components/Modals/CreateAccount';
import { orderedAccountsAtom } from '@data/accounts';
import { useConfig } from '@hooks/useConfig';
import { cn } from '@utils/cn';
import { useAtom, useAtomValue } from 'jotai';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from './ui/Modal';

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
        type='button'
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex items-center justify-center h-[130px] w-full',
          'border border-dashed border-[var(--gta-border)] text-[var(--gta-text-dim)]',
          'transition-all duration-150 hover:text-[var(--gta-green)] hover:border-[var(--gta-green)]/50 hover:bg-[var(--gta-green)]/5 active:scale-95',
        )}
        title='create-account'
      >
        <Plus className='w-5 h-5' />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('Create Account')}>
        <CreateAccountModal
          onClose={() => {
            setIsOpen(false);
            onSuccess();
          }}
        />
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
    <div className='grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2 w-full'>
      {orderedAccounts.map((account) => (
        <button
          type='button'
          key={account.id}
          onClick={() => onSelectAccount?.(account.id)}
          className='flex flex-col min-w-0 text-left w-full focus:outline-none focus:ring-1 focus:ring-[var(--gta-green)] cursor-pointer'
        >
          <AccountCard account={account} selected={account.id === selectedAccountId} withCopy />
        </button>
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
    <div className='grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2 w-full'>
      <LoadingAccountCard />
      <LoadingAccountCard />
      <LoadingAccountCard />
      {!hideCreate && (
        <div className='flex items-center justify-center min-h-[130px] border border-dashed border-[var(--gta-border)] opacity-20 animate-pulse'>
          <Plus className='w-6 h-6' />
        </div>
      )}
    </div>
  );
};

export default AccountCards;
