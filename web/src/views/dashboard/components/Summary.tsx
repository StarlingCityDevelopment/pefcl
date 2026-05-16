// web/src/views/dashboard/components/Summary.tsx
import WeekGraph from "@components/WeekGraph";
import { useConfig } from "@hooks/useConfig";
import { TransactionEvents } from "@typings/Events";
import type { GetTransactionHistoryResponse } from "@typings/Transaction";
import { Typography } from "@ui/Typography";
import { cn } from "@utils/cn";
import { formatMoney } from "@utils/currency";
import { fetchNui } from "@utils/fetchNui";
import { createSignal, onMount, createResource, Show } from 'solid-js';
import i18n from "@utils/i18n";

const DashboardSummary = () => {
  const config = useConfig();
  const [data] = createResource<GetTransactionHistoryResponse | undefined>(async () => {
    try {
      return await fetchNui<GetTransactionHistoryResponse>(TransactionEvents.GetHistory);
    } catch (err) {
      console.error('Failed to fetch dashboard history:', err);
      return undefined;
    }
  });

  return (
    <div class='flex flex-col gap-5 p-6 bg-bg-panel border border-border-main h-full shadow-premium'>
      <div class='flex flex-col gap-1 pb-4 border-b border-border-main'>
        <Typography variant='pre' class='text-text-muted font-mono'>
          {i18n.t('Weekly summary')}
        </Typography>
        <Typography variant='h3' class='text-fg-main font-display font-black tracking-tight text-lg'>
          {i18n.t('PERFORMANCE')}
        </Typography>
      </div>

      <div class='flex flex-row gap-4'>
        <div class='flex-1 p-5 bg-bg-surface border border-border-main transition-all hover:border-emerald-500/30 group cursor-default relative'>
          <div class='absolute top-0 left-0 right-0 h-[2px] bg-emerald-500' />
          <Typography variant='label' class='mb-2 block text-text-muted font-sans font-bold'>
            {i18n.t('Total Income')}
          </Typography>
          <Typography class='text-2xl font-display font-black text-emerald-500 leading-none'>
            {formatMoney(data()?.income ?? 0, config()?.general)}
          </Typography>
        </div>
 
        <div class='flex-1 p-5 bg-bg-surface border border-border-main transition-all hover:border-red-400/30 group cursor-default relative'>
          <div class='absolute top-0 left-0 right-0 h-[2px] bg-red-400' />
          <Typography variant='label' class='mb-2 block text-text-muted font-sans font-bold'>
            {i18n.t('Total Expenses')}
          </Typography>
          <Typography class='text-2xl font-display font-black text-red-400 leading-none'>
            {formatMoney(data()?.expenses ?? 0, config()?.general)}
          </Typography>
        </div>
      </div>

      <div class='flex-1 flex flex-col gap-4 mt-2'>
        <div class='flex items-center justify-between'>
          <Typography variant='pre' class='text-text-muted font-mono'>
            {i18n.t('Activity Feed')}
          </Typography>
          <div class='flex gap-4'>
            <div class='flex items-center gap-2'>
              <div class='w-2 h-2 rounded-full bg-emerald-500' />
              <Typography variant='pre' class='text-[8px] text-text-muted font-mono'>
                {i18n.t('Income')}
              </Typography>
            </div>
            <div class='flex items-center gap-2'>
              <div class='w-2 h-2 rounded-full bg-red-400' />
              <Typography variant='pre' class='text-[8px] text-text-muted font-mono'>
                {i18n.t('Expense')}
              </Typography>
            </div>
          </div>
        </div>

        <div class='flex-1 min-h-[140px] relative'>
          <Show when={data()}>
            {(d) => <WeekGraph data={d().lastWeek ?? {}} />}
          </Show>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
