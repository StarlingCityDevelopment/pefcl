// web/src/components/ui/SidePanel.tsx
import { cn } from "@utils/cn";
import { X } from 'lucide-solid';
import { AnimatePresence, motion } from "motion-solid";
import { type Component, type JSX, Show } from 'solid-js';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  children: JSX.Element;
  zIndex?: number;
  class?: string;
}

const SidePanel: Component<SidePanelProps> = (props) => {
  const zIndex = () => props.zIndex ?? 100;

  return (
    <AnimatePresence>
      <Show when={props.isOpen}>
        <motion.div
          key='side-panel-overlay'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => props.onClose()}
          class='fixed inset-0 bg-black/70'
          style={{ "z-index": zIndex() - 1 }}
        />
        <motion.div
          key='side-panel-content'
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          class={cn(
            'fixed top-0 right-0 h-full bg-bg-panel border-l-2 border-primary p-6 overflow-y-auto',
            props.class,
          )}
          style={{
            width: props.width || '450px',
            "max-width": '90%',
            "z-index": zIndex(),
          }}
        >
          <button
            type='button'
            onClick={() => props.onClose()}
            class='absolute top-4 right-4 w-9 h-9 bg-bg-surface border border-border-main flex items-center justify-center text-text-muted hover:text-fg-main hover:border-primary transition-all duration-150'
          >
            <X class='w-4 h-4' />
          </button>
          <div class='flex flex-col h-full'>{props.children}</div>
        </motion.div>
      </Show>
    </AnimatePresence>
  );
};

export default SidePanel;
