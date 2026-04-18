import { Copy, Star } from 'lucide-react';
import { type Account, AccountType } from '@typings/Account';
import copy from 'copy-to-clipboard';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../hooks/useConfig';
import { MasterCardIcon } from '../icons/MasterCardIcon';
import { formatMoney } from '../utils/currency';
import { Typography } from './ui/Typography';
import { cn } from '@utils/cn';
import { Skeleton } from './ui/Base';

type AccountCardProps = {
 account: Account;
 selected?: boolean;
 withCopy?: boolean;
 isDisabled?: boolean;
};

export const AccountCard = ({
 account,
 selected = false,
 withCopy = false,
 isDisabled = false,
}: AccountCardProps) => {
 const { type, balance, isDefault, accountName, number } = account;
 const { t } = useTranslation();
 const config = useConfig();

 return (
 <div 
 className={cn(
 "group relative flex flex-col justify-between h-[150px] w-full p-5 rounded-2xl",
 "bg-linear-to-br from-white/4 to-transparent border border-white/10",
 "transition-all duration-300 cursor-pointer select-none",
 "hover:from-white/[0.07] hover:border-white/20",
 selected && "from-white/10 border-white ring-1 ring-white/20",
 isDisabled && "opacity-30 grayscale pointer-events-none"
 )}
 >
 {/* Decorative glass elements */}
 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-16 -mt-16 rounded-full pointer-events-none" />
 
 <div className="relative z-10 flex justify-between items-start">
 <div className="flex flex-col gap-0.5">
 <Typography variant="label" className="text-[10px] group-hover:text-white/60 transition-colors">
 {t('Balance')}
 </Typography>
 <Typography variant="h3" className="text-2xl font-bold leading-none tracking-tight">
 {formatMoney(balance, config.general)}
 </Typography>
 </div>
 <div className="flex gap-2">
 {isDefault && (
 <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-black">
 <Star className="w-2 h-2 fill-black" />
 <Typography variant="pre" className="text-[7px] font-bold tracking-tight text-black">
 {t('DEFAULT')}
 </Typography>
 </div>
 )}
 <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 border border-white/10">
 <div className="w-1 h-1 rounded-full bg-white/40" />
 <Typography variant="pre" className="text-[7px] text-slate-400 font-medium tracking-widest">
 {type === AccountType.Shared ? t('SHARED') : t('PERSONAL')}
 </Typography>
 </div>
 </div>
 </div>

 <div className="relative z-10 flex justify-between items-end">
 <div className="flex flex-col gap-2">
 <div className="flex items-center gap-2">
 <Typography variant="pre" className="text-[9px] text-slate-500 font-medium tracking-widest font-mono opacity-70 group-hover:opacity-100 group-hover:text-white transition-all">
 {number}
 </Typography>
 {withCopy && (
 <button
 onClick={(e) => {
 e.stopPropagation();
 copy(number);
 }}
 className="p-1 rounded-md bg-white/0 hover:bg-white text-slate-500 hover:text-black transition-all active:scale-90"
 >
 <Copy className="w-2.5 h-2.5" />
 </button>
 )}
 </div>
 <Typography className="text-sm font-medium text-white tracking-tight truncate max-w-[160px]">
 {accountName}
 </Typography>
 </div>
 <div className="relative">
 <MasterCardIcon 
 style={{ width: 48, filter: 'grayscale(1) brightness(2)' }} 
 className="opacity-20 group-hover:opacity-60 transition-all duration-700" 
 />
 </div>
 </div>
 </div>
 );
};

export const LoadingAccountCard = () => {
 return (
 <div className="flex flex-col justify-between h-[200px] w-full p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 animate-pulse">
 <div className="space-y-4">
 <div className="flex justify-between">
 <Skeleton className="w-24 h-4 rounded-sm" />
 <Skeleton className="w-20 h-6 rounded-full" />
 </div>
 <Skeleton className="w-[70%] h-10 rounded-md" />
 </div>
 <div className="flex justify-between items-end">
 <div className="space-y-2">
 <Skeleton className="w-40 h-4 rounded-sm" />
 <Skeleton className="w-32 h-5 rounded-sm" />
 </div>
 <Skeleton className="w-12 h-10 rounded-lg" />
 </div>
 </div>
 );
};
