// web/src/components/ui/Modal.tsx
import { cn } from "@utils/cn";
import { X } from 'lucide-solid';
import { motion, AnimatePresence } from "motion-solid";
import { type ParentProps, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Typography } from './Typography';

interface ModalProps extends ParentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Modal = (props: ModalProps) => {
  const maxWidthClasses = {
    sm: 'max-w-[420px]',
    md: 'max-w-[500px]',
    lg: 'max-w-[600px]',
    xl: 'max-w-[720px]',
    '2xl': 'max-w-[840px]',
  };

  const portalRoot = () => document.getElementById('dashboard-modal-root') || document.body;

  return (
    <Portal mount={portalRoot()}>
      <AnimatePresence mode="wait">
        <Show when={props.isOpen}>
          <div class='absolute inset-0 z-50 flex justify-end overflow-hidden pointer-events-auto'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => props.onClose()}
              class='absolute inset-0 bg-black/70'
            />

            <motion.div
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ easing: [0.16, 1, 0.3, 1], duration: 0.4 }}
              class={cn(
                'relative h-full w-full bg-[var(--gta-dark)] border-l-2 border-[var(--gta-green)] shadow-2xl shadow-black flex flex-col',
                maxWidthClasses[props.maxWidth || 'md'],
              )}
            >
              {/* GTA header bar */}
              <div class='flex items-center justify-between px-5 py-4 bg-[var(--gta-green)] shrink-0'>
                <Show when={props.title}>
                  <Typography variant='h3' class='text-black font-bold text-sm tracking-[0.15em]'>
                    {props.title}
                  </Typography>
                </Show>
                <button
                  type='button'
                  onClick={() => props.onClose()}
                  class='p-1 text-black/60 hover:text-black transition-colors'
                  aria-label='Close'
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>

              <div class='p-5 flex-1 overflow-y-auto flex flex-col custom-scrollbar'>
                {props.children}
              </div>
            </motion.div>
          </div>
        </Show>
      </AnimatePresence>
    </Portal>
  );
};

export { Modal };
