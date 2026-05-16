// web/src/components/Modals/BaseDialog.tsx
import { useGlobalSettings } from "@hooks/useGlobalSettings";
import { cn } from "@utils/cn";
import { AnimatePresence, motion } from "motion-solid";
import { type Component, type JSX, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

interface BaseDialogProps {
  open: boolean;
  onClose?: () => void;
  children: JSX.Element;
  class?: string;
  maxWidth?: string;
}

const BaseDialog: Component<BaseDialogProps> = (props) => {
  const { isMobile } = useGlobalSettings();
  const portalRoot = () => document.getElementById('dashboard-modal-root') || document.body;

  return (
    <Portal mount={portalRoot()}>
      <AnimatePresence>
        <Show when={props.open}>
          <div
            class='absolute inset-0 z-60 flex items-center justify-center pointer-events-auto'
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => props.onClose?.()}
              class='absolute inset-0 bg-black/60 backdrop-blur-sm'
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              class={cn(
                'relative w-full bg-bg-panel border border-border-main shadow-premium flex flex-col p-8 overflow-hidden',
                props.class,
              )}
              style={{ "max-width": props.maxWidth || '500px' }}
            >
              <div class='flex-1 overflow-y-auto flex flex-col custom-scrollbar'>
                {props.children}
              </div>
            </motion.div>
          </div>
        </Show>
      </AnimatePresence>
    </Portal>
  );
};

export default BaseDialog;
