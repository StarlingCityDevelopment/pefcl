import { cn } from '@utils/cn';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  children: React.ReactNode;
  zIndex?: number;
  className?: string;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, width, children, zIndex = 100, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key='side-panel-overlay'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className='fixed inset-0 bg-black/70'
            style={{ zIndex: zIndex - 1 }}
          />
          <motion.div
            key='side-panel-content'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className={cn(
              'fixed top-0 right-0 h-full bg-[var(--gta-dark)] border-l-2 border-[var(--gta-green)] p-6 overflow-y-auto',
              className,
            )}
            style={{
              width: width || '450px',
              maxWidth: '90%',
              zIndex: zIndex,
            }}
          >
            <button
              type='button'
              onClick={onClose}
              className='absolute top-4 right-4 w-9 h-9 bg-[var(--gta-surface)] border border-[var(--gta-border)] flex items-center justify-center text-[var(--gta-text-dim)] hover:text-[var(--gta-text)] hover:border-[var(--gta-green)] transition-all duration-150'
            >
              <X className='w-4 h-4' />
            </button>
            <div className='flex flex-col h-full'>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidePanel;
