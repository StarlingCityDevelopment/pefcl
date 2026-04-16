import React, { ReactNode } from 'react';
import {
  AccountBalanceRounded,
  Add,
  CreditCardRounded,
  DashboardRounded,
  Paid,
  Receipt,
  Remove,
  SwapHoriz,
} from '@mui/icons-material';
import styled from '@emotion/styled';
import theme from '@utils/theme';
import { alpha, Badge } from '@mui/material';
import { Link, useMatch } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Atom } from 'jotai';
import { totalUnpaidInvoicesAtom } from '@data/invoices';
import BadgeAtom from './ui/BadgeAtom';
import { useConfig } from '@hooks/useConfig';

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  width: 240px;
  min-width: 240px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.01);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
`;

const List = styled.ul`
  margin: 0;
  padding: 2rem 1rem;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;

  a {
    text-decoration: none;
  }
`;

const ListItemContainer = styled.li<{ isActive: boolean }>`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 0.625rem 0.875rem;
  border-radius: 10px;
  color: ${({ isActive }) =>
    isActive ? theme.palette.text.primary : theme.palette.text.secondary};
  background-color: ${({ isActive }) => (isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent')};

  transition: all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);

  &:hover {
    color: ${theme.palette.text.primary};
    background-color: ${({ isActive }) =>
      isActive ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)'};
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    font-size: 1.125rem;
    margin-right: 0.75rem;
    opacity: ${({ isActive }) => (isActive ? 1 : 0.7)};
  }

  span {
    font-weight: 500;
    font-size: 0.8125rem;
    letter-spacing: 0.005em;
  }
`;

interface ListItemProps {
  to: string;
  label: string;
  icon: ReactNode;
  amount?: number;
  countAtom?: Atom<number>;
}

const ListItem = ({ to, icon, label, amount, countAtom }: ListItemProps) => {
  const match = useMatch(to);

  return (
    <Link to={to}>
      <ListItemContainer isActive={!!match}>
        {countAtom ? (
          <BadgeAtom color="error" countAtom={countAtom}>
            {icon}
          </BadgeAtom>
        ) : (
          <Badge
            color="primary"
            variant="dot"
            invisible={!amount}
            sx={{
              '& .MuiBadge-badge': {
                right: 4,
                top: 4,
                border: `2px solid ${theme.palette.background.paper}`,
              },
            }}
          >
            {icon}
          </Badge>
        )}

        <span>{label}</span>
      </ListItemContainer>
    </Link>
  );
};

const Sidebar = () => {
  const { t } = useTranslation();
  const config = useConfig();

  return (
    <SidebarNav>
      <List>
        <ListItem to="../" icon={<DashboardRounded />} label={t('Dashboard')} />
        <ListItem to="../accounts" icon={<AccountBalanceRounded />} label={t('Accounts')} />
        <ListItem to="../transfer" icon={<SwapHoriz />} label={t('Transfer')} />
        <ListItem to="../transactions" icon={<Paid />} label={t('Transactions')} />
        <ListItem to="../invoices" icon={<Receipt />} label={t('Invoices')} />
        <ListItem to="../deposit" icon={<Add />} label={t('Deposit Cash')} />
        <ListItem to="../withdraw" icon={<Remove />} label={t('Withdraw Cash')} />

        {config?.frameworkIntegration?.isCardsEnabled && (
          <ListItem to="../cards" icon={<CreditCardRounded />} label={t('Cards')} />
        )}
      </List>
    </SidebarNav>
  );
};

export default Sidebar;
