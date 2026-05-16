// web/src/views/Cards/components/BankCards.tsx
import BankCard from "@components/BankCard";
import Summary from "@components/Summary";
import Button from "@components/ui/Button";
import { Modal } from "@components/ui/Modal";
import { Typography } from "@components/ui/Typography";
import { accounts, refetchAccounts } from "@data/accounts";
import { cards, refetchCards, updateCards } from "@data/cards";
import { useConfig } from "@hooks/useConfig";
import { AccountRole, AccountType } from "@typings/Account";
import type { Card, CreateCardInput } from "@typings/BankCard";
import { CardEvents } from "@typings/Events";
import { cn } from "@utils/cn";
import { fetchNui } from "@utils/fetchNui";
import { AlertCircle, Plus, ShieldCheck, ShieldEllipsis } from 'lucide-solid';
import { createSignal, Show, For, onMount, createEffect, createMemo } from 'solid-js';
import i18n from "@utils/i18n";
import CardActions from './CardActions';

interface IssueCardActionProps {
  accountId: number;
  onSuccess: () => void;
}

const IssueCardAction = (props: IssueCardActionProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [error, setError] = createSignal('');
  const [pin, setPin] = createSignal('');
  const [confirmPin, setConfirmPin] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  
  const config = useConfig();
  const cost = () => config()?.cards.cost ?? 0;
  const maxCards = () => config()?.cards.maxCardsPerAccount ?? 0;
  
  const accountCards = createMemo(() => cards().filter((card) => card.accountId === props.accountId));
  const selectedAccount = createMemo(() => accounts().find((acc) => acc.id === props.accountId));
  const isAffordable = () => (selectedAccount()?.balance ?? 0) >= cost();

  const handleClose = () => {
    setError('');
    setIsLoading(false);
    setIsOpen(false);
    setPin('');
    setConfirmPin('');
  };

  const handleOrderCard = async () => {
    if (confirmPin() !== pin()) {
      setError(i18n.t('Verification failure: PINs do not match.'));
      return;
    }

    if (pin().length !== 4) {
      setError(i18n.t('Invalid credential length: 4 digits required.'));
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const account = selectedAccount();
      if (!account) {
        setError(i18n.t('Invalid Entity: Please select a valid origin for liquidation.'));
        setIsLoading(false);
        return;
      }

      const accountRole = account.role;
      if (accountRole !== AccountRole.Admin && accountRole !== AccountRole.Owner) {
        setError(i18n.t('Authorization Restricted: Inadequate clearance Level.'));
        setIsLoading(false);
        return;
      }

      const cardEvent =
        account.type === AccountType.Personal ? CardEvents.OrderPersonal : CardEvents.OrderShared;

      const newCard = await fetchNui<Card, CreateCardInput>(cardEvent, {
        accountId: props.accountId,
        paymentAccountId: props.accountId,
        pin: Number.parseInt(pin(), 10),
      });

      if (!newCard) return;

      await updateCards(props.accountId);
      await refetchAccounts();
      props.onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message || i18n.t('Unknown error occurred.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Show when={accountCards().length < maxCards()}>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        class={cn(
          'flex flex-col items-center justify-center h-[160px] border-2 border-dashed transition-all duration-150 group',
          'border-[var(--gta-border)] text-[var(--gta-text-dim)] hover:border-[var(--gta-green)]/50 hover:bg-[var(--gta-green)]/5 hover:text-[var(--gta-green)] active:scale-95',
        )}
      >
        <div class='w-10 h-10 bg-[var(--gta-surface)] border border-[var(--gta-border)] flex items-center justify-center mb-3 group-hover:border-[var(--gta-green)]/30 transition-colors'>
          <Plus size={20} class='opacity-40 group-hover:opacity-100' />
        </div>
        <Typography variant='pre' class='text-[10px] font-bold uppercase tracking-[0.15em]'>
          {i18n.t('Issue credential')}
        </Typography>
      </button>

      <Modal isOpen={isOpen()} onClose={handleClose} title={i18n.t('Credential Issuance')} maxWidth='xl'>
        <div class='flex flex-col gap-8'>
          <div class='grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8'>
            <div class='flex flex-col gap-6'>
              <div class='flex flex-col gap-3'>
                <Typography variant='label' class='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] px-0.5'>
                  {i18n.t('Biometric Override / PIN')}
                </Typography>
                <div class='grid grid-cols-2 gap-3'>
                  <input
                    type='password'
                    maxLength={4}
                    placeholder='••••'
                    value={pin()}
                    onInput={(e) => setPin(e.currentTarget.value)}
                    class='w-full h-14 bg-[var(--gta-surface)] border border-[var(--gta-border)] px-6 text-2xl tracking-[0.5em] font-bold text-[var(--gta-text)] focus:outline-none focus:border-[var(--gta-green)] focus:shadow-[0_0_8px_var(--gta-green-glow)] transition-all text-center placeholder:text-[var(--gta-text-dim)]'
                  />
                  <input
                    type='password'
                    maxLength={4}
                    placeholder='••••'
                    value={confirmPin()}
                    onInput={(e) => setConfirmPin(e.currentTarget.value)}
                    class='w-full h-14 bg-[var(--gta-surface)] border border-[var(--gta-border)] px-6 text-2xl tracking-[0.5em] font-bold text-[var(--gta-text)] focus:outline-none focus:border-[var(--gta-green)] focus:shadow-[0_0_8px_var(--gta-green-glow)] transition-all text-center placeholder:text-[var(--gta-text-dim)]'
                  />
                </div>
                <Typography
                  variant='pre'
                  class='text-[9px] text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] text-center mt-1'
                >
                  {i18n.t('Security protocol: Dual verification required')}
                </Typography>
              </div>

              <div class='p-5 bg-[var(--gta-panel)] border border-[var(--gta-border)] flex flex-col gap-2 relative'>
                <div class='absolute top-0 left-0 right-0 h-[2px] bg-[var(--gta-green)]' />
                <Typography variant='pre' class='text-[10px] font-bold text-[var(--gta-text-dim)] uppercase tracking-[0.15em]'>
                  {i18n.t('Origin Entity')}
                </Typography>
                <Typography class='text-lg font-bold uppercase text-[var(--gta-text)] leading-none'>
                  {selectedAccount()?.accountName}
                </Typography>
                <Typography variant='pre' class='text-[10px] font-bold text-[var(--gta-text-dim)] mt-1'>
                  {selectedAccount()?.number}
                </Typography>
              </div>
            </div>

            <div class='flex flex-col gap-3'>
              <Typography variant='label' class='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] px-0.5'>
                {i18n.t('Liquidation Summary')}
              </Typography>
              <Summary balance={selectedAccount()?.balance ?? 0} payment={cost()} />
            </div>
          </div>

          <div class='flex flex-col gap-4'>
            <Show when={error()}>
              <div class='flex items-center gap-3 p-4 border bg-[var(--gta-red)]/10 border-[var(--gta-red)]/30'>
                <AlertCircle size={16} class='shrink-0 text-[var(--gta-red)]' />
                <Typography variant='pre' class='text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--gta-red)] leading-relaxed'>
                  {error()}
                </Typography>
              </div>
            </Show>

            <div class='flex justify-end gap-2 pt-4 border-t border-[var(--gta-border)]'>
              <Button variant='secondary' onClick={handleClose}>
                {i18n.t('Abort Protocol')}
              </Button>
              <Button onClick={handleOrderCard} disabled={isLoading() || !isAffordable()}>
                {isLoading() ? i18n.t('Executing...') : i18n.t('Authorize Issuance')}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </Show>
  );
};

