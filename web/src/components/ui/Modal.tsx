import { cn } from '@utils/cn';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { Typography } from './Typography';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Modal = React.memo(({ isOpen, onClose, title, children, maxWidth = 'md' }: ModalProps) => {
  const maxWidthClasses = {
    sm: 'max-w-[420px]',
    md: 'max-w-[500px]',
    lg: 'max-w-[600px]',
    xl: 'max-w-[720px]',
    '2xl': 'max-w-[840px]',
  };

  // Use portal to render inside the dashboard container if available, otherwise document.body
  const modalContent = (
    <AnimatePresence mode='wait'>
      {isOpen && (
        <div className='absolute inset-0 z-50 flex justify-end overflow-hidden pointer-events-auto' key='modal-overlay'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='absolute inset-0 bg-black/70'
          />

          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'relative h-full w-full bg-[var(--gta-dark)] border-l-2 border-[var(--gta-green)] shadow-2xl shadow-black flex flex-col',
              maxWidthClasses[maxWidth],
            )}
          >
            {/* GTA header bar */}
            <div className='flex items-center justify-between px-5 py-4 bg-[var(--gta-green)] shrink-0'>
              {title && (
                <Typography variant='h3' className='text-black font-bold text-sm tracking-[0.15em]'>
                  {title}
                </Typography>
              )}
              <button
                type='button'
                onClick={onClose}
                className='p-1 text-black/60 hover:text-black transition-colors'
                aria-label='Close'
              >
                <X className='w-4 h-4' strokeWidth={3} />
              </button>
            </div>

            <div className='p-5 flex-1 overflow-y-auto flex flex-col custom-scrollbar'>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  const portalRoot = document.getElementById('dashboard-modal-root') || document.body;
  return createPortal(modalContent, portalRoot);
});

Modal.displayName = 'Modal';

export { Modal };
