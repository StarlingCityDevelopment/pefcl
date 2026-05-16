// web/src/components/Summary.tsx
import { cn } from "@utils/cn";
import i18n from "@utils/i18n";
import { useConfig } from "@hooks/useConfig";
import { formatMoney } from "@utils/currency";
import { Typography } from './ui/Typography';

interface SummaryRowProps {
  label: string;
  amount: number;
  isTotal?: boolean;
}

const SummaryRow = (props: SummaryRowProps) => {
  const config = useConfig();
  return (
    <div class='flex justify-between items-center py-2'>
      <Typography class={cn('text-xs font-medium uppercase tracking-wide', props.isTotal ? 'text-[var(--gta-text-muted)]' : 'text-[var(--gta-text-dim)]')}>
        {props.label}
      </Typography>
      <Typography
        class={cn(
          'text-sm font-bold',
          props.isTotal ? 'text-[var(--gta-green)]' : 'text-[var(--gta-text)]',
        )}
      >
        {formatMoney(props.amount, config()?.general)}
      </Typography>
    </div>
  );
};

interface SummaryProps {
  balance: number;
  payment: number;
}

const Summary = (props: SummaryProps) => {
  return (
    <div class='flex flex-col gap-1 p-4 bg-[var(--gta-panel)] border border-[var(--gta-border)]'>
      <Typography variant='pre' class='text-[10px] text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] mb-2'>
        {i18n.t('Financial Summary')}
      </Typography>

      <div class='flex flex-col divide-y divide-[var(--gta-border)]'>
        <SummaryRow label={i18n.t('Current Balance')} amount={props.balance} />
        <SummaryRow label={i18n.t('Initial Payment')} amount={-props.payment} />
        <div class='pt-2'>
          <SummaryRow label={i18n.t('New balance')} amount={props.balance - props.payment} isTotal />
        </div>
      </div>
    </div>
  );
};

export default Summary;
