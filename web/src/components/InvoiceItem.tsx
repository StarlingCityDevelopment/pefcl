import React, { useState } from 'react';
import { Stack, Box, Divider } from '@mui/material';
import styled from '@emotion/styled';
import calendar from 'dayjs/plugin/calendar';
import relative from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { Heading6 } from './ui/Typography/Headings';
import theme from '@utils/theme';
import { Invoice, InvoiceStatus } from '@typings/Invoice';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@hooks/useConfig';
import PayInvoiceModal from './Modals/PayInvoice';
import { BodyText } from './ui/Typography/BodyText';
import { formatMoney } from '@utils/currency';
import Button from './ui/Button';
import Status from './ui/Status';
import BaseDialog from './Modals/BaseDialog';
import { useGlobalSettings } from '@hooks/useGlobalSettings';

dayjs.extend(calendar);
dayjs.extend(relative);

const InvoiceContainer = styled.div<{ isPending: boolean }>`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  padding: 1.25rem;
  width: 100%;
  transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  cursor: ${({ isPending }) => (isPending ? 'pointer' : 'default')};

  @media (hover: hover) {
    &:hover {
      background: ${({ isPending }) =>
        isPending ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.02)'};
      transform: ${({ isPending }) => (isPending ? 'translateY(-2px)' : 'none')};
      border-color: ${({ isPending }) =>
        isPending ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)'};
    }
  }

  &:active {
    transform: ${({ isPending }) => (isPending ? 'translateY(0) scale(0.99)' : 'none')};
  }
`;

const From = styled(BodyText)`
  font-weight: 700;
  color: ${theme.palette.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Message = styled(BodyText)`
  color: ${theme.palette.text.secondary};
  opacity: 0.7;
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const InvoiceItem: React.FC<{ invoice: Invoice }> = ({ invoice, ...props }) => {
  const { t } = useTranslation();
  const { message, amount, id, createdAt, expiresAt, from } = invoice;
  const config = useConfig();
  const { isMobile } = useGlobalSettings();
  const expiresDate = dayjs(expiresAt);
  const createdDate = dayjs(createdAt);
  const [isPayOpen, setIsPayOpen] = React.useState(false);

  const handleCloseModal = () => {
    setIsPayOpen(false);
  };

  const isPending = invoice.status === InvoiceStatus.PENDING;

  const handleCardClick = (e: React.MouseEvent) => {
    if (isPending) {
      setIsPayOpen(true);
    }
  };

  return (
    <>
      <BaseDialog open={isPayOpen} onClose={handleCloseModal} maxWidth="md">
        <PayInvoiceModal onClose={handleCloseModal} invoice={invoice} />
      </BaseDialog>

      <InvoiceContainer {...props} key={id} isPending={isPending} onClick={handleCardClick}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1, pr: 2 }}>
              <From>{from}</From>
              <Message title={message}>{message}</Message>
            </Stack>
            <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
              <BodyText sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                {formatMoney(amount, config.general)}
              </BodyText>
              <Heading6 sx={{ opacity: 0.5, fontSize: '0.65rem' }}>
                {createdDate.fromNow()}
              </Heading6>
            </Stack>
          </Stack>

          {(invoice.status === InvoiceStatus.PENDING || invoice.status === InvoiceStatus.PAID) && (
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              {invoice.status === InvoiceStatus.PENDING ? (
                <Stack spacing={0}>
                  <Heading6 sx={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase' }}>
                    {t('Expires')}
                  </Heading6>
                  <BodyText sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {expiresDate.format(t('DATE_FORMAT'))}
                  </BodyText>
                </Stack>
              ) : (
                <Box />
              )}

              {invoice.status === InvoiceStatus.PENDING ? (
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPayOpen(true);
                  }}
                >
                  {t('Pay invoice')}
                </Button>
              ) : (
                <Status label={t('Paid')} color="success" />
              )}
            </Stack>
          )}
        </Stack>
      </InvoiceContainer>
    </>
  );
};

export default InvoiceItem;
