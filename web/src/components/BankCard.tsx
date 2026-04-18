import type { Card, InventoryCard } from '@typings/BankCard';
import { cn } from '@utils/cn';
import { useTranslation } from 'react-i18next';
import { Typography } from './ui/Typography';

interface BankCardProps {
  card: Card | InventoryCard;
  isBlocked?: boolean;
  selected?: boolean;
}

const BankCard = ({ card, selected = false, isBlocked = false }: BankCardProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between h-[160px] w-full p-5',
        'bg-[var(--gta-panel)] border transition-all duration-150 overflow-hidden',
        isBlocked
          ? 'opacity-30 grayscale pointer-events-none cursor-not-allowed'
          : 'cursor-pointer hover:border-[var(--gta-green)]/50 hover:bg-[var(--gta-surface)]',
        selected ? 'border-[var(--gta-green)] shadow-[0_0_15px_var(--gta-green-glow)]' : 'border-[var(--gta-border)]',
      )}
    >
      {/* GTA accent line */}
      <div className={cn('absolute top-0 left-0 right-0 h-[2px]', selected ? 'bg-[var(--gta-green)]' : 'bg-[var(--gta-border)]')} />

      <div className='relative z-10'>
        <Typography
          variant='pre'
          className='text-[var(--gta-text-dim)] tracking-[0.2em] mb-3 group-hover:text-[var(--gta-green)] transition-colors'
        >
          {t('Debit Card')}
        </Typography>
        <Typography className='text-base font-mono font-bold text-[var(--gta-text)] tracking-[0.15em] opacity-80 group-hover:opacity-100 transition-all'>
          {card.number}
        </Typography>
      </div>

      <div className='relative z-10 flex justify-between items-end'>
        <div className='flex flex-col gap-0.5'>
          <Typography variant='pre' className='text-[8px] text-[var(--gta-text-dim)] uppercase tracking-[0.2em]'>
            {t('Card holder')}
          </Typography>
          <Typography className='text-xs font-bold text-[var(--gta-text)] uppercase tracking-wide truncate max-w-[140px]'>
            {card.holder}
          </Typography>
        </div>

        {/* GTA-style card chip indicator */}
        <div className='flex flex-col items-end gap-1'>
          <div className='w-6 h-4 bg-[var(--gta-yellow)]/40 border border-[var(--gta-yellow)]/20' />
        </div>
      </div>
    </div>
  );
};

export default BankCard;
