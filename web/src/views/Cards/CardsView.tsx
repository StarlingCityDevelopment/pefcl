// web/src/views/Cards/CardsView.tsx
import Layout from "@components/Layout";
import { Typography } from "@components/ui/Typography";
import { accounts } from "@data/accounts";
import { selectedAccountId, setSelectedAccountId } from "@data/cards";
import { useConfig } from "@hooks/useConfig";
import { cn } from "@utils/cn";
import { formatMoney } from "@utils/currency";
import { ShieldCheck, Wallet } from 'lucide-solid';
import { createSignal, createEffect, Show, For } from 'solid-js';
import i18n from "@utils/i18n";
import BankCards from "./components/BankCards";

const CardsView = () => {
  const [selectedCardId, setSelectedCardId] = createSignal(0);
  const config = useConfig();

  // Auto-select first account if none selected
  createEffect(() => {
    const currentAccounts = accounts();
    if (!selectedAccountId() && currentAccounts.length > 0) {
      setSelectedAccountId(currentAccounts[0].id);
    }
  });

  const handleSelectAccount = (accountId: number) => {
    setSelectedAccountId(accountId);
    setSelectedCardId(0); // Reset card selection when switching accounts
  };

  return (
    <Layout>
      <div class='flex flex-col gap-6'>
        <div class='flex flex-col gap-1'>
          <Typography variant='label' class='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.2em] px-0.5'>
            {i18n.t('Credential Catalog')}
          </Typography>
          <div class='flex items-center gap-3'>
            <Typography variant='h1' class='text-[var(--gta-text)] font-bold leading-tight tracking-[0.15em] text-2xl'>
              {i18n.t('Card Access')}
            </Typography>
            <div class='px-2 py-1 bg-[var(--gta-green)]/10 border border-[var(--gta-green)]/30'>
              <Typography
                variant='pre'
                class='text-[10px] text-[var(--gta-green)] font-bold uppercase tracking-[0.15em] leading-none'
              >
                {i18n.t('Encrypted')}
              </Typography>
            </div>
          </div>
        </div>

        {/* Account selector tabs */}
        <div class='flex flex-col gap-3'>
          <Typography variant='pre' class='text-[10px] text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] px-0.5'>
            {i18n.t('Select Source Entity')}
          </Typography>
          <div class='flex flex-row gap-2 overflow-x-auto pb-4 no-scrollbar custom-scrollbar'>
            <For each={accounts()}>
              {(account) => {
                const isActive = () => account.id === selectedAccountId();
                return (
                  <button
                    type='button'
                    onClick={() => handleSelectAccount(account.id)}
                    class={cn(
                      'flex flex-col items-start gap-3 p-4 border transition-all duration-150 min-w-[200px] select-none text-left relative overflow-hidden group',
                      'active:scale-95',
                      isActive()
                        ? 'bg-[var(--gta-green)] border-[var(--gta-green)] text-black'
                        : 'bg-[var(--gta-panel)] border-[var(--gta-border)] hover:border-[var(--gta-green)]/50 hover:bg-[var(--gta-surface)]',
                    )}
                  >
                    {/* Top accent */}
                    <Show when={!isActive()}>
                        <div class='absolute top-0 left-0 right-0 h-[1px] bg-[var(--gta-border)] group-hover:bg-[var(--gta-green)]/30 transition-colors' />
                    </Show>

                    <div
                      class={cn(
                        'flex items-center justify-center w-9 h-9 border transition-all duration-150',
                        isActive()
                          ? 'bg-black/20 border-black/20 text-black'
                          : 'bg-[var(--gta-surface)] border-[var(--gta-border)] text-[var(--gta-text-dim)] group-hover:text-[var(--gta-green)] group-hover:border-[var(--gta-green)]/30',
                      )}
                    >
                      <Wallet size={16} />
                    </div>

                    <div class='flex flex-col gap-0.5 relative z-10'>
                      <Typography
                        class={cn(
                          'text-xs font-bold tracking-wide uppercase transition-colors',
                          isActive() ? 'text-black' : 'text-[var(--gta-text-muted)] group-hover:text-[var(--gta-text)]',
                        )}
                      >
                        {account.accountName}
                      </Typography>
                      <Typography
                        class={cn(
                          'text-xs font-medium leading-none transition-colors',
                          isActive() ? 'text-black/70' : 'text-[var(--gta-text-dim)]',
                        )}
                      >
                        {formatMoney(account.balance, config()?.general)}
                      </Typography>
                    </div>
                  </button>
                );
              }}
            </For>
          </div>
        </div>

        {/* Bank cards for selected account */}
        <Show when={selectedAccountId() > 0}>
          <div class='flex flex-col gap-4'>
            <div class='flex items-center gap-2 px-0.5 pb-2 border-b border-[var(--gta-border)]'>
              <ShieldCheck size={16} class='text-[var(--gta-green)]' />
              <Typography variant='pre' class='text-[10px] text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em]'>
                {i18n.t('Active Credentials Registry')}
              </Typography>
            </div>

            <BankCards
              selectedCardId={selectedCardId()}
              onSelectCardId={setSelectedCardId}
              accountId={selectedAccountId()}
            />
          </div>
        </Show>
      </div>
    </Layout>
  );
};

export default CardsView;
