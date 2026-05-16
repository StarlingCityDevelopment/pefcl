// web/src/views/accounts/Accounts.tsx
import { Input } from "@components/ui/Input";
import { refetchTransactions } from "@data/transactions";
import { AccountType } from "@typings/Account";
import { AccountEvents } from "@typings/Events";
import { getIsAdmin, getIsOwner } from "@utils/account";
import { cn } from "@utils/cn";
import copy from 'copy-to-clipboard';
import { AlertTriangle, Copy, PenTool, PlusCircle, Shield } from 'lucide-solid';
import { createSignal, createEffect, Show, createMemo } from 'solid-js';
import AccountCards from "@components/AccountCards";
import Layout from "@components/Layout";
import Button from "@components/ui/Button";
import { Modal } from "@components/ui/Modal";
import { Typography } from "@components/ui/Typography";
import { accounts, defaultAccount, totalBalance, refetchAccounts } from "@data/accounts";
import { useConfig } from "@hooks/useConfig";
import { formatMoney } from "@utils/currency";
import { fetchNui } from "@utils/fetchNui";
import SharedSettings from './SharedSettings';
import i18n from "@utils/i18n";

interface RenameAccountActionProps {
  accountId: number;
  currentName: string;
  isAdmin: boolean;
  onUpdate: () => void;
}

