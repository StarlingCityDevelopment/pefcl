import { PreHeading } from '@components/ui/Typography/BodyText';
import { Heading4, Heading6 } from '@components/ui/Typography/Headings';
import React, { useEffect, useState } from 'react';
import BankCard from '@components/BankCard';
import { AddRounded, ErrorRounded, InfoRounded } from '@mui/icons-material';
import { Alert, DialogActions, DialogContent, DialogTitle, Stack, Box } from '@mui/material';
import { Card, CreateCardInput } from '@typings/BankCard';
import theme from '@utils/theme';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import CardActions from './CardActions';
import { useConfig } from '@hooks/useConfig';
import BaseDialog from '@components/Modals/BaseDialog';
import { fetchNui } from '@utils/fetchNui';
import { CardEvents } from '@typings/Events';
import { useAtom } from 'jotai';
import { cardsAtom } from '@data/cards';
import Button from '@components/ui/Button';
import AccountSelect from '@components/AccountSelect';
import Summary from '@components/Summary';
import { accountsAtom } from '@data/accounts';
import PinField from '@components/ui/Fields/PinField';
import { AccountRole, AccountType } from '@typings/Account';
import { AnimatePresence, motion } from 'motion/react';

const CreateCard = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  border: 1.5px dashed rgba(255, 255, 255, 0.08);
  color: ${theme.palette.text.secondary};
  transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  min-height: 160px;
  width: auto;

  &:hover {
    color: ${theme.palette.primary.main};
    border-color: rgba(59, 130, 246, 0.3);
    background: rgba(59, 130, 246, 0.04);
  }

  svg {
    font-size: 1.5rem;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
`;

const DetailPanel = styled(motion.div)`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 1.5rem;
  min-width: 240px;
`;

interface BankCardsProps {
  accountId: number;
  selectedCardId: number;
  onSelectCardId(id: number): void;
}

const BankCards = ({ onSelectCardId, selectedCardId, accountId }: BankCardsProps) => {
  const { t } = useTranslation();
  const [accounts, updateAccounts] = useAtom(accountsAtom);
  const defaultAccount = accounts.find((account) => Boolean(account.isDefault));
  const initialAccountId = defaultAccount?.id ?? -1;
  const [cards, updateCards] = useAtom(cardsAtom);
  const [error, setError] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderingCard, setIsOrderingCard] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(accountId);
  const {
    cards: { cost, maxCardsPerAccount },
  } = useConfig();

  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);
  const selectedCard = cards.find((card) => card.id === selectedCardId);
  const isAffordable = (selectedAccount?.balance ?? 0) > cost;

  useEffect(() => {
    setSelectedAccountId(accountId);
    const fetch = async () => {
      await updateCards(accountId);
    };
    fetch();
  }, [accountId, updateCards]);

  const handleClose = () => {
    setError('');
    setIsLoading(false);
    setIsOrderingCard(false);
    setPin('');
    setConfirmPin('');
  };

  const handleOrderCard = async () => {
    if (confirmPin !== pin) {
      setError(t('Pins do not match'));
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const account = accounts.find((acc) => acc.id === accountId);

      if (!account) {
        setError(t('Please select a valid account to pay from.'));
        setIsLoading(false);
        return;
      }

      const accountRole = account.role;

      if (accountRole !== AccountRole.Admin && accountRole !== AccountRole.Owner) {
        setError(t('Contributors cannot use money in shared accounts.'));
        setIsLoading(false);
        return;
      }

      const accountType = account.type;

      if (accountType === undefined || accountType === null) {
        setError(t('Selected account has an invalid account type.'));
        setIsLoading(false);
        return;
      }

      const cardEvent =
        accountType === AccountType.Personal ? CardEvents.OrderPersonal : CardEvents.OrderShared;

      const newCard = await fetchNui<Card, CreateCardInput>(cardEvent, {
        accountId,
        paymentAccountId: selectedAccountId,
        pin: parseInt(pin, 10),
      });

      if (!newCard) {
        return;
      }

      await updateCards(newCard);
      await updateAccounts();
      handleClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }

    setIsLoading(false);
  };

  const handleCardClick = (cardId: number) => {
    // Toggle selection — clicking the same card deselects
    onSelectCardId(selectedCardId === cardId ? 0 : cardId);
  };

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ minHeight: 0, flex: 1 }}>
        {/* Cards grid */}
        <Box flex={1} minWidth={0}>
          <CardsGrid>
            {cards.map((card) => (
              <div key={card.id} onClick={() => handleCardClick(card.id)}>
                <BankCard card={card} selected={selectedCardId === card.id} />
              </div>
            ))}

            {cards.length < maxCardsPerAccount && (
              <CreateCard onClick={() => setIsOrderingCard(true)}>
                <AddRounded />
              </CreateCard>
            )}
          </CardsGrid>

          {cards.length === 0 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Heading6 sx={{ color: theme.palette.text.secondary }}>
                {t('No cards issued for this account')}
              </Heading6>
              <PreHeading sx={{ mt: 0.5 }}>{t('Order a new card to get started')}</PreHeading>
            </Box>
          )}
        </Box>

        {/* Inline detail panel for selected card */}
        <AnimatePresence>
          {selectedCard && (
            <DetailPanel
              initial={{ opacity: 0, width: 0, padding: 0 }}
              animate={{ opacity: 1, width: 'auto', padding: '1.5rem' }}
              exit={{ opacity: 0, width: 0, padding: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <CardActions
                isBlocked={selectedCard?.isBlocked}
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
            </DetailPanel>
          )}
        </AnimatePresence>
      </Stack>

      {/* Order card dialog */}
      <BaseDialog open={isOrderingCard} onClose={handleClose}>
        <DialogTitle>{t('Order a new card')}</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={4}>
            <Stack spacing={2.5}>
              <PinField
                label={t('Enter pin')}
                value={pin}
                onChange={(event) => setPin(event.target.value)}
              />

              <PinField
                label={t('Confirm pin')}
                value={confirmPin}
                onChange={(event) => setConfirmPin(event.target.value)}
              />
            </Stack>

            <Stack spacing={2} flex={1}>
              <AccountSelect
                isFromAccount
                accounts={accounts}
                selectedId={selectedAccountId}
                onSelect={setSelectedAccountId}
              />

              <Summary balance={selectedAccount?.balance ?? 0} payment={cost} />
            </Stack>
          </Stack>

          {error && (
            <Alert
              sx={{ marginTop: '1.5rem' }}
              icon={isLoading ? <InfoRounded /> : <ErrorRounded />}
              color={isLoading ? 'info' : 'error'}
            >
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleOrderCard} disabled={isLoading || !isAffordable}>
            {t('Order new card')}
          </Button>
        </DialogActions>
      </BaseDialog>
    </>
  );
};

export default BankCards;
