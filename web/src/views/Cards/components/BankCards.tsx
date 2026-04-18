import AccountSelect from '@components/AccountSelect';
import BankCard from '@components/BankCard';
import Summary from '@components/Summary';
import Button from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { Typography } from '@components/ui/Typography';
import { accountsAtom } from '@data/accounts';
import { cardsAtom } from '@data/cards';
import { useConfig } from '@hooks/useConfig';
import { AccountRole, AccountType } from '@typings/Account';
import type { Card, CreateCardInput } from '@typings/BankCard';
import { CardEvents } from '@typings/Events';
import { cn } from '@utils/cn';
import { fetchNui } from '@utils/fetchNui';
import { useAtom, useAtomValue } from 'jotai';
import { AlertCircle, Info, Plus, ShieldCheck, ShieldEllipsis } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CardActions from './CardActions';

interface IssueCardActionProps {
  accountId: number;
  onSuccess: () => void;
}

const IssueCardAction = ({ accountId, onSuccess }: IssueCardActionProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, updateAccounts] = useAtom(accountsAtom);
  const [, updateCards] = useAtom(cardsAtom);
  const config = useConfig();
  const { cost, maxCardsPerAccount } = config.cards;
  const allCards = useAtomValue(cardsAtom);
  const cards = allCards.filter((card) => card.accountId === accountId);

  const selectedAccount = accounts.find((acc) => acc.id === accountId);
  const isAffordable = (selectedAccount?.balance ?? 0) >= cost;

  const handleClose = () => {
    setError('');
    setIsLoading(false);
    setIsOpen(false);
    setPin('');
    setConfirmPin('');
  };

  const handleOrderCard = async () => {
    if (confirmPin !== pin) {
      setError(t('Verification failure: PINs do not match.'));
      return;
    }

    if (pin.length !== 4) {
      setError(t('Invalid credential length: 4 digits required.'));
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      if (!selectedAccount) {
        setError(t('Invalid Entity: Please select a valid origin for liquidation.'));
        setIsLoading(false);
        return;
      }

      const accountRole = selectedAccount.role;
      if (accountRole !== AccountRole.Admin && accountRole !== AccountRole.Owner) {
        setError(t('Authorization Restricted: Inadequate clearance Level.'));
        setIsLoading(false);
        return;
      }

      const cardEvent =
        selectedAccount.type === AccountType.Personal ? CardEvents.OrderPersonal : CardEvents.OrderShared;

      const newCard = await fetchNui<Card, CreateCardInput>(cardEvent, {
        accountId,
        paymentAccountId: accountId, // Defaulting to the same account for now
        pin: Number.parseInt(pin, 10),
      });

      if (!newCard) return;

      await updateCards(newCard);
      await updateAccounts();
      onSuccess();
      handleClose();
    } catch (error: any) {
      setError(error.message || t('Unknown error occurred.'));
    } finally {
      setIsLoading(false);
    }
  };

  if (cards.length >= maxCardsPerAccount) return null;

  return (
    <>
      <motion.button
        layout
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex flex-col items-center justify-center h-[180px] rounded-[2.5rem] border-2 border-dashed transition-all duration-300 group',
          'border-white/5 text-slate-600 hover:border-white/20 hover:bg-white/[0.02] hover:text-white active:scale-95',
        )}
      >
        <div className='w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors'>
          <Plus className='w-6 h-6 opacity-40 group-hover:opacity-100' />
        </div>
        <Typography variant='pre' className='text-[10px] font-bold uppercase tracking-widest'>
          {t('Issue credential')}
        </Typography>
      </motion.button>

      <Modal isOpen={isOpen} onClose={handleClose} title={t('Credential Issuance')} maxWidth='xl'>
        <div className='flex flex-col gap-10'>
          <div className='grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-12'>
            <div className='flex flex-col gap-8'>
              <div className='flex flex-col gap-3'>
                <Typography variant='label' className='text-slate-500 font-bold uppercase tracking-widest px-1'>
                  {t('Biometric Override / PIN')}
                </Typography>
                <div className='grid grid-cols-2 gap-4'>
                  <input
                    type='password'
                    maxLength={4}
                    placeholder='••••'
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className='w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-3xl tracking-[0.6em] font-bold text-white focus:outline-none focus:bg-white/[0.06] focus:border-white/20 transition-all text-center placeholder:text-white/10'
                  />
                  <input
                    type='password'
                    maxLength={4}
                    placeholder='••••'
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className='w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-3xl tracking-[0.6em] font-bold text-white focus:outline-none focus:bg-white/[0.06] focus:border-white/20 transition-all text-center placeholder:text-white/10'
                  />
                </div>
                <Typography
                  variant='pre'
                  className='text-[9px] text-slate-600 font-bold uppercase tracking-widest text-center mt-2'
                >
                  {t('Security protocol: Dual verification required')}
                </Typography>
              </div>

              <div className='p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col gap-2'>
                <Typography variant='pre' className='text-[10px] font-bold text-white/40 uppercase tracking-widest'>
                  {t('Origin Entity')}
                </Typography>
                <Typography className='text-xl font-bold uppercase text-white leading-none'>
                  {selectedAccount?.accountName}
                </Typography>
                <Typography variant='pre' className='text-[10px] font-bold text-slate-600 mt-2'>
                  {selectedAccount?.number}
                </Typography>
              </div>
            </div>

            <div className='flex flex-col gap-4'>
              <Typography variant='label' className='text-slate-500 font-bold uppercase tracking-widest px-1'>
                {t('Liquidation Summary')}
              </Typography>
              <Summary balance={selectedAccount?.balance ?? 0} payment={cost} />
            </div>
          </div>

          <div className='flex flex-col gap-6'>
            <AnimatePresence mode='wait'>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='flex items-center gap-4 p-5 rounded-2xl border bg-white/[0.02] border-white/10 text-white'
                >
                  <AlertCircle className='w-5 h-5 shrink-0 opacity-40' />
                  <Typography variant='pre' className='text-[10px] font-bold uppercase tracking-widest leading-relaxed'>
                    {error}
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>

            <div className='flex justify-end gap-3 pt-6 border-t border-white/[0.05]'>
              <Button variant='secondary' onClick={handleClose} className='px-8 h-12 rounded-xl'>
                {t('Abort Protocol')}
              </Button>
              <Button onClick={handleOrderCard} disabled={isLoading || !isAffordable} className='px-10 h-12 rounded-xl'>
                {isLoading ? t('Executing...') : t('Authorize Issuance')}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const BankCards = ({
  onSelectCardId,
  selectedCardId,
  accountId,
}: { accountId: number; selectedCardId: number; onSelectCardId(id: number): void }) => {
  const { t } = useTranslation();
  const allCards = useAtomValue(cardsAtom);
  const [, updateCards] = useAtom(cardsAtom);

  const cards = allCards.filter((card) => card.accountId === accountId);

  useEffect(() => {
    updateCards(accountId);
  }, [accountId, updateCards]);

  return (
    <>
      <div className='flex flex-col lg:flex-row gap-8'>
        <div className='flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-min'>
          <AnimatePresence mode='popLayout'>
            {cards.map((card) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={card.id}
                onClick={() => onSelectCardId(selectedCardId === card.id ? 0 : card.id)}
                className='cursor-pointer'
              >
                <BankCard card={card} selected={selectedCardId === card.id} />
              </motion.div>
            ))}
          </AnimatePresence>

          <IssueCardAction accountId={accountId} onSuccess={() => updateCards(accountId)} />

          {cards.length === 0 && (
            <div className='col-span-full py-24 flex flex-col items-center justify-center bg-white/[0.01] border border-dashed border-white/5 rounded-[3.5rem] grayscale opacity-40 gap-4'>
              <ShieldEllipsis className='w-12 h-12 text-slate-500' />
              <Typography
                variant='pre'
                className='text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center leading-relaxed'
              >
                {t('No credentials issued for this entity.')}
                <br />
                {t('Authorization required to proceed.')}
              </Typography>
            </div>
          )}
        </div>

        <AnimatePresence>
          {selectedCardId !== 0 && cards.find((c) => c.id === selectedCardId) && (
            <motion.div
              initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 40, filter: 'blur(10px)' }}
              className='lg:w-[340px] shrink-0'
            >
              <div className='p-8 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-md sticky top-8'>
                <div className='flex items-center gap-3 mb-8 px-1'>
                  <ShieldCheck className='w-5 h-5 text-white/40' />
                  <Typography variant='h3' className='text-white font-bold uppercase leading-none text-lg'>
                    {t('Management')}
                  </Typography>
                </div>
                <CardActions
                  isBlocked={cards.find((c) => c.id === selectedCardId)?.isBlocked}
                  cardId={selectedCardId}
                  onBlock={() => {
                    updateCards(accountId);
                    onSelectCardId(0);
                  }}
                  onUnblock={() => {
                    updateCards(accountId);
                    onSelectCardId(0);
                  }}
                  onDelete={() => {
                    updateCards(accountId);
                    onSelectCardId(0);
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default BankCards;
