import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { cn } from '@utils/cn';
import { AnimatePresence, motion } from 'motion/react';
import React, { type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface BaseDialogProps {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
  maxWidth?: string;
}

const BaseDialog = React.memo(({ open, onClose, children, className, maxWidth }: BaseDialogProps) => {
  const { isMobile } = useGlobalSettings();

  const dialogContent = (
    <AnimatePresence mode='wait'>
      {open && (
        <div
          className='absolute inset-0 z-60 flex items-center justify-center pointer-events-auto'
          key='base-dialog-overlay'
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='absolute inset-0 bg-black/40 backdrop-blur-[1px]'
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'relative w-full bg-[#0F0F0F] rounded-4xl border border-white/10 shadow-2xl shadow-black flex flex-col p-8 overflow-hidden',
              className,
            )}
            style={{ maxWidth: maxWidth || '500px' }}
          >
            <div className='flex-1 overflow-y-auto flex flex-col custom-scrollbar'>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  const portalRoot = document.getElementById('dashboard-modal-root') || document.body;
  return createPortal(dialogContent, portalRoot);
});

BaseDialog.displayName = 'BaseDialog';

export default BaseDialog;
