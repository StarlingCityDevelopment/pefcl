import InvoiceItem from '@components/InvoiceItem';
import { useAtomValue } from 'jotai';
import type React from 'react';
import { unpaidInvoicesAtom } from '../../../data/invoices';

const PendingInvoices: React.FC = () => {
  const invoices = useAtomValue(unpaidInvoicesAtom);

  return (
    <div className='flex flex-col gap-3'>
      {invoices.map((invoice) => (
        <InvoiceItem key={invoice.id} invoice={invoice} />
      ))}
    </div>
  );
};

export default PendingInvoices;