const RenameAccountAction = (props: RenameAccountActionProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [name, setName] = createSignal(props.currentName);

  createEffect(() => {
    setName(props.currentName);
  });

  const handleRename = (event: Event) => {
    event.preventDefault();
    fetchNui(AccountEvents.RenameAccount, { accountId: props.accountId, name: name() }).then(() => {
      props.onUpdate();
      setIsOpen(false);
    });
  };

  return (
    <div class='flex flex-col gap-1.5'>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={!props.isAdmin}
        variant='secondary'
        class='h-10 justify-start px-4 text-xs'
      >
        <PenTool size={14} class='mr-2 opacity-50' />
        {i18n.t('Rename account')}
      </Button>
      <Show when={!props.isAdmin}>
        <Typography variant='pre' class='text-[9px] text-[var(--gta-text-dim)] font-medium uppercase tracking-[0.15em] ml-0.5'>
          {i18n.t('Admin access required')}
        </Typography>
      </Show>

      <Modal isOpen={isOpen()} onClose={() => setIsOpen(false)} title={i18n.t('Rename Account')} maxWidth='sm'>
        <form onSubmit={handleRename} class='flex flex-col gap-5 h-full'>
          <Input
            autofocus
            label={i18n.t('Account Name')}
            placeholder={i18n.t('Enter new name...')}
            value={name()}
            onInput={(event) => setName(event.currentTarget.value)}
          />
          <div class='flex justify-end gap-2 mt-auto pt-4 border-t border-[var(--gta-border)]'>
            <Button variant='secondary' onClick={() => setIsOpen(false)} type='button'>
              {i18n.t('Cancel')}
            </Button>
            <Button type='submit'>{i18n.t('Save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const Accounts = () => {
  const config = useConfig();
  const [selectedAccountId, setSelectedAccountId] = createSignal<number>(defaultAccount()?.id ?? 0);

  createEffect(() => {
    const currentDefault = defaultAccount();
    if (currentDefault && !selectedAccountId()) {
        setSelectedAccountId(currentDefault.id);
    }
  });

  const selectedAccount = createMemo(() => accounts().find((account) => account.id === selectedAccountId()));

  const handleSetDefault = () => {
    fetchNui(AccountEvents.SetDefaultAccount, { accountId: selectedAccountId() })
      .then(() => refetchAccounts())
      .catch((err) => {
        console.error({ err });
      });
  };

  const handleDeleteAccount = async () => {
    await fetchNui(AccountEvents.DeleteAccount, { accountId: selectedAccountId() });
    await Promise.all([refetchAccounts(), refetchTransactions()]);
  };

  const isAdmin = () => {
      const account = selectedAccount();
      return account ? getIsAdmin(account) : false;
  };
  const isOwner = () => {
      const account = selectedAccount();
      return account ? getIsOwner(account) : false;
  };
  const isShared = () => selectedAccount()?.type === AccountType.Shared;
  const isDefaultAccountSelected = () => defaultAccount()?.id === selectedAccountId();

  return (
    <Layout>
      <div class='flex flex-col gap-1 mb-5'>
        <Typography variant='label' class='text-[10px] text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.2em]'>
          {i18n.t('Total Portfolio')}
        </Typography>
        <Typography variant='h1' class='text-3xl font-bold text-[var(--gta-green)] leading-tight'>
          {formatMoney(totalBalance(), config()?.general)}
        </Typography>
      </div>

      <div class='relative'>
        <AccountCards onSelectAccount={setSelectedAccountId} selectedAccountId={selectedAccountId()} />
      </div>

      <div class='grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-5 mt-6 items-start'>
        <div class='flex flex-col gap-5'>
          <div class='flex flex-col gap-3'>
            <div class='flex items-center gap-2 pb-2 border-b border-[var(--gta-border)]'>
              <Shield size={14} class='text-[var(--gta-green)]' />
              <Typography variant='h4' class='text-[var(--gta-text)] font-bold tracking-[0.1em] text-xs'>
                {i18n.t('Account Management')}
              </Typography>
            </div>

            <div class='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              <div class='flex flex-col gap-1.5'>
                <Button
                  onClick={handleSetDefault}
                  disabled={isDefaultAccountSelected() || !isAdmin() || isShared()}
                  variant='secondary'
                  class='h-10 justify-start px-4 text-xs'
                >
                  <PlusCircle size={14} class='mr-2 opacity-50' />
                  {i18n.t('Set as default')}
                </Button>
                <Show when={!isAdmin() || isShared()}>
                  <Typography
                    variant='pre'
                    class='text-[9px] text-[var(--gta-text-dim)] font-medium uppercase tracking-[0.15em] ml-0.5'
                  >
                    {!isAdmin() ? i18n.t('Authorization required') : i18n.t('Shared accounts ineligible')}
                  </Typography>
                </Show>
              </div>

              <RenameAccountAction
                accountId={selectedAccountId()}
                currentName={selectedAccount()?.accountName ?? ''}
                isAdmin={isAdmin()}
                onUpdate={() => refetchAccounts()}
              />

              <Button
                variant='secondary'
                onClick={() => copy(selectedAccount()?.number ?? '')}
                class='h-10 justify-start px-4 text-xs'
              >
                <Copy size={14} class='mr-2 opacity-50' />
                {i18n.t('Copy account number')}
              </Button>
            </div>
          </div>

          <Show when={isOwner()}>
            <div class='flex flex-col gap-3'>
              <div class='flex items-center gap-2 pb-2 border-b border-[var(--gta-red)]/20'>
                <AlertTriangle size={14} class='text-[var(--gta-red)]' />
                <Typography variant='h4' class='text-[var(--gta-red)] font-bold tracking-[0.1em] text-xs'>
                  {i18n.t('Danger Zone')}
                </Typography>
              </div>
              <div class='p-4 border border-[var(--gta-red)]/20 bg-[var(--gta-red)]/5 flex flex-col sm:flex-row items-center justify-between gap-3'>
                <div class='flex flex-col gap-1'>
                  <Typography class='text-[var(--gta-text)] font-bold text-sm uppercase'>{i18n.t('Delete Account')}</Typography>
                  <Typography
                    variant='pre'
                    class={cn(
                      'text-[9px] font-medium uppercase tracking-[0.1em] leading-loose max-w-sm',
                      isDefaultAccountSelected() ? 'text-[var(--gta-text-dim)]' : 'text-[var(--gta-text-muted)]',
                    )}
                  >
                    {isDefaultAccountSelected()
                      ? i18n.t('Cannot delete the default account.')
                      : i18n.t('This will permanently delete the account and move assets to default.')}
                  </Typography>
                </div>
                <Button
                  variant='danger'
                  class='min-w-[100px] h-9 text-[10px] font-bold uppercase tracking-[0.15em] shrink-0'
                  onClick={handleDeleteAccount}
                  disabled={isDefaultAccountSelected()}
                >
                  {i18n.t('Delete')}
                </Button>
              </div>
            </div>
          </Show>
        </div>

        <aside class='sticky top-0'>
          <Show when={isShared()} fallback={
            <div class='p-4 bg-[var(--gta-panel)] border border-dashed border-[var(--gta-border)] flex flex-col items-center justify-center text-center gap-2 py-10 opacity-40'>
              <Shield size={24} class='text-[var(--gta-text-dim)]' />
              <Typography
                variant='pre'
                class='text-[9px] font-medium uppercase tracking-[0.15em] text-[var(--gta-text-dim)] leading-relaxed max-w-[180px]'
              >
                {i18n.t('Personal account — no sharing settings.')}
              </Typography>
            </div>
          }>
            <div class='p-4 bg-[var(--gta-panel)] border border-[var(--gta-border)]'>
              <SharedSettings accountId={selectedAccountId()} isAdmin={isAdmin()} />
            </div>
          </Show>
        </aside>
      </div>
    </Layout>
  );
};

export default Accounts;
