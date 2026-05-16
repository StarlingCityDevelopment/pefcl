// web/src/views/Mobile/views/Invoices/MobileInvoicesView.tsx
import InvoiceItem from "@components/InvoiceItem";
import TotalBalance from "@components/TotalBalance";
import { invoicesResource, refetchInvoices } from "@data/invoices";
import { Typography } from "@ui/Typography";
import { cn } from "@utils/cn";
import { onMount, For, Show } from 'solid-js';
import i18n from "@utils/i18n";

const MobileInvoicesView = () => {
  onMount(() => {
    refetchInvoices();
  });

  const invoices = () => invoicesResource()?.invoices ?? [];
  const hasInvoices = () => invoices().length > 0;

  return (
    <div class='flex flex-col gap-10 p-6 pb-20'>
      <div class='flex flex-col gap-1'>
        <Typography variant='h1' class='text-4xl'>
          {i18n.t('Bills')}
        </Typography>
        <TotalBalance />
      </div>

      <div class='flex flex-col gap-4'>
        <header class='flex items-center justify-between mb-2 px-1'>
          <Typography variant='pre' class='text-slate-500 font-black'>
            {i18n.t('Unpaid statement')}
          </Typography>
          <Show when={hasInvoices()}>
            <div class='h-5 px-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-slate-500 flex items-center'>
              {invoices().length}
            </div>
          </Show>
        </header>

        <div class='flex flex-col gap-3'>
          <For each={invoices()}>
            {(invoice) => <InvoiceItem invoice={invoice} />}
          </For>

          <Show when={!invoicesResource.loading && !hasInvoices()}>
            <div class='p-16 rounded-[3rem] bg-white/[0.01] border border-white/5 flex flex-col items-center gap-4 text-center'>
              <div class='w-12 h-12 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center'>
                <div class='w-2 h-2 rounded-full bg-slate-700 animate-pulse' />
              </div>
              <Typography variant='muted' class='italic max-w-[180px]'>
                {i18n.t('Your statement is clear. No pending invoices found.')}
              </Typography>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default MobileInvoicesView;
