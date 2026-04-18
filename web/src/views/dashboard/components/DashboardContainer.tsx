import Button from '@ui/Button';
import { Typography } from '@ui/Typography';
import { cn } from '@utils/cn';
import { type Atom, useAtomValue } from 'jotai';
import { Loader2 } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

interface DashboardContainerProps {
  title: string;
  children?: React.ReactNode;
  totalAtom: Atom<number>;
  viewAllRoute: string;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({ title, children, totalAtom, viewAllRoute }) => {
  const total = useAtomValue(totalAtom);
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className='flex flex-col gap-3 p-4 bg-[var(--gta-panel)] border border-[var(--gta-border)] h-full'>
      <header className='flex flex-row justify-between items-center pb-2 border-b border-[var(--gta-border)]'>
        <div className='flex items-center gap-2'>
          <Typography variant='h4' className='text-[var(--gta-text)] font-bold tracking-[0.1em] text-xs'>
            {title}
          </Typography>
          <div className='flex items-center justify-center h-5 px-2 bg-[var(--gta-green)]/10 border border-[var(--gta-green)]/30 text-[9px] font-bold text-[var(--gta-green)]'>
            {total}
          </div>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => navigate(viewAllRoute)}
          className='h-6 px-3 text-[9px] font-bold uppercase tracking-[0.15em]'
        >
          {t('View all')}
        </Button>
      </header>

      <div className='flex-1 max-h-[26rem] overflow-y-auto pr-1 custom-scrollbar relative'>
        <div className='flex flex-col gap-1.5'>{children}</div>
      </div>
    </div>
  );
};

export const DashboardContainerFallback: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className='flex flex-col gap-4 p-5 bg-[var(--gta-panel)] border border-[var(--gta-border)] h-full'>
      <header className='flex flex-row justify-between items-center'>
        <Typography variant='pre' className='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em]'>
          {title}
        </Typography>
      </header>
      <div className='flex-1 flex items-center justify-center p-16'>
        <Loader2 className='w-5 h-5 animate-spin text-[var(--gta-green)] opacity-50' />
      </div>
    </div>
  );
};

export default DashboardContainer;
