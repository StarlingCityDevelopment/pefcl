import { totalUnpaidInvoicesAtom } from '@data/invoices';
import { 
 LayoutDashboard, 
 Wallet, 
 ArrowLeftRight, 
 Receipt 
} from 'lucide-react';
import type { Atom } from 'jotai';
import React, { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useMatch } from 'react-router';
import { useAtomValue } from 'jotai';
import { cn } from '@utils/cn';
import { Typography } from '@components/ui/Typography';

export const FooterHeight = '72px';

interface ListItemProps {
 to: string;
 label: string;
 icon: ReactNode;
 countAtom?: Atom<number>;
}

const ListItem = ({ to, icon, label, countAtom }: ListItemProps) => {
 const match = useMatch(to);
 const isActive = !!match;
 const count = countAtom ? useAtomValue(countAtom) : 0;

 return (
 <Link to={to} className="flex-1 flex flex-col items-center justify-center gap-1 group relative">
 <div className={cn(
 "flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300",
 isActive 
 ? "bg-white text-black -[0_0_20px_rgba(255,255,255,0.15)] scale-110" 
 : "text-slate-500 group-hover:text-white group-active:scale-95"
 )}>
 <div className="relative">
 {icon}
 {count > 0 && (
 <span className="absolute -top-1 -right-1 flex h-3 w-3">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
 <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
 </span>
 )}
 </div>
 </div>
 <Typography 
 variant="pre" 
 className={cn(
 "text-[8px] font-black tracking-widest transition-colors",
 isActive ? "text-white" : "text-slate-500"
 )}
 >
 {label}
 </Typography>
 </Link>
 );
};

const MobileFooter = () => {
 const { t } = useTranslation();
 
 return (
 <nav 
 className={cn(
 "fixed bottom-0 left-0 right-0 z-50",
 "bg-black/80 backdrop-blur-md border-t border-white/5",
 "pb-[env(safe-area-inset-bottom)] px-4"
 )}
 style={{ height: `calc(${FooterHeight} + env(safe-area-inset-bottom))` }}
 >
 <div className="flex flex-row items-center justify-between h-full max-w-lg mx-auto">
 <ListItem 
 icon={<LayoutDashboard className="w-5 h-5" />} 
 label={t('Overview')} 
 to='../mobile/dashboard' 
 />
 <ListItem 
 icon={<Wallet className="w-5 h-5" />} 
 label={t('Banks')} 
 to='../mobile/accounts' 
 />
 <ListItem 
 icon={<ArrowLeftRight className="w-5 h-5" />} 
 label={t('Transfer')} 
 to='../mobile/transfer' 
 />
 <ListItem
 icon={<Receipt className="w-5 h-5" />}
 label={t('Bills')}
 to='../mobile/invoices'
 countAtom={totalUnpaidInvoicesAtom}
 />
 </div>
 </nav>
 );
};

export default MobileFooter;
