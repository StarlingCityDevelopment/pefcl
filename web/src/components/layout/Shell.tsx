// web/src/components/layout/Shell.tsx
import { cn } from "@utils/cn";
import type { ParentProps } from 'solid-js';
import Sidebar from '../Sidebar';

interface ShellProps extends ParentProps {
  class?: string;
}

/**
 * GTA V iFruit-style layout shell for the desktop bank application.
 */
const Shell = (props: ShellProps) => {
  return (
    <div class='fixed inset-0 z-10 flex items-center justify-center bg-transparent pointer-events-none overflow-hidden'>
      <main
        class={cn(
          'flex flex-row w-[1400px] h-[800px] max-w-[95vw] max-h-[90vh]',
          'overflow-hidden bg-bg-main',
          'border border-border-main shadow-premium',
          'relative pointer-events-auto',
          props.class,
        )}
      >


        <Sidebar aria-label='Main Navigation' />
        <section
          id='main-content'
          class='flex-1 h-full overflow-y-auto overflow-x-hidden p-0 relative custom-scrollbar'
        >
          {props.children}
        </section>

        {/* Modal Portal Root - ensures modals stay within dashboard boundaries */}
        <div id='dashboard-modal-root' class='absolute inset-0 pointer-events-none z-[100]' />
      </main>
    </div>
  );
};

export default Shell;
