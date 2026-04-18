import InvoiceItem from '@components/InvoiceItem';
import TotalBalance from '@components/TotalBalance';
import { Heading2, Heading4, Heading5 } from '@components/ui/Typography/Headings';
import { invoicesAtom } from '@data/invoices';
import { Box, Stack } from '@mui/material';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const MobileInvoicesView = () => {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useAtom(invoicesAtom);

  useEffect(() => {
    setInvoices();
  }, [setInvoices]);

  const hasInvoices = (invoices?.invoices?.length ?? 0) > 0;

  return (
    <Box p={3} pb={12}>
      <Stack spacing={5}>
        <Stack spacing={0.5}>
          <Heading2 sx={{ fontSize: '2rem' }}>{t('Invoices')}</Heading2>
          <TotalBalance />
        </Stack>

        <Stack spacing={2}>
          <Heading4
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              opacity: 0.9,
              mb: 1,
            }}
          >
            {t('Unpaid invoices')}
          </Heading4>

          {!hasInvoices && (
            <Stack
              sx={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '20px',
                p: 4,
                border: '1px solid rgba(255, 255, 255, 0.04)',
                textAlign: 'center',
              }}
            >
              <Heading5 sx={{ opacity: 0.4 }}>{t('There is nothing to see here.')}</Heading5>
            </Stack>
          )}

          <Stack spacing={1.5}>
            {invoices?.invoices?.map((invoice) => (
              <InvoiceItem key={invoice.id} invoice={invoice} />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default MobileInvoicesView;
