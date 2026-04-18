import { AccountCard } from '@components/AccountCard';
import InvoiceItem from '@components/InvoiceItem';
import TotalBalance from '@components/TotalBalance';
import TransactionItem from '@components/TransactionItem';
import { Typography } from '@ui/Typography';
import { unpaidInvoicesAtom } from '@data/invoices';
import { useFetchNui } from '@hooks/useFetchNui';
import type { Account } from '@typings/Account';
import { AccountEvents, TransactionEvents } from '@typings/Events';
import type { Transaction } from '@typings/Transaction';
import { fetchNui } from '@utils/fetchNui';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SectionHeader = ({ title, count }: { title: string; count?: number }) => (
 <header className="flex items-center justify-between mb-2 px-1">
 <div className="flex flex-col gap-1">
 <Typography variant="pre" className="text-slate-500 font-black">
 {title}
 </Typography>
 </div>
 {count !== undefined && (
 <div className="h-5 px-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-slate-500 flex items-center">
 {count}
 </div>
 )}
 </header>
);

const MobileDashboardView = () => {
 const { t } = useTranslation();
 const [defaultAccount, setDefaultAccount] = useState<Account>();
 const invoices = useAtomValue(unpaidInvoicesAtom);

 useEffect(() => {
 fetchNui<Account[]>(AccountEvents.GetAccounts).then((accounts) => {
 const defaultAccount = accounts?.find((account) => account.isDefault);
 setDefaultAccount(defaultAccount);
 });
 }, []);

 const options = {
 offset: 0,
 limit: 5,
 };
 const { data, isLoading } = useFetchNui<{ total: number; transactions: Transaction[] }>(TransactionEvents.Get, options);

 return (
 <div className="flex flex-col gap-10 p-6 pb-20">
 <div className="flex flex-col gap-1">
 <Typography variant="h1" className="text-4xl">
 {t("Dashboard")}
 </Typography>
 <TotalBalance />
 </div>

 <div className="flex flex-col gap-3">
 <SectionHeader title={t("Default account")} />
 {defaultAccount && <AccountCard account={defaultAccount} />}
 {!defaultAccount && (
 <div className="p-8 rounded-[2rem] border border-dashed border-white/10 flex items-center justify-center">
 <Typography variant="muted">{t("No default account")}</Typography>
 </div>
 )}
 </div>

 <div className="flex flex-col gap-4">
 <SectionHeader title={t("Latest transactions")} count={data?.total} />
 <div className="flex flex-col gap-2">
 {data?.transactions?.map((transaction) => (
 <TransactionItem
 key={transaction.id}
 transaction={transaction}
 isLimitedSpace
 />
 ))}
 {(!data?.transactions || data.transactions.length === 0) &&
 !isLoading && (
 <div className="p-12 rounded-[2rem] bg-white/[0.01] border border-white/5 flex items-center justify-center">
 <Typography variant="muted" className="italic">
 {t("No recent transactions")}
 </Typography>
 </div>
 )}
 </div>
 </div>

 <div className="flex flex-col gap-4">
 <SectionHeader title={t("Unpaid invoices")} count={invoices.length} />
 <div className="flex flex-col gap-3">
 {invoices.map((invoice) => (
 <InvoiceItem key={invoice.id} invoice={invoice} />
 ))}
 {invoices.length === 0 && (
 <div className="p-12 rounded-[2.5rem] bg-white/[0.01] border border-white/5 flex items-center justify-center">
 <Typography variant="muted" className="italic">
 {t("All caught up!")}
 </Typography>
 </div>
 )}
 </div>
 </div>
 </div>
 );
};

export default MobileDashboardView;
