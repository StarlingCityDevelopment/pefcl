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
        'group flex items-center px-3 py-2 rounded-xl transition-all duration-200 active:scale-95',
        'text-sm font-medium tracking-tight mb-0.5',
        isActive ? 'bg-white text-black' : 'text-slate-500 hover:text-white hover:bg-white/[0.05]',
      )}
    >
      <div
        className={cn(
          'relative mr-2.5 transition-colors',
          isActive ? 'text-black' : 'text-slate-500 group-hover:text-white',
        )}
      >
        {icon}
        {(count > 0 || amount) && (
          <span className='absolute -top-1 -right-1 flex h-2.5 w-2.5'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75' />
            <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-primary' />
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
    <nav className='flex flex-col w-[200px] min-w-[200px] h-full bg-white/[0.01] border-r border-white/5 no-scrollbar'>
      <div className='px-5 py-5 pb-4'>
        <Typography variant='h2' className='text-white font-semibold tracking-tight text-base'>
          PEFCL
        </Typography>
      </div>
      <div className='flex flex-col px-3 pb-4 flex-1 overflow-y-auto no-scrollbar'>
        <ListItem to='../' icon={<LayoutDashboard className='w-5 h-5' />} label={t('Dashboard')} />
        <ListItem to='../accounts' icon={<Wallet className='w-5 h-5' />} label={t('Accounts')} />
        <ListItem to='../transfer' icon={<ArrowLeftRight className='w-5 h-5' />} label={t('Transfer Funds')} />
        <ListItem to='../transactions' icon={<History className='w-5 h-5' />} label={t('Transaction History')} />
        <ListItem
          to='../invoices'
          icon={<Receipt className='w-5 h-5' />}
          label={t('Invoices')}
          countAtom={totalUnpaidInvoicesAtom}
        />
        <ListItem to='../deposit' icon={<PlusCircle className='w-5 h-5' />} label={t('Deposit')} />
        <ListItem to='../withdraw' icon={<MinusCircle className='w-5 h-5' />} label={t('Withdraw Cash')} />

        {config?.frameworkIntegration?.isCardsEnabled && (
          <ListItem to='../cards' icon={<CreditCard className='w-5 h-5' />} label={t('Cards')} />
        )}
      </div>
    </nav>
  );
};

export default Sidebar;
