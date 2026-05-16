// web/src/views/Mobile/views/Dashboard/MobileDashboardView.tsx
import { AccountCard } from "@components/AccountCard";
import InvoiceItem from "@components/InvoiceItem";
import TotalBalance from "@components/TotalBalance";
import TransactionItem from "@components/TransactionItem";
import { unpaidInvoices } from "@data/invoices";
import type { Account } from "@typings/Account";
import { TransactionEvents } from "@typings/Events";
import type { Transaction, GetTransactionsResponse } from "@typings/Transaction";
import { Typography } from "@ui/Typography";
import { fetchNui } from "@utils/fetchNui";
import { createSignal, createResource, Show, For, createMemo } from 'solid-js';
import i18n from "@utils/i18n";
import { accounts, defaultAccount } from "@data/accounts";

const SectionHeader = (props: { title: string; count?: number }) => (
  <header class='flex items-center justify-between mb-2 px-1'>
    <div class='flex flex-col gap-1'>
      <Typography variant='pre' class='text-slate-500 font-black'>
        {props.title}
      </Typography>
    </div>
    <Show when={props.count !== undefined}>
      <div class='h-5 px-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-slate-500 flex items-center'>
        {props.count}
      </div>
    </Show>
  </header>
);

const MobileDashboardView = () => {
  const [data] = createResource<{ total: number; transactions: Transaction[] }>(async () => {
      const res = await fetchNui<GetTransactionsResponse>(TransactionEvents.Get, {
        offset: 0,
        limit: 5,
      });
      return { total: res?.total || 0, transactions: res?.transactions || [] };
  });

  const transactions = () => data()?.transactions || [];
  const invoicesList = () => unpaidInvoices();

  return (
    <div class='flex flex-col gap-10 p-6 pb-20'>
      <div class='flex flex-col gap-1'>
        <Typography variant='h1' class='text-3xl'>
          {i18n.t('Dashboard')}
        </Typography>
        <TotalBalance />
      </div>

      <div class='flex flex-col gap-3'>
        <SectionHeader title={i18n.t('Default account')} />
        <Show when={defaultAccount()} fallback={
          <div class='p-8 rounded-[2rem] border border-dashed border-white/10 flex items-center justify-center'>
            <Typography variant='muted'>{i18n.t('No default account')}</Typography>
          </div>
        }>
          <AccountCard account={defaultAccount()!} />
        </Show>
      </div>

      <div class='flex flex-col gap-4'>
        <SectionHeader title={i18n.t('Latest transactions')} count={data()?.total} />
        <div class='flex flex-col gap-2'>
          <For each={transactions()}>
            {(transaction) => <TransactionItem transaction={transaction} isLimitedSpace />}
          </For>
          <Show when={!data.loading && transactions().length === 0}>
            <div class='p-12 rounded-[2rem] bg-white/[0.01] border border-white/5 flex items-center justify-center'>
              <Typography variant='muted' class='italic'>
                {i18n.t('No recent transactions')}
              </Typography>
            </div>
          </Show>
        </div>
      </div>

      <div class='flex flex-col gap-4'>
        <SectionHeader title={i18n.t('Unpaid invoices')} count={invoicesList().length} />
        <div class='flex flex-col gap-3'>
          <For each={invoicesList()}>
            {(invoice) => <InvoiceItem invoice={invoice} />}
          </For>
          <Show when={invoicesList().length === 0}>
            <div class='p-12 rounded-[2.5rem] bg-white/[0.01] border border-white/5 flex items-center justify-center'>
              <Typography variant='muted' class='italic'>
                {i18n.t('All caught up!')}
              </Typography>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboardView;