const BankCards = (props: { accountId: number; selectedCardId: number; onSelectCardId(id: number): void }) => {
  const accountCards = createMemo(() => cards().filter((card) => card.accountId === props.accountId));

  createEffect(() => {
    updateCards(props.accountId);
  });

  const selectedCard = () => accountCards().find((c) => c.id === props.selectedCardId);

  return (
    <div class='flex flex-col lg:flex-row gap-6'>
      <div class='flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 auto-rows-min'>
        <For each={accountCards()}>
          {(card) => (
            <button
              type='button'
              onClick={() => props.onSelectCardId(props.selectedCardId === card.id ? 0 : card.id)}
              class='text-left w-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--gta-green)]/50 rounded-lg transition-all'
            >
              <BankCard card={card} selected={props.selectedCardId === card.id} />
            </button>
          )}
        </For>

        <IssueCardAction accountId={props.accountId} onSuccess={() => updateCards(props.accountId)} />

        <Show when={accountCards().length === 0}>
          <div class='col-span-full py-16 flex flex-col items-center justify-center bg-[var(--gta-panel)] border border-dashed border-[var(--gta-border)] opacity-40 gap-3'>
            <ShieldEllipsis size={40} class='text-[var(--gta-text-dim)]' />
            <Typography
              variant='pre'
              class='text-[10px] font-bold text-[var(--gta-text-dim)] uppercase tracking-[0.15em] text-center leading-relaxed'
            >
              {i18n.t('No credentials issued for this entity.')}
              <br />
              {i18n.t('Authorization required to proceed.')}
            </Typography>
          </div>
        </Show>
      </div>

      <Show when={props.selectedCardId !== 0 && selectedCard()}>
        <div class='lg:w-[300px] shrink-0'>
          <div class='p-5 bg-[var(--gta-panel)] border border-[var(--gta-border)] sticky top-4'>
            <div class='flex items-center gap-2 mb-6 pb-3 border-b border-[var(--gta-border)]'>
              <ShieldCheck size={16} class='text-[var(--gta-green)]' />
              <Typography variant='h4' class='text-[var(--gta-text)] font-bold uppercase tracking-[0.1em] text-xs'>
                {i18n.t('Management')}
              </Typography>
            </div>
            <CardActions
              isBlocked={selectedCard()?.isBlocked}
              cardId={props.selectedCardId}
              onBlock={() => {
                updateCards(props.accountId);
                props.onSelectCardId(0);
              }}
              onUnblock={() => {
                updateCards(props.accountId);
                props.onSelectCardId(0);
              }}
              onDelete={() => {
                updateCards(props.accountId);
                props.onSelectCardId(0);
              }}
            />
          </div>
        </div>
      </Show>
    </div>
  );
};

export default BankCards;
