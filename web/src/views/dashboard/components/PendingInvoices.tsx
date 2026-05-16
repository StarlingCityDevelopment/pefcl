// web/src/views/dashboard/components/PendingInvoices.tsx
import InvoiceItem from "@components/InvoiceItem";
import { For } from 'solid-js';
import { unpaidInvoices } from "@data/invoices";

const PendingInvoices = () => {
  return (
    <div class='flex flex-col gap-3'>
      <For each={unpaidInvoices()}>
        {(invoice) => (
          <InvoiceItem invoice={invoice} />
        )}
      </For>
    </div>
  );
};

export default PendingInvoices;
