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
    <div className={cn('relative p-6 w-full h-full flex flex-col', className)}>
      {title && (
        <div className='mb-5'>
          <Typography variant='h2' className='tracking-tight text-white font-bold text-xl'>
            {title}
          </Typography>
        </div>
      )}

      <React.Suspense
        fallback={
          <div className='flex flex-col items-center justify-center h-full gap-4 text-slate-500'>
            <Loader2 className='w-6 h-6 animate-spin opacity-20' />
            <Typography variant='pre' className='text-slate-500 font-medium'>
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
