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
    <div className='flex flex-col gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 h-full'>
      <header className='flex flex-row justify-between items-center'>
        <div className='flex items-center gap-2'>
          <Typography variant='h3' className='text-white font-medium tracking-tight text-sm'>
            {title}
          </Typography>
          <div className='flex items-center justify-center h-4 px-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-medium text-slate-500'>
            {total}
          </div>
        </div>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => navigate(viewAllRoute)}
          className='h-7 px-3 rounded-full text-[9px] font-medium uppercase tracking-widest'
        >
          {t('View all')}
        </Button>
      </header>

      <div className='flex-1 max-h-[26rem] overflow-y-auto pr-1 custom-scrollbar relative'>
        <div className='flex flex-col gap-2'>{children}</div>
      </div>
    </div>
  );
};

export const DashboardContainerFallback: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className='flex flex-col gap-6 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md h-full -[0_20px_50px_-20px_rgba(0,0,0,0.5)]'>
      <header className='flex flex-row justify-between items-center px-1'>
        <Typography variant='pre' className='text-slate-500 font-black uppercase tracking-widest'>
          {title}
        </Typography>
      </header>
      <div className='flex-1 flex items-center justify-center p-20'>
        <Loader2 className='w-6 h-6 animate-spin text-slate-700' />
      </div>
    </div>
  );
};

export default DashboardContainer;
