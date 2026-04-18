import InvoiceItem from '@components/InvoiceItem';
import TotalBalance from '@components/TotalBalance';
import { Typography } from '@ui/Typography';
import { invoicesAtom } from '@data/invoices';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@utils/cn';

const MobileInvoicesView = () => {
 const { t } = useTranslation();
 const [invoicesResponse, setInvoices] = useAtom(invoicesAtom);

 useEffect(() => {
 setInvoices();
 }, [setInvoices]);

 const invoices = invoicesResponse?.invoices ?? [];
 const hasInvoices = invoices.length > 0;

 return (
 <div className="flex flex-col gap-10 p-6 pb-20">
 <div className="flex flex-col gap-1">
 <Typography variant="h1" className="text-4xl">{t('Bills')}</Typography>
 <TotalBalance />
 </div>

 <div className="flex flex-col gap-4">
 <header className="flex items-center justify-between mb-2 px-1">
 <Typography variant="pre" className="text-slate-500 font-black">
 {t('Unpaid statement')}
 </Typography>
 {hasInvoices && (
 <div className="h-5 px-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-slate-500 flex items-center">
 {invoices.length}
 </div>
 )}
 </header>

 <div className="flex flex-col gap-3">
 {invoices.map((invoice) => (
 <InvoiceItem key={invoice.id} invoice={invoice} />
 ))}

 {!hasInvoices && (
 <div className="p-16 rounded-[3rem] bg-white/[0.01] border border-white/5 flex flex-col items-center gap-4 text-center">
 <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
 <div className="w-2 h-2 rounded-full bg-slate-700 animate-pulse" />
 </div>
 <Typography variant="muted" className="italic max-w-[180px]">
 {t('Your statement is clear. No pending invoices found.')}
 </Typography>
 </div>
 )}
 </div>
 </div>
 </div>
 );
};

export default MobileInvoicesView;
