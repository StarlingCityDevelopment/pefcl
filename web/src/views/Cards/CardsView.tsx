import Layout from '@components/Layout';
import { PreHeading } from '@components/ui/Typography/BodyText';
import { Heading2, Heading6 } from '@components/ui/Typography/Headings';
import { accountsAtom } from '@data/accounts';
import { Box, Stack, alpha } from '@mui/material';
import { useAtom } from 'jotai';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import theme from '@utils/theme';
import BankCards from './components/BankCards';
import { selectedAccountIdAtom } from '@data/cards';
import { formatMoney } from '@utils/currency';
import { useConfig } from '@hooks/useConfig';
import { AccountBalanceRounded } from '@mui/icons-material';

const AccountTabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.25rem 0;

  &::-webkit-scrollbar {
    height: 0;
  }
`;

const AccountTab = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid
    ${({ isActive }) => (isActive ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.06)')};
  background: ${({ isActive }) =>
    isActive ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)'};
  color: ${({ isActive }) =>
    isActive ? theme.palette.text.primary : theme.palette.text.secondary};
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
  white-space: nowrap;
  flex-shrink: 0;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;

  &:hover {
    background: ${({ isActive }) =>
      isActive ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.04)'};
    border-color: ${({ isActive }) =>
      isActive ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
    color: ${theme.palette.text.primary};
  }

  &:active {
    transform: scale(0.97);
  }
`;

const AccountIcon = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${({ isActive }) =>
    isActive ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.04)'};

  svg {
    font-size: 0.875rem;
    color: ${({ isActive }) =>
      isActive ? theme.palette.primary.main : theme.palette.text.secondary};
  }
`;

const BalanceLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 400;
  color: ${theme.palette.text.secondary};
  margin-left: 0.125rem;
`;

const CardsView = () => {
  const [selectedCardId, setSelectedCardId] = useState(0);
  const [selectedAccountId, setSelectedAccountId] = useAtom(selectedAccountIdAtom);
  const [accounts] = useAtom(accountsAtom);
  const { t } = useTranslation();
  const config = useConfig();

  // Auto-select first account if none selected
  useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId, setSelectedAccountId]);

  const handleSelectAccount = (accountId: number) => {
    setSelectedAccountId(accountId);
    setSelectedCardId(0); // Reset card selection when switching accounts
  };

  return (
    <Layout>
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Heading2>{t('Cards')}</Heading2>
          <PreHeading>{t('Manage cards for your bank accounts')}</PreHeading>
        </Stack>

        {/* Account selector tabs */}
        <AccountTabsContainer>
          {accounts.map((account) => {
            const isActive = account.id === selectedAccountId;
            return (
              <AccountTab
                key={account.id}
                isActive={isActive}
                onClick={() => handleSelectAccount(account.id)}
              >
                <AccountIcon isActive={isActive}>
                  <AccountBalanceRounded />
                </AccountIcon>
                <Stack spacing={0} alignItems="flex-start">
                  <span>{account.accountName}</span>
                  <BalanceLabel>{formatMoney(account.balance, config.general)}</BalanceLabel>
                </Stack>
              </AccountTab>
            );
          })}
        </AccountTabsContainer>

        {/* Bank cards for selected account */}
        {selectedAccountId > 0 && (
          <BankCards
            selectedCardId={selectedCardId}
            onSelectCardId={setSelectedCardId}
            accountId={selectedAccountId}
          />
        )}
      </Stack>
    </Layout>
  );
};

export default CardsView;
