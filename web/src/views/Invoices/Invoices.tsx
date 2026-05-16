// web/src/views/invoices/Invoices.tsx
import InvoiceItem from "@components/InvoiceItem";
import Layout from "@components/Layout";
import Button from "@components/ui/Button";
import { Typography } from "@components/ui/Typography";
import { invoicesResource, setInvoicesQuery } from "@data/invoices";
import { cn } from "@utils/cn";
import { ChevronLeft, ChevronRight, ReceiptText } from 'lucide-solid';
import { createSignal, createMemo, Show, For, onMount, createEffect } from 'solid-js';
import i18n from "@utils/i18n";

const Invoices = () => {
  const [page, setPage] = createSignal(1);
  const limit = 7; // Fixed limit as per atom default in previous state

  const invoicesData = () => invoicesResource() || { invoices: [], total: 0, limit: 7 };
  const invoices = () => invoicesData().invoices;
  const total = () => invoicesData().total;
  const pages = () => Math.ceil(total() / limit);

  const offset = () => limit * (page() - 1);
  const to = () => {
      const currentTo = offset() + limit;
      return currentTo > total() ? total() : currentTo;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pages()) {
      setPage(newPage);
    }
  };

  createEffect(() => {
    setInvoicesQuery({
      limit,
      offset: offset(),
    });
  });

  return (
    <Layout title={i18n.t('Outstanding Commitments')}>
      <div class='mb-4'>
        <Typography variant='pre' class='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] text-[10px]'>
          {i18n.t('Financial Obligations Index')}
        </Typography>
      </div>

      <div class='flex-1 flex flex-col gap-4 overflow-y-auto pr-1 min-h-0 custom-scrollbar'>
        <div class='flex flex-col gap-2'>
          <For each={invoices()}>
            {(invoice) => <InvoiceItem invoice={invoice} />}
          </For>
        </div>

        <Show when={invoices().length === 0}>
          <div class='flex flex-col items-center justify-center py-24 bg-[var(--gta-panel)] border border-dashed border-[var(--gta-border)] opacity-50 gap-3'>
            <ReceiptText size={40} class='text-[var(--gta-text-dim)]' />
            <Typography variant='pre' class='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] text-[10px]'>
              {i18n.t('Zero active obligations detected')}
            </Typography>
          </div>
        </Show>

        <div class='mt-auto py-5 flex flex-row items-center justify-between border-t border-[var(--gta-border)]'>
          <div class='flex flex-col'>
            <Typography variant='pre' class='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] text-[10px]'>
              {i18n.t('Registry Pagination')}
            </Typography>
            <Typography class='text-xs font-bold text-[var(--gta-text)] tracking-wide'>
              {i18n.t('Displaying {{from}}-{{to}} of {{total}}', { from: offset() + 1, to: to(), total: Math.max(0, total()) })}
            </Typography>
          </div>

          <div class='flex items-center gap-2'>
            <Button
              variant='secondary'
              size='icon'
              disabled={page() === 1}
              onClick={() => handlePageChange(page() - 1)}
              class='h-8 w-8'
            >
              <ChevronLeft size={16} class='opacity-60' />
            </Button>

            <div class='flex items-center gap-1 px-3 py-1.5 bg-[var(--gta-surface)] border border-[var(--gta-border)]'>
              <Show when={pages() > 0} fallback={
                <div class='w-7 h-7 flex items-center justify-center'>
                  <Typography class='text-[10px] font-bold text-[var(--gta-text-dim)]'>0</Typography>
                </div>
              }>
                <For each={Array.from({ length: pages() })}>
                  {(_, i) => (
                    <button
                      type='button'
                      onClick={() => handlePageChange(i() + 1)}
                      class={cn(
                        'w-7 h-7 text-[10px] font-bold tracking-wide transition-all uppercase',
                        page() === i() + 1
                          ? 'bg-[var(--gta-green)] text-black'
                          : 'text-[var(--gta-text-dim)] hover:text-[var(--gta-text)] hover:bg-[var(--gta-surface)]',
                      )}
                    >
                      {i() + 1}
                    </button>
                  )}
                </For>
              </Show>
            </div>

            <Button
              variant='secondary'
              size='icon'
              disabled={page() === pages() || pages() === 0}
              onClick={() => handlePageChange(page() + 1)}
              class='h-8 w-8'
            >
              <ChevronRight size={16} class='opacity-60' />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Invoices;
