import { useConfig } from '@hooks/useConfig';
import type { GetTransactionHistoryResponse } from '@typings/Transaction';
import { formatMoney } from '@utils/currency';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from './ui/Typography';
import { cn } from '@utils/cn';

interface ColumnProps {
 date: Date;
 income: number;
 expenses: number;
 maxHeight: number;
}

const Column = ({ date, income, expenses, maxHeight }: ColumnProps) => {
 const { t } = useTranslation();
 const config = useConfig();
 const [isHovered, setIsHovered] = useState(false);

 const incomeHeight = (income / (maxHeight || 1)) * 100;
 const expenseHeight = (Math.abs(expenses) / (maxHeight || 1)) * 100;

 return (
 <div 
 className="relative flex flex-col items-center group cursor-default"
 onMouseEnter={() => setIsHovered(true)}
 onMouseLeave={() => setIsHovered(false)}
 >
 <AnimatePresence>
 {isHovered && (
 <motion.div
 initial={{ opacity: 0, y: 10, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 10, scale: 0.95 }}
 transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
 className="absolute bottom-full mb-3 z-50 p-4 rounded-2xl bg-black/95 border border-white/10 backdrop-blur-md -[0_20px_40px_-10px_rgba(0,0,0,0.8)] min-w-[140px]"
 >
 <div className="flex flex-col gap-3">
 <div className="flex flex-col gap-0.5">
 <Typography variant="pre" className="text-white/40">{t('Income')}</Typography>
 <Typography className="text-sm font-black text-white">{formatMoney(income, config.general)}</Typography>
 </div>
 <div className="h-[1px] w-full bg-white/5" />
 <div className="flex flex-col gap-0.5">
 <Typography variant="pre" className="text-white/40">{t('Expense')}</Typography>
 <Typography className="text-sm font-black text-slate-400">{formatMoney(expenses, config.general)}</Typography>
 </div>
 </div>
 {/* Arrow */}
 <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black/95" />
 </motion.div>
 )}
 </AnimatePresence>

 <div className="flex items-end gap-[3px] h-32 mb-3">
 <div 
 className={cn(
 "w-1.5 rounded-full transition-all duration-500 ease-out",
 "bg-slate-500/30 group-hover:bg-slate-500/50"
 )}
 style={{ height: `${Math.max(4, expenseHeight)}%` }}
 />
 <div 
 className={cn(
 "w-1.5 rounded-full transition-all duration-500 ease-out",
 "bg-white/20 group-hover:bg-white/40"
 )}
 style={{ height: `${Math.max(4, incomeHeight)}%` }}
 />
 </div>

 <Typography variant="pre" className="text-[9px] font-black text-slate-500 group-hover:text-white transition-colors">
 {date.getDate()}
 </Typography>
 </div>
 );
};

interface WeekGraphProps {
 data: GetTransactionHistoryResponse['lastWeek'];
 className?: string;
}

const WeekGraph = ({ data, className }: WeekGraphProps) => {
 const values = Object.values(data);
 const incomeMax = Math.max(...values.map((v) => v.income), 0);
 const expenseMax = Math.max(...values.map((v) => Math.abs(v.expenses)), 0);
 const maxHeight = Math.max(incomeMax, expenseMax);

 return (
 <div className={cn("flex flex-row items-end justify-between w-full h-full pt-10 px-2", className)}>
 {Object.entries(data).map(([key, value]) => (
 <Column key={key} {...value} maxHeight={maxHeight} date={new Date(key)} />
 ))}
 </div>
 );
};

export default WeekGraph;
