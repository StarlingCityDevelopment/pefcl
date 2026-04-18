import styled from '@emotion/styled';
import { Stack } from '@mui/material';
import type { Card, InventoryCard } from '@typings/BankCard';
import theme from '@utils/theme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MasterCardIcon } from '../icons/MasterCardIcon';
import { BodyText } from './ui/Typography/BodyText';
import { Heading4, Heading6 } from './ui/Typography/Headings';

const Container = styled.div<{ selected: boolean; blocked: boolean }>`
  user-select: none;
  width: 100%;
  padding: 1.25rem;
  background-color: rgba(255, 255, 255, 0.02);
  border-radius: 14px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 160px;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
  border: 1px solid rgba(255, 255, 255, 0.06);

  ${({ blocked }) =>
    blocked &&
    `
    opacity: 0.4;
    filter: grayscale(1);
  `}

  &:hover {
    background-color: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  ${(props) =>
    props.selected &&
    `
    border-color: rgba(59, 130, 246, 0.3);
    background-color: rgba(59, 130, 246, 0.04);
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.15);
  `}
`;

const StyledIcon = styled(MasterCardIcon)`
  width: 36px;
  opacity: 0.6;
  filter: grayscale(0.3);
  align-self: flex-end;
`;

interface BankCardProps {
  card: Card | InventoryCard;
  isBlocked?: boolean;
  selected?: boolean;
}
const BankCard = ({ card, selected = false, isBlocked = false }: BankCardProps) => {
  const { t } = useTranslation();

  return (
    <Container selected={selected} blocked={isBlocked}>
      <Stack spacing={2}>
        <Heading4 sx={{ fontSize: '0.9375rem', letterSpacing: '0.03em', fontWeight: 500 }}>{card.number}</Heading4>
        <Stack direction='row' justifyContent='space-between' alignItems='flex-end'>
          <Stack spacing={0.25}>
            <Heading6 sx={{ fontSize: '0.5625rem', letterSpacing: '0.06em' }}>{t('Card holder')}</Heading6>
            <BodyText sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>{card.holder}</BodyText>
          </Stack>

          <StyledIcon />
        </Stack>
      </Stack>
    </Container>
  );
};

export default BankCard;
