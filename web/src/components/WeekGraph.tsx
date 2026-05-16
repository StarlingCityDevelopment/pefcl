// web/src/components/WeekGraph.tsx
import { useConfig } from "@hooks/useConfig";
import type { GetTransactionHistoryResponse } from "@typings/Transaction";
import { cn } from "@utils/cn";
import { formatMoney } from "@utils/currency";
import { motion, AnimatePresence } from "motion-solid";
import { createSignal, Show, For } from 'solid-js';
import i18n from "@utils/i18n";
import { Typography } from './ui/Typography';

interface ColumnProps {
  date: Date;
  income: number;
  expenses: number;
  maxHeight: number;
}

const Column = (props: ColumnProps) => {
  const config = useConfig();
  const [isHovered, setIsHovered] = createSignal(false);

  const incomeHeight = () => (props.income / (props.maxHeight || 1)) * 100;
  const expenseHeight = () => (Math.abs(props.expenses) / (props.maxHeight || 1)) * 100;

  return (
    <div
      class='relative flex flex-col items-center group cursor-default'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        <Show when={isHovered()}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            class='absolute bottom-full mb-2 z-50 p-3 bg-[var(--gta-dark)] border border-[var(--gta-green)]/30 shadow-[0_8px_24px_rgba(0,0,0,0.6)] min-w-[120px]'
          >
            <div class='flex flex-col gap-2'>
              <div class='flex flex-col gap-0.5'>
                <Typography variant='pre' class='text-[var(--gta-text-dim)] text-[8px]'>
                  {i18n.t('Income')}
                </Typography>
                <Typography class='text-xs font-bold text-[var(--gta-green)]'>
                  {formatMoney(props.income, config()?.general)}
                </Typography>
              </div>
              <div class='h-[1px] w-full bg-[var(--gta-border)]' />
              <div class='flex flex-col gap-0.5'>
                <Typography variant='pre' class='text-[var(--gta-text-dim)] text-[8px]'>
                  {i18n.t('Expense')}
                </Typography>
                <Typography class='text-xs font-bold text-[var(--gta-red)]'>
                  {formatMoney(props.expenses, config()?.general)}
                </Typography>
              </div>
            </div>
          </motion.div>
        </Show>
      </AnimatePresence>

      <div class='flex items-end gap-[2px] h-28 mb-2'>
        <div
          class={cn(
            'w-2 transition-all duration-300',
            'bg-[var(--gta-red)]/30 group-hover:bg-[var(--gta-red)]/60',
          )}
          style={{ height: `${Math.max(4, expenseHeight())}%` }}
        />
        <div
          class={cn(
            'w-2 transition-all duration-300',
            'bg-[var(--gta-green)]/40 group-hover:bg-[var(--gta-green)]',
          )}
          style={{ height: `${Math.max(4, incomeHeight())}%` }}
        />
      </div>

      <Typography
        variant='pre'
        class='text-[9px] font-bold text-[var(--gta-text-dim)] group-hover:text-[var(--gta-green)] transition-colors'
      >
        {props.date.getDate()}
      </Typography>
    </div>
  );
};

interface WeekGraphProps {
  data: GetTransactionHistoryResponse['lastWeek'];
  class?: string;
}

const WeekGraph = (props: WeekGraphProps) => {
  const values = () => Object.values(props.data);
  const incomeMax = () => Math.max(...values().map((v) => v.income), 0);
  const expenseMax = () => Math.max(...values().map((v) => Math.abs(v.expenses)), 0);
  const maxHeight = () => Math.max(incomeMax(), expenseMax());

  return (
    <div class={cn('flex flex-row items-end justify-between w-full h-full pt-8 px-2', props.class)}>
      <For each={Object.entries(props.data)}>
        {([key, value]) => (
          <Column {...value} maxHeight={maxHeight()} date={new Date(key)} />
        )}
      </For>
    </div>
  );
};

export default WeekGraph;
