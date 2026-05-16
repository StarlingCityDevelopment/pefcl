// web/src/views/transactions/Transactions.tsx
import Layout from "@components/Layout";
import TransactionItem, { TransactionSkeleton } from "@components/TransactionItem";
import Button from "@components/ui/Button";
import Count from "@components/ui/Count";
import { Typography } from "@ui/Typography";
import { TransactionEvents } from "@typings/Events";
import type { GetTransactionsResponse } from "@typings/Transaction";
import { cn } from "@utils/cn";
import { DEFAULT_PAGINATION_LIMIT } from "@utils/constants";
import { fetchNui } from "@utils/fetchNui";
import { ChevronLeft, ChevronRight, History } from 'lucide-solid';
import { createSignal, createResource, Show, For, createMemo } from 'solid-js';
import i18n from "@utils/i18n";

const Transactions = () => {
  const [limit, setLimit] = createSignal(DEFAULT_PAGINATION_LIMIT);
  const [page, setPage] = createSignal(1);
  
  const offset = () => limit() * (page() - 1);

  const [data] = createResource(
    () => ({ limit: limit(), offset: offset() }),
    async ({ limit, offset }) => {
      const res = await fetchNui<GetTransactionsResponse>(TransactionEvents.Get, {
        limit,
        offset,
      });
      return res;
    }
  );

  const transactions = () => data()?.transactions || [];
  const total = () => data()?.total || 0;
  const pages = () => Math.ceil(total() / limit());
  const to = () => offset() + transactions().length;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pages()) {
      setPage(newPage);
    }
  };

  return (
    <Layout title={i18n.t('Ledger History')}>
      <div class='flex flex-col h-full overflow-hidden'>
        <div class='flex items-center justify-between mb-5 px-0.5'>
          <div class='flex items-center gap-3'>
            <Typography variant='pre' class='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] text-[10px]'>
              {i18n.t('Total Records')}
            </Typography>
            <Count amount={total()} />
          </div>
        </div>

        <div class='flex-1 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-1.5 min-h-0'>
          <Show 
            when={!data.loading} 
            fallback={
                <For each={Array.from({ length: 8 })}>
                    {() => <TransactionSkeleton />}
                </For>
            }
          >
            <Show 
                when={transactions().length > 0} 
                fallback={
                    <div class='flex flex-col items-center justify-center py-32 bg-[var(--gta-panel)] border border-dashed border-[var(--gta-border)] opacity-50 gap-3'>
                        <History size={40} class='text-[var(--gta-text-dim)]' />
                        <Typography variant='pre' class='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] text-[10px]'>
                            {i18n.t('Archive empty. No activity detected.')}
                        </Typography>
                    </div>
                }
            >
                <For each={transactions()}>
                    {(transaction) => <TransactionItem transaction={transaction} />}
                </For>
            </Show>
          </Show>
        </div>

        <div class='mt-6 py-5 flex flex-row items-center justify-between border-t border-[var(--gta-border)]'>
          <div class='flex flex-col'>
            <Typography variant='pre' class='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] text-[10px]'>
              {i18n.t('Registry Pagination')}
            </Typography>
            <Typography class='text-xs font-bold text-[var(--gta-text)] tracking-wide'>
              {i18n.t('Showing {{from}}-{{to}} of {{total}} results', { from: offset() + 1, to: to(), total: total() })}
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
              <For each={Array.from({ length: pages() })}>
                {(_, i) => {
                  const isNear = () => Math.abs(page() - (i() + 1)) <= 1;
                  const isEnd = () => i() === 0 || i() === pages() - 1;
                  const shouldShow = () => isNear() || isEnd() || pages() <= 5;

                  return (
                    <Show 
                        when={shouldShow()} 
                        fallback={
                            <Show when={i() === 1 || i() === pages() - 2}>
                                <span class='text-(--gta-text-dim) font-bold text-xs'>..</span>
                            </Show>
                        }
                    >
                        <button
                            type='button'
                            onClick={() => handlePageChange(i() + 1)}
                            class={cn(
                            'w-7 h-7 text-[10px] font-bold tracking-wide transition-all uppercase',
                            page() === i() + 1
                                ? 'bg-(--gta-green) text-black'
                                : 'text-(--gta-text-dim) hover:text-(--gta-text) hover:bg-(--gta-surface)',
                            )}
                        >
                            {i() + 1}
                        </button>
                    </Show>
                  );
                }}
              </For>
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

export default Transactions;
