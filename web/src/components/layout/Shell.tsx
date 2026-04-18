import { cn } from '@utils/cn';
import type React from 'react';
import Sidebar from '../Sidebar';

interface ShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * GTA V iFruit-style layout shell for the desktop bank application.
 */
const Shell: React.FC<ShellProps> = ({ children, className }) => {
  return (
    <div className='fixed inset-0 z-10 flex items-center justify-center bg-transparent pointer-events-none overflow-hidden'>
      <main
        className={cn(
          'flex flex-row w-[1400px] h-[800px] max-w-[95vw] max-h-[90vh]',
          'overflow-hidden bg-[var(--gta-dark)] gta-scanlines',
          'border border-[var(--gta-border)] shadow-[0_0_60px_rgba(0,0,0,0.8)]',
          'relative pointer-events-auto',
          className,
        )}
      >
        {/* GTA green top accent line */}
        <div className='absolute top-0 left-0 right-0 h-[2px] bg-[var(--gta-green)] z-50' />

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
