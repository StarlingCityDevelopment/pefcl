import { cn } from '@utils/cn';
import type React from 'react';
import Sidebar from '../Sidebar';

interface ShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * The core layout shell for the desktop bank application.
 * Migrated to Tailwind CSS for maximum flexibility.
 */
const Shell: React.FC<ShellProps> = ({ children, className }) => {
  return (
    <div className='fixed inset-0 z-10 flex items-center justify-center bg-transparent pointer-events-none overflow-hidden'>
      <main
        className={cn(
          'flex flex-row w-[1400px] h-[800px] max-w-[95vw] max-h-[90vh]',
          'overflow-hidden rounded-[2.5rem] bg-black/90 backdrop-blur-md',
          'border border-white/[0.08]',
          'relative pointer-events-auto',
          className,
        )}
      >
        <Sidebar aria-label='Main Navigation' />
        <section
          id='main-content'
          className='flex-1 h-full overflow-y-auto overflow-x-hidden p-0 relative custom-scrollbar'
        >
          {children}
        </section>

        {/* Modal Portal Root - ensures modals stay within dashboard boundaries */}
        <div id='dashboard-modal-root' className='absolute inset-0 pointer-events-none z-[100]' />
      </main>
    </div>
  );
};

export default Shell;
