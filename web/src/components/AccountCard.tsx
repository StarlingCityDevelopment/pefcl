import styled from '@emotion/styled';
import { ContentCopyRounded, StarRounded } from '@mui/icons-material';
import { IconButton, Skeleton, Stack, alpha } from '@mui/material';
import { type Account, AccountType } from '@typings/Account';
import copy from 'copy-to-clipboard';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../hooks/useConfig';
import { MasterCardIcon } from '../icons/MasterCardIcon';
import { formatMoney } from '../utils/currency';
import theme from '../utils/theme';
import { BodyText } from './ui/Typography/BodyText';
import { Heading3, Heading5, Heading6 } from './ui/Typography/Headings';

interface ContainerProps {
  isDisabled: boolean;
  accountType: AccountType;
  selected: boolean;
}

const Container = styled('div', {
  shouldForwardProp: (prop) => !['isDisabled', 'accountType', 'selected'].includes(prop as string),
})<ContainerProps>`
  user-select: none;
  width: 100%;
  min-width: 0;
  padding: 1.25rem;
  background-color: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 190px;

  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  border: 1px solid rgba(255, 255, 255, 0.06);

  &:hover {
    background-color: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
    box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.3);
  }

  ${({ selected }) =>
    selected &&
    `
    background-color: rgba(59, 130, 246, 0.04);
    border-color: rgba(59, 130, 246, 0.3);
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.15);
  `};

  ${({ isDisabled }) =>
    isDisabled &&
    `
    opacity: 0.35;
    filter: grayscale(1);
    pointer-events: none;
  `}
`;

const Badge = styled.div`
  background: rgba(255, 255, 255, 0.04);
  padding: 3px 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const CardNumber = styled(Heading5)`
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.04em;
  opacity: 0.4;
  font-size: 0.75rem;
  font-weight: 400;
`;

type AccountCardProps = {
  account: Account;
  selected?: boolean;
  withCopy?: boolean;
  isDisabled?: boolean;
};

export const AccountCard = ({
  account,
  selected = false,
  withCopy = false,
  isDisabled = false,
  ...props
}: AccountCardProps) => {
  const { type, balance, isDefault, accountName, number } = account;
  const { t } = useTranslation();
  const config = useConfig();

  return (
    <Container {...props} accountType={type} selected={selected} isDisabled={isDisabled}>
      <Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
        <Stack spacing={0.25}>
          <Heading6
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 500,
            }}
          >
            {t('Available Balance')}
          </Heading6>
          <Heading3
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
            }}
          >
            {formatMoney(balance, config.general)}
          </Heading3>
        </Stack>
        <Stack direction='row' spacing={0.75}>
          {isDefault && (
            <Badge>
              <StarRounded sx={{ fontSize: '0.75rem', color: theme.palette.primary.main }} />
              <Heading6 sx={{ fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.06em' }}>
                {t('DEFAULT')}
              </Heading6>
            </Badge>
          )}
          <Badge>
            <Heading6 sx={{ fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.06em' }}>
              {type === AccountType.Shared ? t('SHARED') : t('PERSONAL')}
            </Heading6>
          </Badge>
        </Stack>
      </Stack>

      <Stack direction='row' justifyContent='space-between' alignItems='flex-end'>
        <Stack spacing={0.75}>
          <Stack direction='row' alignItems='center' spacing={0.75}>
            <CardNumber>{number}</CardNumber>
            {withCopy && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  copy(number);
                }}
                size='small'
                sx={{
                  p: 0.375,
                  color: 'rgba(255,255,255,0.15)',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    background: 'rgba(59, 130, 246, 0.08)',
                  },
                  borderRadius: '6px',
                }}
              >
                <ContentCopyRounded sx={{ fontSize: '11px' }} />
              </IconButton>
            )}
          </Stack>
          <Stack>
            <Heading6
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.5625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontWeight: 500,
              }}
            >
              {t('Account Holder')}
            </Heading6>
            <BodyText
              sx={{
                fontWeight: 500,
                fontSize: '0.8125rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '160px',
              }}
            >
              {accountName}
            </BodyText>
          </Stack>
        </Stack>
        <MasterCardIcon style={{ width: 40, opacity: 0.6, filter: 'grayscale(0.3)' }} />
      </Stack>
    </Container>
  );
};

export const LoadingAccountCard = () => {
  return (
    <Container accountType={AccountType.Personal} selected={false} isDisabled={false}>
      <Stack spacing={3}>
        <Stack direction='row' justifyContent='space-between'>
          <Skeleton variant='rectangular' width={100} height={18} sx={{ borderRadius: 1 }} />
          <Skeleton variant='rectangular' width={60} height={18} sx={{ borderRadius: 4 }} />
        </Stack>
        <Skeleton variant='text' width='80%' height={36} />
        <Stack direction='row' justifyContent='space-between' alignItems='flex-end'>
          <Skeleton variant='rectangular' width={120} height={28} sx={{ borderRadius: 1 }} />
          <Skeleton variant='circular' width={36} height={36} />
        </Stack>
      </Stack>
    </Container>
  );
};
