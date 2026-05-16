// web/src/views/Mobile/Mobile.tsx
import { Typography } from "@ui/Typography";
import { Loader2 } from 'lucide-solid';
import { Suspense } from 'solid-js';
import MobileFooter from './Components/MobileFooter';
import MobileRoutes from './Routes';

import type { ParentProps } from 'solid-js';

const LoadingFallback = (props: { message: string }) => (
  <div class='flex-1 flex flex-col items-center justify-center gap-4'>
    <Loader2 size={32} class='animate-spin text-white/20' />
    <Typography variant='pre' class='text-slate-500 font-bold tracking-[0.2em] uppercase text-[10px]'>
      {props.message}
    </Typography>
  </div>
);

const MobileApp = (props: ParentProps) => {
  return (
    <div class='absolute inset-0 flex flex-col h-[100dvh] w-full bg-black text-white overflow-hidden font-sans select-none pt-[env(safe-area-inset-top)]'>
      <div class='flex-1 overflow-y-auto no-scrollbar pb-[calc(76px+env(safe-area-inset-bottom))]'>
        <Suspense fallback={<LoadingFallback message={'Securely Loading'} />}>
          {props.children}
        </Suspense>
      </div>
      <MobileFooter />
    </div>
  );
};

export default MobileApp;
