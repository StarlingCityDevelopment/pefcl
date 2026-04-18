import { PIN_CODE_LENGTH } from '@common/constants';
import BankCard from '@components/BankCard';
import Button from '@components/ui/Button';
import PinField from '@components/ui/Fields/PinField';
import { Heading2, Heading4, Heading6 } from '@components/ui/Typography/Headings';
import { accountsAtom, defaultAccountAtom } from '@data/accounts';
import { transactionBaseAtom } from '@data/transactions';
import styled from '@emotion/styled';
import { useConfig } from '@hooks/useConfig';
import { useExitListener } from '@hooks/useExitListener';
import { useKeyDown } from '@hooks/useKeyPress';
import { useNuiEvent } from '@hooks/useNuiEvent';
import { ErrorRounded } from '@mui/icons-material';
import { Alert, Paper, Stack } from '@mui/material';
import type { ATMInput, Account, GetATMAccountInput } from '@typings/Account';
import type { Card, InventoryCard } from '@typings/BankCard';
import { CardErrors } from '@typings/Errors';
import { AccountEvents, CardEvents } from '@typings/Events';
import { defaultWithdrawOptions } from '@utils/constants';
import { formatMoney } from '@utils/currency';
import { fetchNui } from '@utils/fetchNui';
import theme from '@utils/theme';
import { useAtom, useAtomValue } from 'jotai';
import { AnimatePresence } from 'motion/react';
import { motion } from 'motion/react';
import React, { type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AnimationContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -80%);
`;

const Container = styled(Paper)`
  display: inline-block;
  padding: ${theme.spacing(5)};
  border-radius: 20px;
  background-color: #141416 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 24px 80px -12px rgba(0, 0, 0, 0.7) !important;
`;

const AccountBalance = styled(Heading6)`
  color: ${theme.palette.text.secondary};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.6875rem;
`;

const Header = styled(Stack)`
  margin-bottom: ${theme.spacing(4)};
`;

const WithdrawText = styled(Heading6)`
  display: block;
  padding-bottom: ${theme.spacing(1)};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.6875rem;
  font-weight: 600;
`;

const WithdrawContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 7.5rem);
  grid-row-gap: ${theme.spacing(1)};
  grid-column-gap: ${theme.spacing(1)};
`;

const CardWrapper = styled.div`
  min-width: 14rem;
`;

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
        const cards = await fetchNui<InventoryCard[]>(CardEvents.GetInventoryCards);
        if (!cards) {
          throw new Error('No cards available');
        }
        setCards(cards);
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
          return;
        }

        if (error.message === CardErrors.Blocked) {
          setError(t('The card is blocked'));
          return;
        }

        setError(error.message);
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
            return;
          }

          if (error.message === CardErrors.Blocked) {
            setError(t('The card is blocked'));
            return;
          }

          setError(error.message);
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
  return (
    <>
      <AnimatePresence>
        {isOpen && state === 'select-card' && (
          <AnimationContainer>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Container elevation={4}>
                <Header>
                  <Heading4>{t('Select a card')}</Heading4>
                </Header>

                <Stack direction='row' spacing={1}>
                  {cards.map((card) => (
                    <CardWrapper key={card.number} onClick={() => handleSelectCard(card)}>
                      <BankCard card={card} />
                    </CardWrapper>
                  ))}
                </Stack>

                {error && (
                  <Alert icon={<ErrorRounded />} color='error' sx={{ mt: 2, borderRadius: '10px' }}>
                    {error}
                  </Alert>
                )}
              </Container>
            </motion.div>
          </AnimationContainer>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && state === 'enter-pin' && (
          <AnimationContainer>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Container elevation={4}>
                <Header>
                  <Heading4>{selectedCard?.number}</Heading4>
                  <Heading6>{selectedCard?.holder}</Heading6>
                </Header>

                <form onSubmit={handleSubmit}>
                  <Stack spacing={2.5}>
                    <PinField label={t('Enter pin')} value={pin} onChange={(event) => setPin(event.target.value)} />

                    <Button type='submit'>{t('Enter pin')}</Button>
                  </Stack>
                </form>

                {error && (
                  <Alert icon={<ErrorRounded />} color='error' sx={{ mt: 2, borderRadius: '10px' }}>
                    {error}
                  </Alert>
                )}
              </Container>
            </motion.div>
          </AnimationContainer>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && state === 'withdraw' && (
          <AnimationContainer>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Container elevation={4}>
                <Header>
                  <AccountBalance>{t('Account balance')}</AccountBalance>
                  <Heading2 sx={{ letterSpacing: '-0.025em' }}>{formatMoney(accountBalance, config.general)}</Heading2>
                </Header>

                <WithdrawText>{t('Quick withdraw')}</WithdrawText>
                <WithdrawContainer>
                  {withdrawOptions.map((value) => (
                    <Button
                      key={value}
                      onClick={() => handleWithdraw(value)}
                      data-value={value}
                      disabled={value > accountBalance || isLoading}
                    >
                      {formatMoney(value, config.general)}
                    </Button>
                  ))}
                </WithdrawContainer>

                {error && (
                  <Alert icon={<ErrorRounded />} color='error' sx={{ mt: 2, borderRadius: '10px' }}>
                    {error}
                  </Alert>
                )}
              </Container>
            </motion.div>
          </AnimationContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default ATM;
