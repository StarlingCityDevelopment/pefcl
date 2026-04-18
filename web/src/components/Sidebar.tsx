import { totalUnpaidInvoicesAtom } from '@data/invoices';
import { useConfig } from '@hooks/useConfig';
import { cn } from '@utils/cn';
import type { Atom } from 'jotai';
import { useAtomValue } from 'jotai';
import {
  ArrowLeftRight,
  CreditCard,
  History,
  LayoutDashboard,
  MinusCircle,
  PlusCircle,
  Receipt,
  Wallet,
} from 'lucide-react';
import React, { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useMatch } from 'react-router';
import { Typography } from './ui/Typography';

interface ListItemProps {
  to: string;
  label: string;
  icon: ReactNode;
  amount?: number;
  countAtom?: Atom<number>;
}

const ListItem = ({ to, icon, label, amount, countAtom }: ListItemProps) => {
  const match = useMatch(to);
  const isActive = !!match;
  const count = countAtom ? useAtomValue(countAtom) : 0;

  return (
    <Link
      to={to}
      className={cn(
        'group flex items-center px-3 py-2.5 transition-all duration-150 relative',
        'text-xs font-bold tracking-[0.1em] uppercase',
        isActive
          ? 'bg-[var(--gta-green)] text-black'
          : 'text-[var(--gta-text-dim)] hover:text-[var(--gta-text)] hover:bg-[var(--gta-surface)]',
      )}
    >
      {/* GTA active indicator bar */}
      {isActive && <div className='absolute left-0 top-0 bottom-0 w-[3px] bg-black/20' />}

      <div
        className={cn(
          'relative mr-2.5 transition-colors',
          isActive ? 'text-black' : 'text-[var(--gta-text-dim)] group-hover:text-[var(--gta-green)]',
        )}
      >
        {icon}
        {(count > 0 || amount) && (
          <span className='absolute -top-1 -right-1 flex h-2 w-2'>
            <span className='animate-ping absolute inline-flex h-full w-full bg-[var(--gta-yellow)] opacity-75' />
            <span className='relative inline-flex h-2 w-2 bg-[var(--gta-yellow)]' />
          </span>
        )}
      </div>
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const { t } = useTranslation();
  const config = useConfig();

  return (
    <nav className='flex flex-col w-[200px] min-w-[200px] h-full bg-[var(--gta-black)] border-r border-[var(--gta-border)] no-scrollbar'>
      {/* GTA Logo header */}
      <div className='px-4 py-4 border-b border-[var(--gta-border)]'>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-[var(--gta-green)]' />
          <Typography variant='h2' className='text-[var(--gta-green)] font-black tracking-[0.25em] text-sm'>
            PEFCL
          </Typography>
        </div>
        <Typography variant='pre' className='text-[8px] text-[var(--gta-text-dim)] mt-1 tracking-[0.3em]'>
          {t('BANKING SYSTEM')}
        </Typography>
      </div>

      <div className='flex flex-col py-2 flex-1 overflow-y-auto no-scrollbar'>
        <ListItem to='../' icon={<LayoutDashboard className='w-4 h-4' />} label={t('Dashboard')} />
        <ListItem to='../accounts' icon={<Wallet className='w-4 h-4' />} label={t('Accounts')} />
        <ListItem to='../transfer' icon={<ArrowLeftRight className='w-4 h-4' />} label={t('Transfer Funds')} />
        <ListItem to='../transactions' icon={<History className='w-4 h-4' />} label={t('Transaction History')} />
        <ListItem
          to='../invoices'
          icon={<Receipt className='w-4 h-4' />}
          label={t('Invoices')}
          countAtom={totalUnpaidInvoicesAtom}
        />
        <ListItem to='../deposit' icon={<PlusCircle className='w-4 h-4' />} label={t('Deposit')} />
        <ListItem to='../withdraw' icon={<MinusCircle className='w-4 h-4' />} label={t('Withdraw Cash')} />

        {config?.frameworkIntegration?.isCardsEnabled && (
          <ListItem to='../cards' icon={<CreditCard className='w-4 h-4' />} label={t('Cards')} />
        )}
      </div>

      {/* GTA-style footer */}
      <div className='px-4 py-3 border-t border-[var(--gta-border)]'>
        <div className='flex items-center gap-1.5'>
          <div className='w-1.5 h-1.5 bg-[var(--gta-green)] gta-pulse' />
          <Typography variant='pre' className='text-[8px] text-[var(--gta-text-dim)] tracking-[0.2em]'>
            {t('Encrypted')}
          </Typography>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
