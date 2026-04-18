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
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className='fixed inset-0 bg-black/40 backdrop-blur-md'
            style={{ zIndex: zIndex - 1 }}
          />
          <motion.div
            key='side-panel-content'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className={cn(
              'fixed top-0 right-0 h-full bg-[#0A0A0A] border-l border-white/5 p-8 overflow-y-auto',
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
              className='absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all duration-200'
            >
              <X className='w-5 h-5' />
            </button>
            <div className='flex flex-col h-full'>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidePanel;
