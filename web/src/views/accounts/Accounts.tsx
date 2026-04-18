import { Input } from '@components/ui/Input';
import { transactionBaseAtom } from '@data/transactions';
import { AccountType } from '@typings/Account';
import { AccountEvents } from '@typings/Events';
import { getIsAdmin, getIsOwner } from '@utils/account';
import { cn } from '@utils/cn';
import copy from 'copy-to-clipboard';
import { useAtom, useAtomValue } from 'jotai';
import { AlertTriangle, Copy, PenTool, PlusCircle, Shield } from 'lucide-react';
import React, { type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AccountCards from '../../components/AccountCards';
import Layout from '../../components/Layout';
import Button from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Typography } from '../../components/ui/Typography';
import { accountsAtom, defaultAccountAtom, totalBalanceAtom } from '../../data/accounts';
import { useConfig } from '../../hooks/useConfig';
import { formatMoney } from '../../utils/currency';
import { fetchNui } from '../../utils/fetchNui';
import SharedSettings from './SharedSettings';

interface RenameAccountActionProps {
  accountId: number;
  currentName: string;
  isAdmin: boolean;
  onUpdate: () => void;
}

const RenameAccountAction = ({ accountId, currentName, isAdmin, onUpdate }: RenameAccountActionProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(currentName);

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  const handleRename = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchNui(AccountEvents.RenameAccount, { accountId, name }).then(() => {
      onUpdate();
      setIsOpen(false);
    });
  };

  return (
    <div className='flex flex-col gap-1.5'>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={!isAdmin}
        variant='secondary'
        className='h-10 justify-start px-4 text-xs'
      >
        <PenTool className='w-3.5 h-3.5 mr-2 opacity-50' />
        {t('Rename account')}
      </Button>
      {!isAdmin && (
        <Typography variant='pre' className='text-[9px] text-[var(--gta-text-dim)] font-medium uppercase tracking-[0.15em] ml-0.5'>
          {t('Admin access required')}
        </Typography>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('Rename Account')} maxWidth='sm'>
        <form onSubmit={handleRename} className='flex flex-col gap-5 h-full'>
          <Input
            autoFocus
            label={t('Account Name')}
            placeholder={t('Enter new name...')}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <div className='flex justify-end gap-2 mt-auto pt-4 border-t border-[var(--gta-border)]'>
            <Button variant='secondary' onClick={() => setIsOpen(false)} type='button'>
              {t('Cancel')}
            </Button>
            <Button type='submit'>{t('Save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const Accounts = () => {
  const config = useConfig();
  const { t } = useTranslation();
  const totalBalance = useAtomValue(totalBalanceAtom);
  const [accounts, updateAccounts] = useAtom(accountsAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);
  const defaultAccount = useAtomValue(defaultAccountAtom);
  const [selectedAccountId, setSelectedAccountId] = useState<number>(defaultAccount?.id ?? 0);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);

  const handleUpdateAccounts = () => {
    updateAccounts();
  };

  const handleSetDefault = () => {
    fetchNui(AccountEvents.SetDefaultAccount, { accountId: selectedAccountId })
      .then(handleUpdateAccounts)
      .catch((err) => {
        console.log({ err });
      });
  };

  const handleDeleteAccount = async () => {
    await fetchNui(AccountEvents.DeleteAccount, { accountId: selectedAccountId });
    await updateAccounts();
    await updateTransactions();
  };

  const isAdmin = Boolean(selectedAccount && getIsAdmin(selectedAccount));
  const isOwner = Boolean(selectedAccount && getIsOwner(selectedAccount));
  const isShared = selectedAccount?.type === AccountType.Shared;
  const isDefaultAccountSelected = defaultAccount?.id === selectedAccountId;

  return (
    <Layout>
      <div className='flex flex-col gap-1 mb-5'>
        <Typography variant='label' className='text-[10px] text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.2em]'>
          {t('Total Portfolio')}
        </Typography>
        <Typography variant='h1' className='text-3xl font-bold text-[var(--gta-green)] leading-tight'>
          {formatMoney(totalBalance, config.general)}
        </Typography>
      </div>

      <div className='relative'>
        <AccountCards onSelectAccount={setSelectedAccountId} selectedAccountId={selectedAccountId} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-5 mt-6 items-start'>
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2 pb-2 border-b border-[var(--gta-border)]'>
              <Shield className='w-3.5 h-3.5 text-[var(--gta-green)]' />
              <Typography variant='h4' className='text-[var(--gta-text)] font-bold tracking-[0.1em] text-xs'>
                {t('Account Management')}
              </Typography>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              <div className='flex flex-col gap-1.5'>
                <Button
                  onClick={handleSetDefault}
                  disabled={isDefaultAccountSelected || !isAdmin || isShared}
                  variant='secondary'
                  className='h-10 justify-start px-4 text-xs'
                >
                  <PlusCircle className='w-3.5 h-3.5 mr-2 opacity-50' />
                  {t('Set as default')}
                </Button>
                {(!isAdmin || isShared) && (
                  <Typography
                    variant='pre'
                    className='text-[9px] text-[var(--gta-text-dim)] font-medium uppercase tracking-[0.15em] ml-0.5'
                  >
                    {!isAdmin ? t('Authorization required') : t('Shared accounts ineligible')}
                  </Typography>
                )}
              </div>

              <RenameAccountAction
                accountId={selectedAccountId}
                currentName={selectedAccount?.accountName ?? ''}
                isAdmin={isAdmin}
                onUpdate={handleUpdateAccounts}
              />

              <Button
                variant='secondary'
                onClick={() => copy(selectedAccount?.number ?? '')}
                className='h-10 justify-start px-4 text-xs'
              >
                <Copy className='w-3.5 h-3.5 mr-2 opacity-50' />
                {t('Copy account number')}
              </Button>
            </div>
          </div>

          {isOwner && (
            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-2 pb-2 border-b border-[var(--gta-red)]/20'>
                <AlertTriangle className='w-3.5 h-3.5 text-[var(--gta-red)]' />
                <Typography variant='h4' className='text-[var(--gta-red)] font-bold tracking-[0.1em] text-xs'>
                  {t('Danger Zone')}
                </Typography>
              </div>
              <div className='p-4 border border-[var(--gta-red)]/20 bg-[var(--gta-red)]/5 flex flex-col sm:flex-row items-center justify-between gap-3'>
                <div className='flex flex-col gap-1'>
                  <Typography className='text-[var(--gta-text)] font-bold text-sm uppercase'>{t('Delete Account')}</Typography>
                  <Typography
                    variant='pre'
                    className={cn(
                      'text-[9px] font-medium uppercase tracking-[0.1em] leading-loose max-w-sm',
                      isDefaultAccountSelected ? 'text-[var(--gta-text-dim)]' : 'text-[var(--gta-text-muted)]',
                    )}
                  >
                    {isDefaultAccountSelected
                      ? t('Cannot delete the default account.')
                      : t('This will permanently delete the account and move assets to default.')}
                  </Typography>
                </div>
                <Button
                  variant='danger'
                  className='min-w-[100px] h-9 text-[10px] font-bold uppercase tracking-[0.15em] shrink-0'
                  onClick={handleDeleteAccount}
                  disabled={isDefaultAccountSelected}
                >
                  {t('Delete')}
                </Button>
              </div>
            </div>
          )}
        </div>

        <aside className='sticky top-0'>
          {isShared && (
            <div className='p-4 bg-[var(--gta-panel)] border border-[var(--gta-border)]'>
              <SharedSettings accountId={selectedAccountId} isAdmin={isAdmin} />
            </div>
          )}
          {!isShared && (
            <div className='p-4 bg-[var(--gta-panel)] border border-dashed border-[var(--gta-border)] flex flex-col items-center justify-center text-center gap-2 py-10 opacity-40'>
              <Shield className='w-6 h-6 text-[var(--gta-text-dim)]' />
              <Typography
                variant='pre'
                className='text-[9px] font-medium uppercase tracking-[0.15em] text-[var(--gta-text-dim)] leading-relaxed max-w-[180px]'
              >
                {t('Personal account — no sharing settings.')}
              </Typography>
            </div>
          )}
        </aside>
      </div>
    </Layout>
  );
};

export default Accounts;
