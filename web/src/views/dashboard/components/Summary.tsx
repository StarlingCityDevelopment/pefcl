import WeekGraph from '@components/WeekGraph';
import { useConfig } from '@hooks/useConfig';
import { TransactionEvents } from '@typings/Events';
import type { GetTransactionHistoryResponse } from '@typings/Transaction';
import { formatMoney } from '@utils/currency';
import { fetchNui } from '@utils/fetchNui';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@ui/Typography';
import { cn } from '@utils/cn';

const DashboardSummary = () => {
 const { t } = useTranslation();
 const config = useConfig();
 const [data, setData] = useState<GetTransactionHistoryResponse | undefined>();

 useEffect(() => {
 fetchNui<GetTransactionHistoryResponse>(TransactionEvents.GetHistory).then(setData);
 }, []);

 return (
 <div className="flex flex-col gap-6 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-md h-full -[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
 <div className="flex flex-col gap-1">
 <Typography variant="pre" className="text-slate-500 font-black">
 {t('Weekly summary')}
 </Typography>
 <Typography variant="h3" className="text-white font-black tracking-tight leading-none uppercase italic text-lg">
 {t('Performance')}
 </Typography>
 </div>

 <div className="flex flex-row gap-6">
 <div className="flex-1 p-5 rounded-2xl bg-white/[0.03] border border-white/5 transition-all hover:bg-white/[0.05] hover:border-white/10 group cursor-default">
 <Typography variant="label" className="mb-2 block group-hover:text-white/60 transition-colors">
 {t('Total Income')}
 </Typography>
 <Typography className="text-2xl font-black text-white tracking-tighter leading-none group-hover:scale-[1.02] transition-transform origin-left">
 {formatMoney(data?.income ?? 0, config.general)}
 </Typography>
 </div>

 <div className="flex-1 p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] transition-all hover:bg-white/[0.02] hover:border-white/5 group cursor-default">
 <Typography variant="label" className="mb-2 block">
 {t('Total Expenses')}
 </Typography>
 <Typography className="text-2xl font-black text-slate-500 tracking-tighter leading-none group-hover:text-white/80 transition-colors">
 {formatMoney(data?.expenses ?? 0, config.general)}
 </Typography>
 </div>
 </div>

 <div className="flex-1 flex flex-col gap-4 mt-2">
 <div className="flex items-center justify-between">
 <Typography variant="pre" className="text-slate-500 font-bold">
 {t('Activity Feed')}
 </Typography>
 <div className="flex gap-2">
 <div className="flex items-center gap-1.5">
 <div className="w-2 h-2 rounded-full bg-white/40" />
 <Typography variant="pre" className="text-[8px] text-slate-400 capitalize">{t('Income')}</Typography>
 </div>
 <div className="flex items-center gap-1.5">
 <div className="w-2 h-2 rounded-full bg-slate-500/40" />
 <Typography variant="pre" className="text-[8px] text-slate-400 capitalize">{t('Expense')}</Typography>
 </div>
 </div>
 </div>
 
 <div className="flex-1 min-h-[160px] relative">
 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-2xl z-10" />
 <WeekGraph data={data?.lastWeek ?? {}} />
 </div>
 </div>
 </div>
 );
};

export default DashboardSummary;
