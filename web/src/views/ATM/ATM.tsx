// web/src/views/ATM/ATM.tsx
import { PIN_CODE_LENGTH } from "@common/constants";
import BankCard from "@components/BankCard";
import Button from "@components/ui/Button";
import PinField from "@components/ui/Fields/PinField";
import { Typography } from "@components/ui/Typography";
import { accounts, refetchAccounts, defaultAccount } from "@data/accounts";
import { refetchTransactions } from "@data/transactions";
import { useConfig } from "@hooks/useConfig";
import { useExitListener } from "@hooks/useExitListener";
import { useKeyDown } from "@hooks/useKeyPress";
import { useNuiEvent } from "@hooks/useNuiEvent";
import type { ATMInput, Account, GetATMAccountInput } from "@typings/Account";
import type { Card, InventoryCard } from "@typings/BankCard";
import { CardErrors } from "@typings/Errors";
import { AccountEvents, CardEvents } from "@typings/Events";
import { cn } from "@utils/cn";
import { defaultWithdrawOptions } from "@utils/constants";
import { formatMoney } from "@utils/currency";
import { fetchNui } from "@utils/fetchNui";
import { AlertCircle, ChevronLeft, CreditCard, Loader2, ShieldCheck } from 'lucide-solid';
import { createSignal, createMemo, Show, For, onMount, createEffect } from 'solid-js';
import { AnimatePresence, motion } from "motion-solid";
import i18n from "@utils/i18n";

type BankState = 'select-card' | 'enter-pin' | 'withdraw';

