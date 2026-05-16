// web/src/components/ui/NewBalance.tsx
import { useConfig } from "@hooks/useConfig";
import { cn } from "@utils/cn";
import { formatMoney } from "@utils/currency";
import i18n from "@utils/i18n";
import { Typography } from './Typography';

interface NewBalanceProps {
  amount: number;
  isValid: boolean;
  newBalanceText?: string;
}

const NewBalance = (props: NewBalanceProps) => {
  const config = useConfig();

  return (
    <div class='flex items-center gap-2 px-0.5 py-1'>
      <Typography class='text-[11px] font-medium text-[var(--gta-text-dim)] tracking-wide uppercase'>
        {props.newBalanceText ?? i18n.t('New balance')}:
      </Typography>
      <Typography
        class={cn(
          'text-[11px] font-bold tracking-wide',
          props.isValid ? 'text-[var(--gta-green)]' : 'text-[var(--gta-red)]',
        )}
      >
        {formatMoney(props.amount, config()?.general)}
      </Typography>
    </div>
  );
};

export default NewBalance;
