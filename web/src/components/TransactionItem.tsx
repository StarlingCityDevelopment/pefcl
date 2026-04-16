import React from 'react';
import calendar from 'dayjs/plugin/calendar';
import dayjs from 'dayjs';
import { ArrowDownwardRounded, ArrowUpwardRounded, SwapHorizRounded } from '@mui/icons-material';
import styled from '@emotion/styled';
import { BodyText } from '@ui/Typography/BodyText';
import theme from '@utils/theme';
import { useConfig } from '@hooks/useConfig';
import { Transaction, TransactionType } from '@typings/Transaction';
import { Stack, alpha, Skeleton, Box } from '@mui/material';
import { Heading6 } from '@ui/Typography/Headings';
import { formatMoney } from '@utils/currency';
import { useTranslation } from 'react-i18next';

dayjs.extend(calendar);

const Container = styled.div<{ type: TransactionType }>`
  padding: 0.625rem 1rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.08);
  }
`;

const IconWrapper = styled.div<{ type: TransactionType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  flex-shrink: 0;

  ${({ type }) => {
    switch (type) {
      case TransactionType.Incoming:
        return `
          background: rgba(52, 211, 153, 0.1);
          color: ${theme.palette.success.main};
        `;
      case TransactionType.Outgoing:
        return `
          background: rgba(239, 68, 68, 0.1);
          color: ${theme.palette.error.main};
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.04);
          color: ${theme.palette.text.secondary};
        `;
    }
  }}
`;

const TransactionDate = styled(Heading6)`
  color: ${theme.palette.text.secondary};
  font-size: 0.6875rem;
  text-transform: none;
  letter-spacing: 0.01em;
  font-weight: 400;
`;

const TransactionItem: React.FC<{ transaction: Transaction; isLimitedSpace?: boolean }> = ({
  isLimitedSpace,
  transaction,
  ...rest
}) => {
  const { t } = useTranslation();
  const { message, amount, id, createdAt, toAccount, fromAccount, type } = transaction;
  const config = useConfig();
  const createdAtDate = dayjs(createdAt);

  const getIcon = () => {
    switch (type) {
      case TransactionType.Incoming:
        return <ArrowUpwardRounded sx={{ fontSize: '1.125rem' }} />;
      case TransactionType.Outgoing:
        return <ArrowDownwardRounded sx={{ fontSize: '1.125rem' }} />;
      default:
        return <SwapHorizRounded sx={{ fontSize: '1.125rem' }} />;
    }
  };

  return (
    <Container key={id} type={type} {...rest}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <IconWrapper type={type}>{getIcon()}</IconWrapper>

        <Stack flex={1} spacing={0.25} minWidth={0}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Heading6
              sx={{
                fontWeight: 500,
                fontSize: '0.8125rem',
                color: theme.palette.text.primary,
                letterSpacing: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {message}
            </Heading6>
            <Heading6
              sx={{
                fontWeight: 600,
                fontSize: '0.8125rem',
                color:
                  type === TransactionType.Incoming
                    ? theme.palette.success.main
                    : theme.palette.text.primary,
                letterSpacing: '-0.01em',
                flexShrink: 0,
                ml: 1,
              }}
            >
              {type === TransactionType.Incoming ? '+' : '-'} {formatMoney(amount, config.general)}
            </Heading6>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={0.75} alignItems="center">
              <TransactionDate>{createdAtDate.fromNow()}</TransactionDate>
              {!isLimitedSpace && (
                <>
                  <Box
                    sx={{
                      width: 2,
                      height: 2,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }}
                  />
                  <TransactionDate>{createdAtDate.format(t('DATE_FORMAT'))}</TransactionDate>
                </>
              )}
            </Stack>

            {!isLimitedSpace && (fromAccount || toAccount) && (
              <Stack direction="row" spacing={0.75} alignItems="center">
                {fromAccount && (
                  <BodyText sx={{ fontSize: '0.6875rem', color: theme.palette.text.secondary }}>
                    {fromAccount.accountName}
                  </BodyText>
                )}
                {fromAccount && toAccount && (
                  <SwapHorizRounded sx={{ fontSize: '0.75rem', opacity: 0.2 }} />
                )}
                {toAccount && (
                  <BodyText sx={{ fontSize: '0.6875rem', color: theme.palette.text.secondary }}>
                    {toAccount.accountName}
                  </BodyText>
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};

export const TransactionSkeleton = () => (
  <Container type={TransactionType.Transfer} style={{ pointerEvents: 'none' }}>
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Skeleton variant="rectangular" width={36} height={36} sx={{ borderRadius: '8px' }} />
      <Stack flex={1} spacing={0.75}>
        <Stack direction="row" justifyContent="space-between">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="20%" />
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="20%" />
        </Stack>
      </Stack>
    </Stack>
  </Container>
);

export default TransactionItem;
