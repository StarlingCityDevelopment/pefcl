import React from 'react';
import MobileFooter from './Components/MobileFooter';
import MobileRoutes from './Routes';
import { Loader2 } from 'lucide-react';
import { Typography } from '@ui/Typography';
import { cn } from '@utils/cn';

const LoadingFallback = ({ message }: { message: string }) => (
 <div className="flex-1 flex flex-col items-center justify-center gap-4">
 <Loader2 className="w-8 h-8 animate-spin text-white/20" />
 <Typography variant="pre" className="text-slate-500 font-bold tracking-[0.2em] uppercase text-[10px]">
 {message}
 </Typography>
 </div>
);

const MobileApp = () => {
  return (
    <div className="absolute inset-0 flex flex-col h-[100dvh] w-full bg-black text-white overflow-hidden font-sans select-none">
      <div className="flex-1 overflow-y-auto no-scrollbar pb-[calc(76px+env(safe-area-inset-bottom))]">
        <React.Suspense fallback={<LoadingFallback message={'Securely Loading'} />}>
          <MobileRoutes />
        </React.Suspense>
      </div>
      <MobileFooter />
    </div>
  );
};


export default MobileApp;
