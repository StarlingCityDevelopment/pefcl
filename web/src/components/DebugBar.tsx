import { cn } from '@utils/cn';
import { Settings, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import Button from './ui/Button';
import { Typography } from './ui/Typography';

const Devbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [isAtmOpen, setIsAtmOpen] = useState(false);

  useEffect(() => {
    if (isBankOpen) {
      window.postMessage({ app: 'PEFCL', method: 'setVisible', data: true });
      window.postMessage({ app: 'PEFCL', method: 'setVisibleATM', data: false });
    } else {
      window.postMessage({ app: 'PEFCL', method: 'setVisible', data: false });
    }
  }, [isBankOpen]);

  useEffect(() => {
    if (isAtmOpen) {
      window.postMessage({ app: 'PEFCL', method: 'setVisible', data: false });
      window.postMessage({ app: 'PEFCL', method: 'setVisibleATM', data: true });
    } else {
      window.postMessage({ app: 'PEFCL', method: 'setVisibleATM', data: false });
    }
  }, [isAtmOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='fixed top-24 right-4 z-[9999] w-72 p-6 rounded-[2.5rem] bg-black/95 border border-white/10 backdrop-blur-md -[0_40px_80px_-20px_rgba(0,0,0,0.8)]'
          >
            <div className='flex flex-col gap-6'>
              <div className='flex items-center justify-between'>
                <Typography variant='pre' className='text-slate-500 font-black'>
                  Debug Panel
                </Typography>
                <button
                  type='button'
                  onClick={() => setIsOpen(false)}
                  className='text-slate-600 hover:text-white transition-colors'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>

              <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-1.5'>
                  <Typography className='text-[10px] uppercase font-bold text-slate-600 tracking-widest pl-1'>
                    Interface Controls
                  </Typography>
                  <div className='flex flex-col gap-2'>
                    <Button
                      variant={isBankOpen ? 'primary' : 'secondary'}
                      size='sm'
                      onClick={() => setIsBankOpen((prev) => !prev)}
                      className='w-full justify-between'
                    >
                      <span>Bank UI</span>
                      <span
                        className={cn('w-2 h-2 rounded-full', isBankOpen ? 'bg-white -[0_0_8px_white]' : 'bg-white/10')}
                      />
                    </Button>
                    <Button
                      variant={isAtmOpen ? 'primary' : 'secondary'}
                      size='sm'
                      onClick={() => setIsAtmOpen((prev) => !prev)}
                      className='w-full justify-between'
                    >
                      <span>ATM UI</span>
                      <span
                        className={cn('w-2 h-2 rounded-full', isAtmOpen ? 'bg-white -[0_0_8px_white]' : 'bg-white/10')}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='fixed bottom-6 right-6 z-[9999]'>
        <button
          type='button'
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            'flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300',
            'bg-white/[0.03] border border-white/10 text-slate-500 backdrop-blur-md',
            'hover:scale-110 hover:bg-white/10 hover:text-white hover:border-white/30',
            'active:scale-95',
            isOpen && 'bg-white text-black border-white rotate-90',
          )}
        >
          <Settings className={cn('w-6 h-6', isOpen ? 'fill-black' : 'fill-none')} />
        </button>
      </div>
    </>
  );
};

export default Devbar;
