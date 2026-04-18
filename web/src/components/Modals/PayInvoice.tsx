import styled from '@emotion/styled';
import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { CheckRounded, ErrorRounded } from '@mui/icons-material';
import { Alert, Box, Paper, Stack, Typography, alpha } from '@mui/material';
import { InvoiceEvents } from '@typings/Events';
import type { Invoice, PayInvoiceInput } from '@typings/Invoice';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { accountsAtom, defaultAccountAtom } from '../../data/accounts';
import { invoicesAtom } from '../../data/invoices';
import { transactionBaseAtom } from '../../data/transactions';
import { useConfig } from '../../hooks/useConfig';
import { formatMoney } from '../../utils/currency';
import { fetchNui } from '../../utils/fetchNui';
import theme from '../../utils/theme';
import AccountSelect from '../AccountSelect';
import Summary from '../Summary';
import Button from '../ui/Button';
import { BodyText } from '../ui/Typography/BodyText';
import { Heading2, Heading3, Heading5, Heading6 } from '../ui/Typography/Headings';

dayjs.extend(calendar);

const Amount = styled(Heading3)`
  font-weight: ${theme.typography.fontWeightLight};
`;

interface PayInvoiceModalProps {
  invoice: Invoice;
  onClose(): void;
}

const PayInvoiceModal = ({ onClose, invoice }: PayInvoiceModalProps) => {
  const { isMobile } = useGlobalSettings();
  const [accounts, updateAccounts] = useAtom(accountsAtom);
  const [defaultAccount] = useAtom(defaultAccountAtom);
  const [, updateInvoices] = useAtom(invoicesAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);
  const [selectedAccountId, setSelectedAccountId] = useState(defaultAccount?.id ?? 0);
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const config = useConfig();
  const { t } = useTranslation();

  const expiresDate = dayjs(invoice.expiresAt);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);

  const handlePayInvoice = () => {
    setError('');
    setIsLoading(true);
    const payload: PayInvoiceInput = {
      fromAccountId: selectedAccountId,
      invoiceId: invoice.id,
    };

    fetchNui(InvoiceEvents.PayInvoice, payload)
      .then(() => {
        setIsPaid(true);
        updateInvoices();
        updateAccounts();
        updateTransactions();
        setTimeout(onClose, 2000);
      })
      .catch((err) => {
        setError(err.message || t('Failed to pay invoice'));
      })
      .finally(() => setIsLoading(false));
  };

  if (isPaid) {
    return (
      <Paper
        sx={{
          minHeight: isMobile ? '300px' : '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={2} alignItems='center'>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: alpha(theme.palette.success.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.success.main,
              mb: 1,
            }}
          >
            <CheckRounded sx={{ fontSize: 48 }} />
          </Box>
          <Heading2>{t('Paid')}</Heading2>
          <BodyText sx={{ opacity: 0.6 }}>{t('Invoice has been settled.')}</BodyText>
        </Stack>
      </Paper>
    );
  }

  const hasEnoughFunds = (selectedAccount?.balance ?? 0) >= invoice.amount;

  return (
    <Paper>
      <Stack p={isMobile ? 3 : 4} spacing={isMobile ? 3 : 8} direction={isMobile ? 'column' : 'row'}>
        <Stack spacing={isMobile ? 2.5 : 4} flex={1}>
          <Stack>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Heading2 sx={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>{t('Invoice')}</Heading2>
              <Amount sx={{ fontSize: isMobile ? '1.25rem' : '1.75rem' }}>
                {formatMoney(invoice.amount, config.general)}
              </Amount>
            </Stack>

            <Heading5 sx={{ opacity: 0.8 }}>{invoice.from}</Heading5>
          </Stack>

          <Stack spacing={0.5}>
            <Heading6
              sx={{
                fontSize: '0.6875rem',
                opacity: 0.5,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {t('Message')}
            </Heading6>
            <BodyText sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>{invoice.message}</BodyText>
          </Stack>

          <Stack spacing={0.5}>
            <Heading6
              sx={{
                fontSize: '0.6875rem',
                opacity: 0.5,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {t('Expires')}
            </Heading6>
            <BodyText sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
              {expiresDate.format(t('DATE_TIME_FORMAT'))}
              <Typography component='span' sx={{ opacity: 0.5, ml: 1, fontSize: '0.85em' }}>
                ({expiresDate.fromNow()})
              </Typography>
            </BodyText>
          </Stack>
        </Stack>

        <Stack spacing={isMobile ? 3 : 4} flex={1}>
          <Stack spacing={0.75}>
            <Heading6
              sx={{
                fontSize: '0.6875rem',
                opacity: 0.5,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {t('Account')}
            </Heading6>
            <AccountSelect
              isFromAccount
              accounts={accounts}
              onSelect={setSelectedAccountId}
              selectedId={selectedAccountId}
            />
          </Stack>

          <Summary balance={selectedAccount?.balance ?? 0} payment={invoice.amount} />

          {error && (
            <Alert icon={<ErrorRounded />} color='error' sx={{ borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          <Stack direction={isMobile ? 'column-reverse' : 'row'} spacing={1.5}>
            <Button disabled={isLoading} variant='text' color='error' sx={{ flex: 1 }} onClick={onClose}>
              {t('Cancel')}
            </Button>
            <Button
              sx={{ flex: 2 }}
              onClick={handlePayInvoice}
              disabled={!selectedAccountId || !hasEnoughFunds || isLoading}
            >
              {isLoading ? t('Processing...') : t('Pay invoice')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default PayInvoiceModal;
