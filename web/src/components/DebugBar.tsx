// web/src/components/DebugBar.tsx
import { cn } from "@utils/cn";
import { Settings, X } from 'lucide-solid';
import { createSignal, createEffect, Show } from 'solid-js';
import Button from './ui/Button';
import { Typography } from './ui/Typography';

const Devbar = () => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [isBankOpen, setIsBankOpen] = createSignal(false);
  const [isAtmOpen, setIsAtmOpen] = createSignal(false);

  createEffect(() => {
    if (isBankOpen()) {
      window.postMessage({ app: 'PEFCL', action: 'setVisible', data: true });
      window.postMessage({ app: 'PEFCL', action: 'setVisibleATM', data: false });
    } else {
      window.postMessage({ app: 'PEFCL', action: 'setVisible', data: false });
    }
  });

  createEffect(() => {
    if (isAtmOpen()) {
      window.postMessage({ app: 'PEFCL', action: 'setVisible', data: false });
      window.postMessage({ app: 'PEFCL', action: 'setVisibleATM', data: true });
    } else {
      window.postMessage({ app: 'PEFCL', action: 'setVisibleATM', data: false });
    }
  });

  return (
    <>
      <Show when={isOpen()}>
        <div
          class='fixed top-24 right-4 z-[9999] w-72 p-6 rounded-[2.5rem] bg-black/95 border border-white/10 backdrop-blur-md shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]'
        >
          <div class='flex flex-col gap-6'>
            <div class='flex items-center justify-between'>
              <Typography variant='pre' class='text-slate-500 font-black'>
                Debug Panel
              </Typography>
              <button
                type='button'
                onClick={() => setIsOpen(false)}
                class='text-slate-600 hover:text-white transition-colors'
              >
                <X size={16} />
              </button>
            </div>

            <div class='flex flex-col gap-3'>
              <div class='flex flex-col gap-1.5'>
                <Typography class='text-[10px] uppercase font-bold text-slate-600 tracking-widest pl-1'>
                  Interface Controls
                </Typography>
                <div class='flex flex-col gap-2'>
                  <Button
                    variant={isBankOpen() ? 'primary' : 'secondary'}
                    size='sm'
                    onClick={() => setIsBankOpen((prev) => !prev)}
                    class='w-full justify-between'
                  >
                    <span>Bank UI</span>
                    <span
                      class={cn('w-2 h-2 rounded-full', isBankOpen() ? 'bg-white shadow-[0_0_8px_white]' : 'bg-white/10')}
                    />
                  </Button>
                  <Button
                    variant={isAtmOpen() ? 'primary' : 'secondary'}
                    size='sm'
                    onClick={() => setIsAtmOpen((prev) => !prev)}
                    class='w-full justify-between'
                  >
                    <span>ATM UI</span>
                    <span
                      class={cn('w-2 h-2 rounded-full', isAtmOpen() ? 'bg-white shadow-[0_0_8px_white]' : 'bg-white/10')}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>

      <div class='fixed bottom-6 right-6 z-[9999]'>
        <button
          type='button'
          onClick={() => setIsOpen((prev) => !prev)}
          class={cn(
            'flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300',
            'bg-white/[0.03] border border-white/10 text-slate-500 backdrop-blur-md',
            'hover:scale-110 hover:bg-white/10 hover:text-white hover:border-white/30',
            'active:scale-95',
            isOpen() && 'bg-white text-black border-white rotate-90',
          )}
        >
          <Settings size={24} class={cn(isOpen() ? 'fill-black' : 'fill-none')} />
        </button>
      </div>
    </>
  );
};

export default Devbar;
