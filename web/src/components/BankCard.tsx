import type { Card, InventoryCard } from '@typings/BankCard';
import { useTranslation } from 'react-i18next';
import { MasterCardIcon } from '../icons/MasterCardIcon';
import { Typography } from './ui/Typography';
import { cn } from '@utils/cn';

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
        "group relative flex flex-col justify-between h-[180px] w-full p-6 rounded-2xl",
        "bg-white/[0.03] border transition-all duration-300 backdrop-blur-md overflow-hidden",
        isBlocked 
          ? "opacity-30 grayscale pointer-events-none cursor-not-allowed" 
          : "cursor-pointer hover:bg-white/[0.06] hover:border-white/20",
        selected 
          ? "bg-white/[0.08] border-white ring-1 ring-white/20" 
          : "border-white/5"
      )}
    >
      {/* Glossy edge effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
      
      <div className="relative z-10">
        <Typography 
          variant="pre" 
          className="text-slate-500 font-black tracking-[0.2em] mb-3 group-hover:text-white/60 transition-colors"
        >
          {t('Debit Card')}
        </Typography>
        <Typography 
          className="text-lg font-mono font-black text-white tracking-[0.15em] opacity-80 group-hover:opacity-100 transition-all"
        >
          {card.number}
        </Typography>
      </div>

      <div className="relative z-10 flex justify-between items-end">
        <div className="flex flex-col gap-0.5">
          <Typography variant="pre" className="text-[8px] text-slate-500 font-black uppercase tracking-widest">
            {t('Card holder')}
          </Typography>
          <Typography className="text-[13px] font-black text-white uppercase italic tracking-tight truncate max-w-[140px]">
            {card.holder}
          </Typography>
        </div>

        <div className="relative">
          <MasterCardIcon 
            style={{ width: 32, filter: 'grayscale(1) brightness(1.5)' }} 
            className="opacity-30 group-hover:opacity-70 transition-all duration-700" 
          />
        </div>
      </div>
    </div>
  );
};

export default BankCard;
