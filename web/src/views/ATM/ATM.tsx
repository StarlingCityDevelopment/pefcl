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
import { AlertCircle, ChevronLeft, Loader2, ShieldCheck, CreditCard } from 'lucide-react';
import type { ATMInput, Account, GetATMAccountInput } from '@typings/Account';
import type { Card, InventoryCard } from '@typings/BankCard';
import { CardErrors } from '@typings/Errors';
import { AccountEvents, CardEvents } from '@typings/Events';
import { defaultWithdrawOptions } from '@utils/constants';
import { formatMoney } from '@utils/currency';
import { fetchNui } from '@utils/fetchNui';
import { useAtom, useAtomValue } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';
import React, { type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@utils/cn';

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

 useNuiEvent('PEFCL', 'setVisibleATM', (data) => setIsOpen(data as boolean));
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
 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
 <AnimatePresence mode="wait">
 <motion.div
 key={state}
 initial={{ scale: 0.9, opacity: 0, y: 20 }}
 animate={{ scale: 1, opacity: 1, y: 0 }}
 exit={{ scale: 1.1, opacity: 0, y: -20 }}
 transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
 className={cn(
 "relative w-full max-w-lg p-10 rounded-[3rem] overflow-hidden",
 "bg-[#0a0a0b] border border-white/10 -[0_60px_120px_-20px_rgba(0,0,0,1)]",
 "flex flex-col gap-8"
 )}
 >
 {/* Hardware Scan-line Overlay */}
 <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-50 bg-[length:100%_2px,3px_100%]" />
 
 {state !== initialStatus && (
 <button 
 onClick={handleBack}
 className="absolute top-10 left-10 p-3 rounded-2xl text-slate-500 hover:text-white hover:bg-white/10 transition-all active:scale-95 z-[60]"
 >
 <ChevronLeft className="w-5 h-5" />
 </button>
 )}

 <div className="flex flex-col gap-2 text-center relative z-[60] pt-4">
 <div className="flex items-center justify-center gap-2 mb-2">
 <div className="h-[1px] w-8 bg-white/10" />
 <Typography variant="pre" className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
 {state === 'select-card' ? t('ATM Hardware Terminal V4') : t('Encrypted Link Established')}
 </Typography>
 <div className="h-[1px] w-8 bg-white/10" />
 </div>
 <Typography variant="h1" className="text-4xl font-bold tracking-tight">
 {state === 'select-card' ? t('Insert Card') : state === 'enter-pin' ? t('Authorization') : t('Main Menu')}
 </Typography>
 </div>

 <div className="relative z-[60] flex flex-col gap-6">
 {state === 'select-card' && (
 <div className="flex flex-col gap-4 py-4 max-h-[400px] overflow-y-auto no-scrollbar custom-scrollbar">
 {cards.map((card) => (
 <div 
 key={card.number} 
 onClick={() => handleSelectCard(card)}
 className="w-full transition-all duration-300"
 >
 <BankCard card={card} />
 </div>
 ))}
 {cards.length === 0 && (
 <div className="flex flex-col items-center gap-4 py-16 px-8 rounded-[2rem] bg-white/[0.01] border border-white/5 border-dashed">
 <CreditCard className="w-8 h-8 text-slate-700" />
 <Typography className="text-slate-500 text-sm font-medium italic text-center opacity-60">
 {t('No valid bank cards detected in proximity.')}
 </Typography>
 </div>
 )}
 </div>
 )}

 {state === 'enter-pin' && (
 <form onSubmit={handleSubmit} className="flex flex-col gap-10 py-4">
 <div className="flex flex-col items-center gap-8">
 <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 w-full flex flex-col items-center gap-1 ">
 <Typography className="text-xs font-bold text-white/40 font-mono tracking-widest">{selectedCard?.number}</Typography>
 <Typography className="text-[10px] uppercase font-bold text-white tracking-widest">{selectedCard?.holder}</Typography>
 </div>
 <div className="flex flex-col items-center gap-4 w-full">
 <div className="flex items-center gap-2 mb-2">
 <ShieldCheck className="w-3 h-3 text-slate-600" />
 <Typography variant="label" className="text-slate-600">{t('Secure Input Field')}</Typography>
 </div>
 <PinField value={pin} onChange={(event) => setPin(event.target.value)} />
 </div>
 </div>
 <Button type="submit" size="xl" variant="primary" className="w-full">
 {t('Establish Session')}
 </Button>
 </form>
 )}

 {state === 'withdraw' && (
 <div className="flex flex-col gap-10">
 <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex flex-col items-center gap-2 group cursor-default">
 <Typography variant="label" className="text-slate-500 group-hover:text-white/40 transition-colors uppercase font-bold tracking-widest">
 {t('Verified Balance')}
 </Typography>
 <Typography className="text-5xl font-bold text-white tracking-tight leading-none group-hover:scale-105 transition-transform duration-500">
 {formatMoney(accountBalance, config.general)}
 </Typography>
 </div>

 <div className="grid grid-cols-2 gap-4">
 {withdrawOptions.map((value) => (
 <Button
 key={value}
 variant={value > accountBalance ? "ghost" : "secondary"}
 onClick={() => handleWithdraw(value)}
 disabled={value > accountBalance || isLoading}
 className={cn(
 "h-16 rounded-[1.5rem] text-[15px] font-bold uppercase tracking-tight relative overflow-hidden",
 value > accountBalance ? "opacity-20 translate-y-1 grayscale" : "hover:border-white/40"
 )}
 >
 {isLoading && value > 0 ? (
 <Loader2 className="w-5 h-5 animate-spin text-white" />
 ) : (
 <div className="flex flex-col items-center gap-0.5">
 <span className="text-white">{formatMoney(value, config.general)}</span>
 </div>
 )}
 </Button>
 ))}
 </div>
 </div>
 )}
 </div>

 {error && (
 <motion.div 
 initial={{ opacity: 0, y: 10, scale: 0.95 }} 
 animate={{ opacity: 1, y: 0, scale: 1 }}
 className="relative z-[60] p-5 rounded-[1.5rem] bg-red-500/10 border border-red-500/20 flex items-center gap-4"
 >
 <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 -500/20">
 <AlertCircle className="w-5 h-5 text-red-400" />
 </div>
 <div className="flex flex-col">
 <Typography variant="pre" className="text-red-500 font-bold uppercase tracking-widest text-[10px]">{t('Security Alert')}</Typography>
 <Typography className="text-xs font-bold text-red-500/80">{error}</Typography>
 </div>
 </motion.div>
 )}
 </motion.div>
 </AnimatePresence>
 </div>
 );
};

export default ATM;
