import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { type Account, AccountRole, AccountType, type ExternalAccount } from '@typings/Account';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../hooks/useConfig';
import { formatMoney } from '../utils/currency';
import AddExternalAccountModal from './Modals/AddExternalAccount';
import Button from './ui/Button';
import Select from './ui/Select';
import { Typography } from './ui/Typography';
import { cn } from '@utils/cn';

// Prefix to namespace external account IDs so they never collide with internal ones
const EXT_PREFIX = 'ext-';

interface AccountSelectProps {
 accounts: Account[];
 selectedId?: number;
 excludeId?: number;
 isFromAccount?: boolean;
 isExternalSelected?: boolean;
 externalAccounts?: ExternalAccount[];
 onSelect(accountId: number, isExternal?: boolean): void;
}

const AccountSelectSnapshot = ({ account, type }: { account: Account | ExternalAccount, type: 'internal' | 'external' }) => {
 const { t } = useTranslation();
 const config = useConfig();
 
 if (type === 'external') {
 const ext = account as ExternalAccount;
 return (
 <div className="flex flex-col text-left py-1 overflow-hidden pr-2">
 <Typography className="text-sm font-medium text-white truncate mb-1">{ext.name}</Typography>
 <Typography variant="pre" className="text-[10px] text-slate-500 font-medium">{ext.number}</Typography>
 </div>
 );
 }

 const acc = account as Account;
 return (
 <div className="flex flex-col text-left py-1 overflow-hidden pr-2">
 <div className="flex items-center gap-2 mb-1">
 <Typography className="text-sm font-medium text-white truncate">{acc.accountName}</Typography>
 <div className="flex items-center justify-center px-2 py-0.5 rounded-md bg-white/5 border border-white/10 shrink-0">
 <Typography variant="pre" className="text-[8px] text-slate-400 uppercase tracking-widest">
 {acc.type === AccountType.Personal ? t('Personal') : t('Shared')}
 </Typography>
 </div>
 </div>
 <Typography className="text-sm text-slate-300">
 {formatMoney(acc.balance, config.general)}
 </Typography>
 </div>
 );
};

const AccountSelect = ({
 accounts,
 onSelect,
 selectedId,
 excludeId,
 isFromAccount = false,
 isExternalSelected = false,
 externalAccounts = [],
}: AccountSelectProps) => {
 const { t } = useTranslation();
 const [isExternalOpen, setIsExternalOpen] = useState(false);

 // Build options for our custom Select
 const options = useMemo(() => {
 const opts: { value: string | number; label: React.ReactNode }[] = [];

 // Internal Accounts
 accounts
 .filter((account) => account.id !== excludeId)
 .forEach((account) => {
 const isDisabledByContributor = isFromAccount && account.role === AccountRole.Contributor;
 opts.push({
 value: account.id.toString(),
 label: (
 <div className={cn("flex flex-col w-full", isDisabledByContributor && "opacity-30 grayscale")}>
 <AccountSelectSnapshot account={account} type="internal" />
 {isDisabledByContributor && (
 <Typography variant="pre" className="text-[8px] text-slate-500 mt-2 font-black leading-tight">
 {t('Restricted: Contributors cannot move shared funds')}
 </Typography>
 )}
 </div>
 )
 });
 });

 // External Accounts
 externalAccounts.forEach((account) => {
 opts.push({
 value: `${EXT_PREFIX}${account.id}`,
 label: <AccountSelectSnapshot account={account} type="external" />
 });
 });

 return opts;
 }, [accounts, externalAccounts, excludeId, isFromAccount, t]);

 const currentValue =
 selectedId === undefined || selectedId === 0
 ? '0'
 : isExternalSelected
 ? `${EXT_PREFIX}${selectedId}`
 : selectedId.toString();

 const handleChange = (event: { target: { value: string | number } }) => {
 const val = event.target.value.toString();
 if (val === '0') return;

 if (val.startsWith(EXT_PREFIX)) {
 const extId = Number(val.slice(EXT_PREFIX.length));
 if (!isNaN(extId)) {
 onSelect(extId, true);
 }
 } else {
 const numericValue = Number(val);
 if (!isNaN(numericValue)) {
 onSelect(numericValue, false);
 }
 }
 };

 return (
 <div className="w-full">
 <React.Suspense fallback={null}>
 <AddExternalAccountModal isOpen={isExternalOpen} onClose={() => setIsExternalOpen(false)} />
 </React.Suspense>
 <div className="flex flex-col gap-3">
 <Select
 value={currentValue}
 onChange={handleChange}
 options={options}
 placeholder={t('Select account')}
 renderValue={(val) => {
 const stringVal = (val || '').toString();
 if (stringVal === '0') return <Typography variant="label" className="text-slate-500 py-2">{t('Select account')}</Typography>;

 if (stringVal.startsWith(EXT_PREFIX)) {
 const extId = stringVal.slice(EXT_PREFIX.length);
 const external = externalAccounts.find((a) => a.id.toString() === extId);
 if (external) return <AccountSelectSnapshot account={external} type="external" />;
 } else {
 const account = accounts.find((a) => a.id.toString() === stringVal);
 if (account) return <AccountSelectSnapshot account={account} type="internal" />;
 }
 return <Typography variant="label" className="text-slate-500 py-2">{t('Select account')}</Typography>;
 }}
 />
 {!isFromAccount && (
 <Button 
 variant="secondary" 
 onClick={() => setIsExternalOpen(true)}
 className="h-8 rounded-full text-[9px] font-black uppercase tracking-widest px-4 self-start"
 >
 + {t('Register Outside Entity')}
 </Button>
 )}
 </div>
 </div>
 );
};

export default AccountSelect;
