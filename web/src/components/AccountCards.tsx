// web/src/components/AccountCards.tsx
import { AccountCard, LoadingAccountCard } from "@components/AccountCard";
import CreateAccountModal from "@components/Modals/CreateAccount";
import { orderedAccounts, refetchAccounts } from "@data/accounts";
import { useConfig } from "@hooks/useConfig";
import { cn } from "@utils/cn";
import { Plus } from 'lucide-solid';
import { createSignal, Show, For } from 'solid-js';
import i18n from "@utils/i18n";
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

const CreateAccountAction = (props: CreateAccountActionProps) => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <Show when={props.currentCount < props.maxAccounts}>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        class={cn(
          'flex items-center justify-center h-[130px] w-full',
          'border border-dashed border-[var(--gta-border)] text-[var(--gta-text-dim)]',
          'transition-all duration-150 hover:text-[var(--gta-green)] hover:border-[var(--gta-green)]/50 hover:bg-[var(--gta-green)]/5 active:scale-95',
        )}
        title='create-account'
      >
        <Plus size={20} />
      </button>

      <Modal isOpen={isOpen()} onClose={() => setIsOpen(false)} title={i18n.t('Create Account')}>
        <CreateAccountModal
          onClose={() => {
            setIsOpen(false);
            props.onSuccess();
          }}
        />
      </Modal>
    </Show>
  );
};

const AccountCards = (props: AccountCardsProps) => {
  const config = useConfig();

  return (
    <div class='grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2 w-full'>
      <For each={orderedAccounts()}>
        {(account) => (
            <button
                type='button'
                onClick={() => props.onSelectAccount?.(account.id)}
                class='flex flex-col min-w-0 text-left w-full focus:outline-none focus:ring-1 focus:ring-[var(--gta-green)] cursor-pointer'
            >
                <AccountCard account={account} selected={account.id === props.selectedAccountId} withCopy />
            </button>
        )}
      </For>

      <Show when={!props.hideCreate}>
        <CreateAccountAction
          onSuccess={() => refetchAccounts()}
          maxAccounts={config()?.accounts?.maximumNumberOfAccounts || 4}
          currentCount={orderedAccounts().length}
        />
      </Show>
    </div>
  );
};

export const LoadingCards = (props: { hideCreate?: boolean }) => {
  return (
    <div class='grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2 w-full'>
      <LoadingAccountCard />
      <LoadingAccountCard />
      <LoadingAccountCard />
      <Show when={!props.hideCreate}>
        <div class='flex items-center justify-center min-h-[130px] border border-dashed border-[var(--gta-border)] opacity-20 animate-pulse'>
          <Plus size={24} />
        </div>
      </Show>
    </div>
  );
};

export default AccountCards;
