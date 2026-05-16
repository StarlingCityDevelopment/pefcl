// web/src/components/BankCard.tsx
import type { Card, InventoryCard } from "@typings/BankCard";
import { cn } from "@utils/cn";
import i18n from "@utils/i18n";
import { Typography } from './ui/Typography';

interface BankCardProps {
  card: Card | InventoryCard;
  isBlocked?: boolean;
  selected?: boolean;
}

const BankCard = (props: BankCardProps) => {
  return (
    <div
      class={cn(
        'group relative flex flex-col justify-between h-[160px] w-full p-5',
        'bg-[var(--gta-panel)] border transition-all duration-150 overflow-hidden',
        props.isBlocked
          ? 'opacity-30 grayscale pointer-events-none cursor-not-allowed'
          : 'cursor-pointer hover:border-[var(--gta-green)]/50 hover:bg-[var(--gta-surface)]',
        props.selected ? 'border-[var(--gta-green)] shadow-[0_0_15px_var(--gta-green-glow)]' : 'border-[var(--gta-border)]',
      )}
    >
      {/* GTA accent line */}
      <div class={cn('absolute top-0 left-0 right-0 h-[2px]', props.selected ? 'bg-[var(--gta-green)]' : 'bg-[var(--gta-border)]')} />

      <div class='relative z-10'>
        <Typography
          variant='pre'
          class='text-[var(--gta-text-dim)] tracking-[0.2em] mb-3 group-hover:text-[var(--gta-green)] transition-colors'
        >
          {i18n.t('Debit Card')}
        </Typography>
        <Typography class='text-base font-mono font-bold text-[var(--gta-text)] tracking-[0.15em] opacity-80 group-hover:opacity-100 transition-all'>
          {props.card.number}
        </Typography>
      </div>

      <div class='relative z-10 flex justify-between items-end'>
        <div class='flex flex-col gap-0.5'>
          <Typography variant='pre' class='text-[8px] text-[var(--gta-text-dim)] uppercase tracking-[0.2em]'>
            {i18n.t('Card holder')}
          </Typography>
          <Typography class='text-xs font-bold text-[var(--gta-text)] uppercase tracking-wide truncate max-w-[140px]'>
            {props.card.holder}
          </Typography>
        </div>

        {/* GTA-style card chip indicator */}
        <div class='flex flex-col items-end gap-1'>
          <div class='w-6 h-4 bg-[var(--gta-yellow)]/40 border border-[var(--gta-yellow)]/20' />
        </div>
      </div>
    </div>
  );
};

export default BankCard;
