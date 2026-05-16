// web/src/views/Mobile/Components/MobileFooter.tsx
import { Typography } from "@components/ui/Typography";
import { totalUnpaidInvoices } from "@data/invoices";
import { cn } from "@utils/cn";
import { LayoutDashboard, Wallet, ArrowLeftRight, Receipt } from 'lucide-solid';
import { type JSX, Show, createMemo } from 'solid-js';
import i18n from "@utils/i18n";
import { A, useLocation } from "@solidjs/router";

export const FooterHeight = '72px';

interface ListItemProps {
  to: string;
  label: string;
  icon: JSX.Element;
  count?: () => number;
}

const ListItem = (props: ListItemProps) => {
  const location = useLocation();
  const isActive = () => location.pathname.includes(props.to.replace('..', ''));
  const count = () => props.count ? props.count() : 0;

  return (
    <A href={props.to} class='flex-1 flex flex-col items-center justify-center gap-1 group relative'>
      <div
        class={cn(
          'flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300',
          isActive()
            ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-110'
            : 'text-slate-500 group-hover:text-white group-active:scale-95',
        )}
      >
        <div class='relative'>
          {props.icon}
          <Show when={count() > 0}>
            <span class='absolute -top-1 -right-1 flex h-3 w-3'>
              <span class='animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75' />
              <span class='relative inline-flex rounded-full h-3 w-3 bg-white' />
            </span>
          </Show>
        </div>
      </div>
      <Typography
        variant='pre'
        class={cn(
          'text-[8px] font-black tracking-widest transition-colors',
          isActive() ? 'text-white' : 'text-slate-500',
        )}
      >
        {props.label}
      </Typography>
    </A>
  );
};

const MobileFooter = () => {
  return (
    <nav
      class={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-black/80 backdrop-blur-md border-t border-white/5',
        'pb-[env(safe-area-inset-bottom)] px-4',
      )}
      style={{ height: `calc(${FooterHeight} + env(safe-area-inset-bottom))` }}
    >
      <div class='flex flex-row items-center justify-between h-full max-w-lg mx-auto'>
        <ListItem icon={<LayoutDashboard size={20} />} label={i18n.t('Overview')} to='../mobile/dashboard' />
        <ListItem icon={<Wallet size={20} />} label={i18n.t('Banks')} to='../mobile/accounts' />
        <ListItem icon={<ArrowLeftRight size={20} />} label={i18n.t('Transfer')} to='../mobile/transfer' />
        <ListItem
          icon={<Receipt size={20} />}
          label={i18n.t('Bills')}
          to='../mobile/invoices'
          count={totalUnpaidInvoices}
        />
      </div>
    </nav>
  );
};

export default MobileFooter;
