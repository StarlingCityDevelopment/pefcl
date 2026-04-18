import { cn } from '@utils/cn';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from './ui/Typography';

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, className }) => {
  const { t } = useTranslation();

  return (
    <div className={cn('relative p-5 w-full h-full flex flex-col', className)}>
      {title && (
        <div className='mb-4 pb-3 border-b border-[var(--gta-border)]'>
          <Typography variant='h2' className='text-[var(--gta-text)] font-bold tracking-[0.15em] text-base'>
            {title}
          </Typography>
        </div>
      )}

      <React.Suspense
        fallback={
          <div className='flex flex-col items-center justify-center h-full gap-3 text-[var(--gta-text-dim)]'>
            <Loader2 className='w-5 h-5 animate-spin text-[var(--gta-green)] opacity-60' />
            <Typography variant='pre' className='text-[var(--gta-text-dim)]'>
              {t('Securely loading {{name}}', { name: title || '' })}
            </Typography>
          </div>
        }
      >
        {children}
      </React.Suspense>
    </div>
  );
};

export default Layout;
