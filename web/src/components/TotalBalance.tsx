// web/src/components/TotalBalance.tsx
import { totalBalance } from "@data/accounts";
import { useConfig } from "@hooks/useConfig";
import { useGlobalSettings } from "@hooks/useGlobalSettings";
import { formatMoney } from "@utils/currency";
import i18n from "@utils/i18n";
import { Typography } from './ui/Typography';

const TotalBalance = () => {
  const config = useConfig();
  const { isMobile } = useGlobalSettings();

  return (
    <div class='flex flex-col gap-1 group cursor-default'>
      <Typography
        variant='label'
        class='text-[10px] text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.2em]'
      >
        {isMobile() ? i18n.t('Current Balance') : i18n.t('Total Balance')}
      </Typography>
      <Typography
        variant='h1'
        class='text-2xl sm:text-3xl font-bold text-[var(--gta-green)] leading-none tracking-wide break-all sm:break-normal'
      >
        {formatMoney(totalBalance(), config()?.general)}
      </Typography>
    </div>
  );
};

export default TotalBalance;
