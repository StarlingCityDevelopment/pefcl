import InvoiceItem from '@components/InvoiceItem';
import { Stack } from '@mui/material';
import { useAtom } from 'jotai';
import type React from 'react';
import { unpaidInvoicesAtom } from '../../../data/invoices';

const PendingInvoices: React.FC = () => {
  const [invoices] = useAtom(unpaidInvoicesAtom);

  return (
    <Stack spacing={2}>
      {invoices.map((invoice) => (
        <InvoiceItem key={invoice.id} invoice={invoice} />
      ))}
    </Stack>
  );
};

export default PendingInvoices;
