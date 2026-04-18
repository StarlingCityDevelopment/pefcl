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
        className='h-11 justify-start px-4 text-sm'
      >
        <PenTool className='w-4 h-4 mr-2.5 opacity-50' />
        {t('Rename account')}
      </Button>
      {!isAdmin && (
        <Typography variant='pre' className='text-[9px] text-slate-600 font-medium uppercase tracking-widest ml-1'>
          {t('Admin access required')}
        </Typography>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('Rename Account')} maxWidth='sm'>
        <form onSubmit={handleRename} className='flex flex-col gap-6 h-full'>
          <Input
            autoFocus
            label={t('Account Name')}
            placeholder={t('Enter new name...')}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <div className='flex justify-end gap-3 mt-auto pt-6 border-t border-white/5'>
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
      <div className='flex flex-col gap-1 mb-6'>
        <Typography variant='label' className='text-[10px] text-slate-500 font-medium uppercase tracking-widest'>
          {t('Total Portfolio')}
        </Typography>
        <Typography variant='h1' className='text-4xl font-light text-white leading-tight tracking-tight'>
          {formatMoney(totalBalance, config.general)}
        </Typography>
      </div>

      <div className='relative'>
        <AccountCards onSelectAccount={setSelectedAccountId} selectedAccountId={selectedAccountId} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-8 mt-8 items-start'>
        <div className='flex flex-col gap-8'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <Shield className='w-4 h-4 text-slate-500' />
              <Typography variant='h3' className='text-white font-medium tracking-tight leading-none text-sm'>
                {t('Account Management')}
              </Typography>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <div className='flex flex-col gap-1.5'>
                <Button
                  onClick={handleSetDefault}
                  disabled={isDefaultAccountSelected || !isAdmin || isShared}
                  variant='secondary'
                  className='h-11 justify-start px-4 text-sm'
                >
                  <PlusCircle className='w-4 h-4 mr-2.5 opacity-50' />
                  {t('Set as default')}
                </Button>
                {(!isAdmin || isShared) && (
                  <Typography
                    variant='pre'
                    className='text-[9px] text-slate-600 font-medium uppercase tracking-widest ml-1'
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
                className='h-11 justify-start px-4 text-sm'
              >
                <Copy className='w-4 h-4 mr-2.5 opacity-50' />
                {t('Copy account number')}
              </Button>
            </div>
          </div>

          {isOwner && (
            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-2'>
                <AlertTriangle className='w-4 h-4 text-slate-500' />
                <Typography variant='h3' className='text-white font-medium tracking-tight leading-none text-sm'>
                  {t('Danger Zone')}
                </Typography>
              </div>
              <div className='p-5 rounded-2xl border border-red-500/10 bg-red-500/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4'>
                <div className='flex flex-col gap-1'>
                  <Typography className='text-white font-medium leading-none text-sm'>{t('Delete Account')}</Typography>
                  <Typography
                    variant='pre'
                    className={cn(
                      'text-[9px] font-medium uppercase tracking-widest leading-loose max-w-sm',
                      isDefaultAccountSelected ? 'text-slate-600' : 'text-slate-500',
                    )}
                  >
                    {isDefaultAccountSelected
                      ? t('Cannot delete the default account.')
                      : t('This will permanently delete the account and move assets to default.')}
                  </Typography>
                </div>
                <Button
                  variant='secondary'
                  className='bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 min-w-[120px] h-10 rounded-xl text-[10px] font-medium uppercase tracking-widest shrink-0'
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
            <div className='p-5 rounded-2xl bg-white/[0.02] border border-white/10'>
              <SharedSettings accountId={selectedAccountId} isAdmin={isAdmin} />
            </div>
          )}
          {!isShared && (
            <div className='p-5 rounded-2xl bg-white/[0.02] border border-white/5 border-dashed flex flex-col items-center justify-center text-center gap-3 py-12 opacity-30'>
              <Shield className='w-8 h-8 text-slate-500' />
              <Typography
                variant='pre'
                className='text-[9px] font-medium uppercase tracking-widest text-slate-500 leading-relaxed max-w-[180px]'
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
