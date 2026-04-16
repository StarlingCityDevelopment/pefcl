import styled from '@emotion/styled';
import {
  CreditCardRounded,
  DashboardRounded,
  ReceiptRounded,
  SwapHorizRounded,
} from '@mui/icons-material';
import { Badge } from '@mui/material';
import theme from '@utils/theme';
import React, { ReactNode } from 'react';
import { Link, useMatch } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Atom } from 'jotai';
import { totalUnpaidInvoicesAtom } from '@data/invoices';
import BadgeAtom from '@components/ui/BadgeAtom';

export const FooterHeight = '5rem';

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: ${FooterHeight};
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: rgba(20, 20, 23, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
`;

const List = styled.ul`
  flex: 1;
  padding: 0 1.25rem;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  list-style: none;
  margin: 0;

  a {
    text-decoration: none;
  }
`;

const ListItemContainer = styled.li<{ isActive: boolean }>`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: ${theme.spacing(1)};
  color: ${theme.palette.text.secondary};

  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
  opacity: 0.6;
  width: 5rem;
  height: 100%;

  &:hover {
    opacity: 0.8;
  }

  ${({ isActive }) =>
    isActive &&
    `
      opacity: 1;
      color: ${theme.palette.primary.main};
  `};

  span {
    font-weight: 500;
    margin-top: ${theme.spacing(0.5)};
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
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
      <ListItemContainer isActive={Boolean(match)}>
        {countAtom ? (
          <BadgeAtom color="error" countAtom={countAtom}>
            {icon}
          </BadgeAtom>
        ) : (
          <Badge color="error" badgeContent={amount}>
            {icon}
          </Badge>
        )}

        <span>{label}</span>
      </ListItemContainer>
    </Link>
  );
};

const MobileFooter = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <List>
        <ListItem icon={<DashboardRounded />} label={t('Dashboard')} to="../mobile/dashboard" />
        <ListItem icon={<CreditCardRounded />} label={t('Accounts')} to="../mobile/accounts" />
        <ListItem icon={<SwapHorizRounded />} label={t('Transfer')} to="../mobile/transfer" />
        <ListItem
          icon={<ReceiptRounded />}
          label={t('Invoices')}
          to="../mobile/invoices"
          countAtom={totalUnpaidInvoicesAtom}
        />
      </List>
    </Container>
  );
};

export default MobileFooter;
