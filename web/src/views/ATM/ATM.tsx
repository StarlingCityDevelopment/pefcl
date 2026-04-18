import { PIN_CODE_LENGTH } from '@common/constants';
import BankCard from '@components/BankCard';
import Button from '@components/ui/Button';
import PinField from '@components/ui/Fields/PinField';
import { Typography } from '@components/ui/Typography';
import { accountsAtom, defaultAccountAtom } from '@data/accounts';
import { transactionBaseAtom } from '@data/transactions';
import { useConfig } from '@hooks/useConfig';
import { useExitListener } from '@hooks/useExitListener';
import { useKeyDown } from '@hooks/useKeyPress';
import { useNuiEvent } from '@hooks/useNuiEvent';
import type { ATMInput, Account, GetATMAccountInput } from '@typings/Account';
import type { Card, InventoryCard } from '@typings/BankCard';
import { CardErrors } from '@typings/Errors';
import { AccountEvents, CardEvents } from '@typings/Events';
import { cn } from '@utils/cn';
import { defaultWithdrawOptions } from '@utils/constants';
import { formatMoney } from '@utils/currency';
import { fetchNui } from '@utils/fetchNui';
import { useAtom, useAtomValue } from 'jotai';
import { AlertCircle, ChevronLeft, CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type BankState = 'select-card' | 'enter-pin' | 'withdraw';

const ATM = () => {
  const { t } = useTranslation();
  const config = useConfig();
  const { isCardsEnabled } = config.frameworkIntegration;
  const defaultAccount = useAtomValue(defaultAccountAtom);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<Account>();
  const [isOpen, setIsOpen] = useState(false);

  useNuiEvent('setVisibleATM', (data) => setIsOpen(data as boolean));
  const initialStatus = React.useMemo<BankState>(() => (isCardsEnabled ? 'select-card' : 'withdraw'), [isCardsEnabled]);

  const [selectedCard, setSelectedCard] = useState<InventoryCard>();
  const [cards, setCards] = useState<InventoryCard[]>([]);
  const [state, setState] = useState<BankState>(initialStatus);
  const [pin, setPin] = useState('');

  useExitListener(state === 'withdraw' || state === initialStatus);

  const withdrawOptions = config?.atms?.withdrawOptions ?? defaultWithdrawOptions;

  const handleClose = React.useCallback(() => {
    setError('');
    setPin('');
    setAccount(undefined);
    setState(initialStatus);
  }, [initialStatus]);

  const handleBack = React.useCallback(() => {
    setError('');
    setPin('');
    if (state === 'enter-pin') {
      setState('select-card');
    }
  }, [state]);

  useKeyDown(['Escape'], handleBack);

  useEffect(() => {
    if (!isOpen) {
      handleClose();
    }

    const updateCards = async () => {
      try {
        const cardsResponse = await fetchNui<InventoryCard[]>(CardEvents.GetInventoryCards);
        if (!cardsResponse) {
          throw new Error('No cards available');
        }
        setCards(cardsResponse);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(t('Something went wrong, please try again later.'));
        }
      }
    };
    isCardsEnabled && isOpen && updateCards();
  }, [t, handleClose, isCardsEnabled, isOpen]);

  const input = {
    cardId: selectedCard?.id ?? 0,
    pin: Number.parseInt(pin, 10),
  };

  const handleUpdateBalance = async () => {
    setError('');
    const response = await fetchNui<{ account: Account; card: Card }, GetATMAccountInput>(
      AccountEvents.GetAtmAccount,
      input,
    );

    if (!response) {
      return;
    }

    const { card, account } = response;
    setSelectedCard(card);
    setAccount(account);
  };

  const [, updateAccounts] = useAtom(accountsAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);

  const handleWithdraw = async (amount: number) => {
    const withdrawAccount = isCardsEnabled ? account : defaultAccount;
    if (!withdrawAccount) {
      return;
    }

    const accountId = withdrawAccount.id;

    const payload: ATMInput = isCardsEnabled
      ? {
          amount,
          cardId: selectedCard?.id,
          cardPin: Number.parseInt(pin, 10),
          accountId,
          message: t('Withdrew {{amount}} from an ATM with card {{cardNumber}}.', {
            amount,
            cardNumber: selectedCard?.number ?? 'unknown',
          }),
        }
      : {
          amount,
          accountId,
          message: t('Withdrew {{amount}} from an ATM.', {
            amount,
          }),
        };

    setIsLoading(true);

    try {
      setError('');
      await fetchNui(AccountEvents.WithdrawMoney, payload);
      await Promise.all([handleUpdateBalance(), updateAccounts(), updateTransactions()]);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === CardErrors.InvalidPin) {
          setError(t('Invalid pin'));
        } else if (error.message === CardErrors.Blocked) {
          setError(t('The card is blocked'));
        } else {
          setError(error.message);
        }
      } else {
        setError(t('Something went wrong, please try again later.'));
      }
    }

    setIsLoading(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!isCardsEnabled) {
      return;
    }

    if (pin.length === PIN_CODE_LENGTH && selectedCard?.id) {
      try {
        setError('');
        const response = await fetchNui<{ account: Account; card: Card }, GetATMAccountInput>(
          AccountEvents.GetAtmAccount,
          input,
        );

        if (!response) {
          return;
        }

        const { card, account } = response;
        setSelectedCard(card);
        setAccount(account);
        setState('withdraw');
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === CardErrors.InvalidPin) {
            setError(t('Invalid pin'));
          } else if (error.message === CardErrors.Blocked) {
            setError(t('The card is blocked'));
          } else {
            setError(error.message);
          }
        } else {
          setError(t('Something went wrong, please try again later.'));
        }
      }
    }
  };

  const handleSelectCard = (card: InventoryCard) => {
    setSelectedCard(card);
    setState('enter-pin');
  };

  const accountBalance = isCardsEnabled ? (account?.balance ?? 0) : (defaultAccount?.balance ?? 0);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/80'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={state}
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 1.05, opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'relative w-full max-w-md p-8 overflow-hidden',
            'bg-[var(--gta-dark)] border border-[var(--gta-border)] shadow-[0_0_60px_rgba(0,0,0,0.8)]',
            'flex flex-col gap-6',
          )}
        >
          {/* GTA green top accent */}
          <div className='absolute top-0 left-0 right-0 h-[2px] bg-[var(--gta-green)]' />

          {/* Scanline overlay */}
          <div className='absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] z-50 bg-[length:100%_3px]' />

          {state !== initialStatus && (
            <button
              type='button'
              onClick={handleBack}
              className='absolute top-8 left-8 p-2 text-[var(--gta-text-dim)] hover:text-[var(--gta-green)] hover:bg-[var(--gta-surface)] transition-all active:scale-95 z-[60]'
            >
              <ChevronLeft className='w-4 h-4' />
            </button>
          )}

          <div className='flex flex-col gap-2 text-center relative z-[60] pt-2'>
            <div className='flex items-center justify-center gap-2 mb-1'>
              <div className='h-[1px] w-6 bg-[var(--gta-green)]/30' />
              <Typography variant='pre' className='text-[var(--gta-green)] font-bold uppercase tracking-[0.2em] text-[9px]'>
                {state === 'select-card' ? t('ATM Hardware Terminal V4') : t('Encrypted Link Established')}
              </Typography>
              <div className='h-[1px] w-6 bg-[var(--gta-green)]/30' />
            </div>
            <Typography variant='h1' className='text-2xl font-bold tracking-[0.15em]'>
              {state === 'select-card' ? t('Insert Card') : state === 'enter-pin' ? t('Authorization') : t('Main Menu')}
            </Typography>
          </div>

          <div className='relative z-[60] flex flex-col gap-4'>
            {state === 'select-card' && (
              <div className='flex flex-col gap-2 py-2 max-h-[350px] overflow-y-auto no-scrollbar custom-scrollbar'>
                {cards.map((card) => (
                  <button
                    key={card.id}
                    type='button'
                    onClick={() => handleSelectCard(card)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleSelectCard(card);
                      }
                    }}
                    className='w-full transition-all duration-150 text-left focus:outline-none focus:ring-1 focus:ring-[var(--gta-green)]'
                  >
                    <BankCard card={card} />
                  </button>
                ))}
                {cards.length === 0 && (
                  <div className='flex flex-col items-center gap-3 py-12 px-6 bg-[var(--gta-panel)] border border-dashed border-[var(--gta-border)]'>
                    <CreditCard className='w-7 h-7 text-[var(--gta-text-dim)]' />
                    <Typography className='text-[var(--gta-text-dim)] text-sm font-medium text-center'>
                      {t('No valid bank cards detected in proximity.')}
                    </Typography>
                  </div>
                )}
              </div>
            )}

            {state === 'enter-pin' && (
              <form onSubmit={handleSubmit} className='flex flex-col gap-8 py-2'>
                <div className='flex flex-col items-center gap-6'>
                  <div className='p-4 bg-[var(--gta-panel)] border border-[var(--gta-border)] w-full flex flex-col items-center gap-1'>
                    <Typography className='text-xs font-bold text-[var(--gta-text-dim)] font-mono tracking-[0.15em]'>
                      {selectedCard?.number}
                    </Typography>
                    <Typography className='text-[10px] uppercase font-bold text-[var(--gta-text)] tracking-[0.2em]'>
                      {selectedCard?.holder}
                    </Typography>
                  </div>
                  <div className='flex flex-col items-center gap-3 w-full'>
                    <div className='flex items-center gap-1.5 mb-1'>
                      <ShieldCheck className='w-3 h-3 text-[var(--gta-green)]' />
                      <Typography variant='label' className='text-[var(--gta-text-dim)]'>
                        {t('Secure Input Field')}
                      </Typography>
                    </div>
                    <PinField value={pin} onChange={(event) => setPin(event.target.value)} />
                  </div>
                </div>
                <Button type='submit' size='lg' variant='primary' className='w-full'>
                  {t('Establish Session')}
                </Button>
              </form>
            )}

            {state === 'withdraw' && (
              <div className='flex flex-col gap-6'>
                <div className='p-6 bg-[var(--gta-panel)] border border-[var(--gta-border)] flex flex-col items-center gap-2 cursor-default relative'>
                  <div className='absolute top-0 left-0 right-0 h-[2px] bg-[var(--gta-green)]' />
                  <Typography
                    variant='label'
                    className='text-[var(--gta-text-dim)] uppercase font-bold tracking-[0.2em]'
                  >
                    {t('Verified Balance')}
                  </Typography>
                  <Typography className='text-4xl font-bold text-[var(--gta-green)] leading-none'>
                    {formatMoney(accountBalance, config.general)}
                  </Typography>
                </div>

                <div className='grid grid-cols-2 gap-2'>
                  {withdrawOptions.map((value) => (
                    <Button
                      key={value}
                      variant={value > accountBalance ? 'ghost' : 'secondary'}
                      onClick={() => handleWithdraw(value)}
                      disabled={value > accountBalance || isLoading}
                      className={cn(
                        'h-14 text-sm font-bold uppercase tracking-wide relative overflow-hidden',
                        value > accountBalance ? 'opacity-20 grayscale' : 'hover:border-[var(--gta-green)]/50',
                      )}
                    >
                      {isLoading && value > 0 ? (
                        <Loader2 className='w-4 h-4 animate-spin text-[var(--gta-green)]' />
                      ) : (
                        <span className='text-[var(--gta-text)]'>{formatMoney(value, config.general)}</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className='relative z-[60] p-4 bg-[var(--gta-red)]/10 border border-[var(--gta-red)]/30 flex items-center gap-3'
            >
              <div className='w-8 h-8 bg-[var(--gta-red)]/20 flex items-center justify-center shrink-0'>
                <AlertCircle className='w-4 h-4 text-[var(--gta-red)]' />
              </div>
              <div className='flex flex-col'>
                <Typography variant='pre' className='text-[var(--gta-red)] font-bold uppercase tracking-[0.15em] text-[9px]'>
                  {t('Security Alert')}
                </Typography>
                <Typography className='text-xs font-bold text-[var(--gta-red)]/80'>{error}</Typography>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ATM;