const ATM = () => {
  const config = useConfig();
  const isCardsEnabled = () => config()?.frameworkIntegration?.isCardsEnabled;
  
  const [error, setError] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [account, setAccount] = createSignal<Account>();
  const [isOpen, setIsOpen] = createSignal(false);

  useNuiEvent('setVisibleATM', (data) => setIsOpen(data as boolean));
  
  const initialStatus = createMemo<BankState>(() => (isCardsEnabled() ? 'select-card' : 'withdraw'));

  const [selectedCard, setSelectedCard] = createSignal<InventoryCard>();
  const [cards, setCards] = createSignal<InventoryCard[]>([]);
  const [state, setState] = createSignal<BankState>('select-card');

  // Sync state with initialStatus when it changes (e.g. config loads)
  createEffect(() => {
      setState(initialStatus());
  });

  const [pin, setPin] = createSignal('');

  useExitListener(() => state() === 'withdraw' || state() === initialStatus());

  const withdrawOptions = () => config()?.atms?.withdrawOptions ?? defaultWithdrawOptions;

  const handleClose = () => {
    setError('');
    setPin('');
    setAccount(undefined);
    setState(initialStatus());
  };

  const handleBack = () => {
    setError('');
    setPin('');
    if (state() === 'enter-pin') {
      setState('select-card');
    }
  };

  useKeyDown(['Escape'], handleBack);

  createEffect(() => {
    if (!isOpen()) {
      handleClose();
      return;
    }

    const updateCards = async () => {
      try {
        const cardsResponse = await fetchNui<InventoryCard[]>(CardEvents.GetInventoryCards);
        if (!cardsResponse) {
          throw new Error('No cards available');
        }
        setCards(cardsResponse);
      } catch (err: any) {
        setError(err.message || i18n.t('Something went wrong, please try again later.'));
      }
    };
    
    if (isCardsEnabled() && isOpen()) {
        updateCards();
    }
  });

  const handleUpdateBalance = async () => {
    setError('');
    const response = await fetchNui<{ account: Account; card: Card }, GetATMAccountInput>(
      AccountEvents.GetAtmAccount,
      {
        cardId: selectedCard()?.id ?? 0,
        pin: Number.parseInt(pin(), 10),
      }
    );

    if (!response) return;

    const { card, account: acc } = response;
    setSelectedCard(card);
    setAccount(acc);
  };

  const handleWithdraw = async (amount: number) => {
    const withdrawAccount = isCardsEnabled() ? account() : defaultAccount();
    if (!withdrawAccount) return;

    const accountId = withdrawAccount.id;

    const payload: ATMInput = isCardsEnabled()
      ? {
          amount,
          cardId: selectedCard()?.id,
          cardPin: Number.parseInt(pin(), 10),
          accountId,
          message: i18n.t('Withdrew {{amount}} from an ATM with card {{cardNumber}}.', {
            amount,
            cardNumber: selectedCard()?.number ?? 'unknown',
          }),
        }
      : {
          amount,
          accountId,
          message: i18n.t('Withdrew {{amount}} from an ATM.', {
            amount,
          }),
        };

    setIsLoading(true);

    try {
      setError('');
      await fetchNui(AccountEvents.WithdrawMoney, payload);
      await Promise.all([handleUpdateBalance(), refetchAccounts(), refetchTransactions()]);
    } catch (err: any) {
      if (err.message === CardErrors.InvalidPin) {
        setError(i18n.t('Invalid pin'));
      } else if (err.message === CardErrors.Blocked) {
        setError(i18n.t('The card is blocked'));
      } else {
        setError(err.message || i18n.t('Something went wrong, please try again later.'));
      }
    }

    setIsLoading(false);
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    if (!isCardsEnabled()) return;

    if (pin().length === PIN_CODE_LENGTH && selectedCard()?.id) {
      try {
        setError('');
        const response = await fetchNui<{ account: Account; card: Card }, GetATMAccountInput>(
          AccountEvents.GetAtmAccount,
          {
            cardId: selectedCard()?.id ?? 0,
            pin: Number.parseInt(pin(), 10),
          }
        );

        if (!response) return;

        const { card, account: acc } = response;
        setSelectedCard(card);
        setAccount(acc);
        setState('withdraw');
      } catch (err: any) {
        if (err.message === CardErrors.InvalidPin) {
          setError(i18n.t('Invalid pin'));
        } else if (err.message === CardErrors.Blocked) {
          setError(i18n.t('The card is blocked'));
        } else {
          setError(err.message || i18n.t('Something went wrong, please try again later.'));
        }
      }
    }
  };

  const handleSelectCard = (card: InventoryCard) => {
    setSelectedCard(card);
    setState('enter-pin');
  };

  const accountBalance = () => isCardsEnabled() ? (account()?.balance ?? 0) : (defaultAccount()?.balance ?? 0);

  return (
    <Show when={isOpen()}>
      <div class='fixed inset-0 z-[100] flex items-center justify-center bg-black/80'>
        <AnimatePresence mode="wait">
          <motion.div
            key={state()}
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.05, opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            class={cn(
              'relative w-full max-w-md p-8 overflow-hidden',
              'bg-[var(--gta-dark)] border border-[var(--gta-border)] shadow-[0_0_60px_rgba(0,0,0,0.8)]',
              'flex flex-col gap-6',
            )}
          >
            {/* Primary top accent */}
            <div class='absolute top-0 left-0 right-0 h-[2px] bg-primary' />

            {/* Scanline overlay */}
            <div class='absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] z-50 bg-[length:100%_3px]' />

            <Show when={state() !== initialStatus()}>
              <button
                type='button'
                onClick={handleBack}
                class='absolute top-8 left-8 p-2 text-text-muted hover:text-primary hover:bg-bg-panel transition-all active:scale-95 z-[60]'
              >
                <ChevronLeft size={16} />
              </button>
            </Show>

            <div class='flex flex-col gap-2 text-center relative z-[60] pt-2'>
              <div class='flex items-center justify-center gap-2 mb-1'>
                <div class='h-[1px] w-6 bg-primary/30' />
                <Typography variant='pre' class='text-primary font-bold uppercase tracking-[0.2em] text-[9px] font-mono'>
                  {state() === 'select-card' ? i18n.t('ATM HARDWARE TERMINAL V4') : i18n.t('ENCRYPTED LINK ESTABLISHED')}
                </Typography>
                <div class='h-[1px] w-6 bg-primary/30' />
              </div>
              <Typography variant='h1' class='text-2xl font-display font-black tracking-tight'>
                {state() === 'select-card' ? i18n.t('INSERT CARD') : state() === 'enter-pin' ? i18n.t('AUTHORIZATION') : i18n.t('MAIN MENU')}
              </Typography>
            </div>

            <div class='relative z-[60] flex flex-col gap-4'>
              <Show when={state() === 'select-card'}>
                <div class='flex flex-col gap-2 py-2 max-h-[350px] overflow-y-auto no-scrollbar custom-scrollbar'>
                  <For each={cards()}>
                    {(card) => (
                      <button
                        type='button'
                        onClick={() => handleSelectCard(card)}
                        class='w-full transition-all duration-150 text-left focus:outline-none focus:ring-1 focus:ring-[var(--gta-green)]'
                      >
                        <BankCard card={card} />
                      </button>
                    )}
                  </For>
                  <Show when={cards().length === 0}>
                    <div class='flex flex-col items-center gap-3 py-12 px-6 bg-[var(--gta-panel)] border border-dashed border-[var(--gta-border)]'>
                      <CreditCard size={28} class='text-[var(--gta-text-dim)]' />
                      <Typography class='text-[var(--gta-text-dim)] text-sm font-medium text-center'>
                        {i18n.t('No valid bank cards detected in proximity.')}
                      </Typography>
                    </div>
                  </Show>
                </div>
              </Show>

              <Show when={state() === 'enter-pin'}>
                <form onSubmit={handleSubmit} class='flex flex-col gap-8 py-2'>
                  <div class='flex flex-col items-center gap-6'>
                    <div class='p-4 bg-[var(--gta-panel)] border border-[var(--gta-border)] w-full flex flex-col items-center gap-1'>
                      <Typography class='text-xs font-bold text-[var(--gta-text-dim)] font-mono tracking-[0.15em]'>
                        {selectedCard()?.number}
                      </Typography>
                      <Typography class='text-[10px] uppercase font-bold text-[var(--gta-text)] tracking-[0.2em]'>
                        {selectedCard()?.holder}
                      </Typography>
                    </div>
                    <div class='flex flex-col items-center gap-3 w-full'>
                      <div class='flex items-center gap-1.5 mb-1'>
                        <ShieldCheck size={12} class='text-[var(--gta-green)]' />
                        <Typography variant='label' class='text-[var(--gta-text-dim)]'>
                          {i18n.t('Secure Input Field')}
                        </Typography>
                      </div>
                      <PinField value={pin()} onChange={(e) => setPin(e.target.value)} isLoading={isLoading()} />
                    </div>
                  </div>
                  <Button type='submit' size='lg' variant='primary' class='w-full'>
                    {i18n.t('Establish Session')}
                  </Button>
                </form>
              </Show>

              <Show when={state() === 'withdraw'}>
                <div class='flex flex-col gap-6'>
                  <div class='p-6 bg-bg-panel border border-border-main flex flex-col items-center gap-3 cursor-default relative shadow-premium'>
                    <div class='absolute top-0 left-0 right-0 h-[2px] bg-primary' />
                    <Typography
                      variant='label'
                      class='text-text-muted uppercase font-bold tracking-[0.2em] font-mono'
                    >
                      {i18n.t('VERIFIED BALANCE')}
                    </Typography>
                    <Typography class='text-4xl font-display font-black text-primary leading-none'>
                      {formatMoney(accountBalance(), config()?.general)}
                    </Typography>
                  </div>

                  <div class='grid grid-cols-2 gap-2'>
                    <For each={withdrawOptions()}>
                      {(value) => (
                        <Button
                          variant={value > accountBalance() ? 'ghost' : 'secondary'}
                          onClick={() => handleWithdraw(value)}
                          disabled={value > accountBalance() || isLoading()}
                          class={cn(
                            'h-14 text-sm font-bold uppercase tracking-wide relative overflow-hidden',
                            value > accountBalance() ? 'opacity-20 grayscale' : 'hover:border-[var(--gta-green)]/50',
                          )}
                        >
                          <Show when={isLoading() && value > 0} fallback={
                            <span class='text-[var(--gta-text)]'>{formatMoney(value, config()?.general)}</span>
                          }>
                            <Loader2 size={16} class='animate-spin text-[var(--gta-green)]' />
                          </Show>
                        </Button>
                      )}
                    </For>
                  </div>
                </div>
              </Show>
            </div>

            <Show when={error()}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                class='relative z-[60] p-4 bg-[var(--gta-red)]/10 border border-[var(--gta-red)]/30 flex items-center gap-3'
              >
                <div class='w-8 h-8 bg-[var(--gta-red)]/20 flex items-center justify-center shrink-0'>
                  <AlertCircle size={16} class='text-[var(--gta-red)]' />
                </div>
                <div class='flex flex-col'>
                  <Typography variant='pre' class='text-[var(--gta-red)] font-bold uppercase tracking-[0.15em] text-[9px]'>
                    {i18n.t('Security Alert')}
                  </Typography>
                  <Typography class='text-xs font-bold text-[var(--gta-red)]/80'>{error()}</Typography>
                </div>
              </motion.div>
            </Show>
          </motion.div>
        </AnimatePresence>
      </div>
    </Show>
  );
};

export default ATM;
