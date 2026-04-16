import { AccountCard, LoadingAccountCard } from '@components/AccountCard';
import CreateAccountModal from '@components/Modals/CreateAccount';
import { orderedAccountsAtom } from '@data/accounts';
import styled from '@emotion/styled';
import { useConfig } from '@hooks/useConfig';
import { Add } from '@mui/icons-material';
import { Dialog } from '@mui/material';
import theme from '@utils/theme';
import { useAtom } from 'jotai';
import React, { useState } from 'react';

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 1rem;
  width: 100%;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  min-width: 0; /* Prevent grid blowout */
`;

const CreateCard = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  border: 1.5px dashed rgba(255, 255, 255, 0.08);
  color: ${theme.palette.text.secondary};
  transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  min-height: 190px;

  &:hover {
    color: ${theme.palette.primary.main};
    border-color: rgba(59, 130, 246, 0.3);
    background: rgba(59, 130, 246, 0.04);
  }

  svg {
    font-size: 1.5rem;
  }
`;

interface AccountCardsProps {
  selectedAccountId?: number;
  onSelectAccount?: (id: number) => void;
  hideCreate?: boolean;
}

const AccountCards = ({ onSelectAccount, selectedAccountId, hideCreate }: AccountCardsProps) => {
  const config = useConfig();
  const [orderedAccounts] = useAtom(orderedAccountsAtom);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);

  return (
    <>
      <Dialog
        open={isCreateAccountOpen}
        onClose={() => setIsCreateAccountOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <CreateAccountModal onClose={() => setIsCreateAccountOpen(false)} />
      </Dialog>

      <Cards>
        {orderedAccounts.map((account) => (
          <CardContainer key={account.id} onClick={() => onSelectAccount?.(account.id)}>
            <AccountCard account={account} selected={account.id === selectedAccountId} withCopy />
          </CardContainer>
        ))}

        {!hideCreate && orderedAccounts.length < (config.accounts.maximumNumberOfAccounts || 4) && (
          <CreateCard onClick={() => setIsCreateAccountOpen(true)} title="create-account">
            <Add />
          </CreateCard>
        )}
      </Cards>
    </>
  );
};

export const LoadingCards = ({ hideCreate }: { hideCreate?: boolean }) => {
  return (
    <Cards>
      <LoadingAccountCard />
      <LoadingAccountCard />
      <LoadingAccountCard />
      {!hideCreate && (
        <CreateCard>
          <Add />
        </CreateCard>
      )}
    </Cards>
  );
};

export default AccountCards;
