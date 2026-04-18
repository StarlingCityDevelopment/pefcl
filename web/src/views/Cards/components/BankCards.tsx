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
        paymentAccountId: accountId,
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
          'flex flex-col items-center justify-center h-[160px] border-2 border-dashed transition-all duration-150 group',
          'border-[var(--gta-border)] text-[var(--gta-text-dim)] hover:border-[var(--gta-green)]/50 hover:bg-[var(--gta-green)]/5 hover:text-[var(--gta-green)] active:scale-95',
        )}
      >
        <div className='w-10 h-10 bg-[var(--gta-surface)] border border-[var(--gta-border)] flex items-center justify-center mb-3 group-hover:border-[var(--gta-green)]/30 transition-colors'>
          <Plus className='w-5 h-5 opacity-40 group-hover:opacity-100' />
        </div>
        <Typography variant='pre' className='text-[10px] font-bold uppercase tracking-[0.15em]'>
          {t('Issue credential')}
        </Typography>
      </motion.button>

      <Modal isOpen={isOpen} onClose={handleClose} title={t('Credential Issuance')} maxWidth='xl'>
        <div className='flex flex-col gap-8'>
          <div className='grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8'>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col gap-3'>
                <Typography variant='label' className='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] px-0.5'>
                  {t('Biometric Override / PIN')}
                </Typography>
                <div className='grid grid-cols-2 gap-3'>
                  <input
                    type='password'
                    maxLength={4}
                    placeholder='••••'
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className='w-full h-14 bg-[var(--gta-surface)] border border-[var(--gta-border)] px-6 text-2xl tracking-[0.5em] font-bold text-[var(--gta-text)] focus:outline-none focus:border-[var(--gta-green)] focus:shadow-[0_0_8px_var(--gta-green-glow)] transition-all text-center placeholder:text-[var(--gta-text-dim)]'
                  />
                  <input
                    type='password'
                    maxLength={4}
                    placeholder='••••'
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className='w-full h-14 bg-[var(--gta-surface)] border border-[var(--gta-border)] px-6 text-2xl tracking-[0.5em] font-bold text-[var(--gta-text)] focus:outline-none focus:border-[var(--gta-green)] focus:shadow-[0_0_8px_var(--gta-green-glow)] transition-all text-center placeholder:text-[var(--gta-text-dim)]'
                  />
                </div>
                <Typography
                  variant='pre'
                  className='text-[9px] text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] text-center mt-1'
                >
                  {t('Security protocol: Dual verification required')}
                </Typography>
              </div>

              <div className='p-5 bg-[var(--gta-panel)] border border-[var(--gta-border)] flex flex-col gap-2 relative'>
                <div className='absolute top-0 left-0 right-0 h-[2px] bg-[var(--gta-green)]' />
                <Typography variant='pre' className='text-[10px] font-bold text-[var(--gta-text-dim)] uppercase tracking-[0.15em]'>
                  {t('Origin Entity')}
                </Typography>
                <Typography className='text-lg font-bold uppercase text-[var(--gta-text)] leading-none'>
                  {selectedAccount?.accountName}
                </Typography>
                <Typography variant='pre' className='text-[10px] font-bold text-[var(--gta-text-dim)] mt-1'>
                  {selectedAccount?.number}
                </Typography>
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <Typography variant='label' className='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] px-0.5'>
                {t('Liquidation Summary')}
              </Typography>
              <Summary balance={selectedAccount?.balance ?? 0} payment={cost} />
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <AnimatePresence mode='wait'>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className='flex items-center gap-3 p-4 border bg-[var(--gta-red)]/10 border-[var(--gta-red)]/30'
                >
                  <AlertCircle className='w-4 h-4 shrink-0 text-[var(--gta-red)]' />
                  <Typography variant='pre' className='text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--gta-red)] leading-relaxed'>
                    {error}
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>

            <div className='flex justify-end gap-2 pt-4 border-t border-[var(--gta-border)]'>
              <Button variant='secondary' onClick={handleClose}>
                {t('Abort Protocol')}
              </Button>
              <Button onClick={handleOrderCard} disabled={isLoading || !isAffordable}>
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
      <div className='flex flex-col lg:flex-row gap-6'>
        <div className='flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 auto-rows-min'>
          <AnimatePresence mode='popLayout'>
            {cards.map((card) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
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
            <div className='col-span-full py-16 flex flex-col items-center justify-center bg-[var(--gta-panel)] border border-dashed border-[var(--gta-border)] opacity-40 gap-3'>
              <ShieldEllipsis className='w-10 h-10 text-[var(--gta-text-dim)]' />
              <Typography
                variant='pre'
                className='text-[10px] font-bold text-[var(--gta-text-dim)] uppercase tracking-[0.15em] text-center leading-relaxed'
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className='lg:w-[300px] shrink-0'
            >
              <div className='p-5 bg-[var(--gta-panel)] border border-[var(--gta-border)] sticky top-4'>
                <div className='flex items-center gap-2 mb-6 pb-3 border-b border-[var(--gta-border)]'>
                  <ShieldCheck className='w-4 h-4 text-[var(--gta-green)]' />
                  <Typography variant='h4' className='text-[var(--gta-text)] font-bold uppercase tracking-[0.1em] text-xs'>
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
