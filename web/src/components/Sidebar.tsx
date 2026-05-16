// web/src/components/Sidebar.tsx
import { totalUnpaidInvoices } from "@data/invoices";
import { useConfig } from "@hooks/useConfig";
import { useGlobalSettings } from "@hooks/useGlobalSettings";
import { cn } from "@utils/cn";
import {
  ArrowLeftRight,
  CreditCard,
  History,
  LayoutDashboard,
  MinusCircle,
  PlusCircle,
  Receipt,
  Wallet,
  Sun,
  Moon
} from 'lucide-solid';
import { type Component, type JSX, createMemo, Show } from 'solid-js';
import i18n from "@utils/i18n";
import { A, useMatch } from "@solidjs/router";
import { Typography } from './ui/Typography';

interface ListItemProps {
  to: string;
  label: string;
  icon: JSX.Element;
  amount?: number;
  count?: () => number;
}

const ListItem = (props: ListItemProps) => {
  const match = useMatch(() => props.to);
  const isActive = () => !!match();
  const countValue = () => props.count ? props.count() : 0;

  return (
    <A
      href={props.to}
      class={cn(
        'group flex items-center px-4 py-3 transition-all duration-200 relative',
        'text-[10px] font-bold tracking-[0.15em] uppercase',
        isActive()
          ? 'bg-primary/10 text-primary'
          : 'text-text-muted hover:text-fg-main hover:bg-bg-panel',
      )}
    >
      {/* Active indicator bar */}
      <Show when={isActive()}>
        <div class='absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-primary' />
      </Show>

      <div
        class={cn(
          'relative mr-3 transition-colors',
          isActive() ? 'text-primary' : 'text-text-muted group-hover:text-primary',
        )}
      >
        {props.icon}
        <Show when={countValue() > 0 || props.amount}>
          <span class='absolute -top-1 -right-1 flex h-2 w-2'>
            <span class='animate-ping absolute inline-flex h-full w-full bg-[var(--gta-yellow)] opacity-75' />
            <span class='relative inline-flex h-2 w-2 bg-[var(--gta-yellow)]' />
          </span>
        </Show>
      </div>
      <span>{props.label}</span>
    </A>
  );
};

const Sidebar: Component = () => {
  const config = useConfig();
  const { theme, toggleTheme } = useGlobalSettings();

  return (
    <nav class='flex flex-col w-[240px] min-w-[240px] h-full bg-bg-main border-r border-border-main no-scrollbar'>
      {/* Logo header */}
      <div class='px-6 py-6 border-b border-border-main'>
        <div class='flex items-center gap-3'>
          <div class='w-2 h-2 bg-primary' />
          <Typography variant='h2' class='text-primary font-display font-black tracking-[0.25em] text-base'>
            PEFCL
          </Typography>
        </div>
        <Typography variant='pre' class='text-[8px] text-text-muted mt-2 tracking-[0.3em] font-mono'>
          {i18n.t('SECURE BANKING OS')}
        </Typography>
      </div>

      <div class='flex flex-col py-2 flex-1 overflow-y-auto no-scrollbar'>
        <ListItem to='/' icon={<LayoutDashboard size={16} />} label={i18n.t('Dashboard')} />
        <ListItem to='/accounts' icon={<Wallet size={16} />} label={i18n.t('Accounts')} />
        <ListItem to='/transfer' icon={<ArrowLeftRight size={16} />} label={i18n.t('Transfer Funds')} />
        <ListItem to='/transactions' icon={<History size={16} />} label={i18n.t('Transaction History')} />
        <ListItem
          to='/invoices'
          icon={<Receipt size={16} />}
          label={i18n.t('Invoices')}
          count={totalUnpaidInvoices}
        />
        <ListItem to='/deposit' icon={<PlusCircle size={16} />} label={i18n.t('Deposit')} />
        <ListItem to='/withdraw' icon={<MinusCircle size={16} />} label={i18n.t('Withdraw Cash')} />

        <Show when={config()?.frameworkIntegration?.isCardsEnabled}>
          <ListItem to='/cards' icon={<CreditCard size={16} />} label={i18n.t('Cards')} />
        </Show>
      </div>

      {/* Theme Toggle & Footer */}
      <div class='mt-auto flex flex-col'>
        <button
          onClick={() => toggleTheme()}
          class='mx-6 mb-4 flex items-center gap-3 px-4 py-3 bg-bg-panel hover:bg-bg-surface border border-border-main text-text-muted hover:text-primary transition-all active:scale-95 group'
        >
          <Show when={theme() === 'dark'} fallback={<Moon size={16} class='group-hover:rotate-12 transition-transform' />}>
            <Sun size={16} class='group-hover:rotate-45 transition-transform' />
          </Show>
          <Typography variant='pre' class='text-[10px] font-bold tracking-[0.1em]'>
            {theme() === 'dark' ? i18n.t('LIGHT MODE') : i18n.t('DARK MODE')}
          </Typography>
        </button>

        <div class='px-6 py-4 border-t border-border-main'>
          <div class='flex items-center gap-2'>
            <div class='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
            <Typography variant='pre' class='text-[8px] text-text-muted tracking-[0.2em]'>
              {i18n.t('SYSTEM ONLINE')}
            </Typography>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
