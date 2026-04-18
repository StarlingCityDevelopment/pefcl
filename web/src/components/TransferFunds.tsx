import { externalAccountsAtom } from '@data/externalAccounts';
import { transactionBaseAtom } from '@data/transactions';
import { useMutation } from '@hooks/useMutation';
import { TransactionEvents } from '@typings/Events';
import { type CreateTransferInput, TransferType } from '@typings/Transaction';
import { useAtom, useAtomValue } from 'jotai';
import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { accountsAtom, defaultAccountAtom } from '../data/accounts';
import AccountSelect from './AccountSelect';
import Button from './ui/Button';
import PriceField from './ui/Fields/PriceField';
import NewBalance from './ui/NewBalance';
import { Typography } from './ui/Typography';
import { cn } from '@utils/cn';

const TransferFunds: React.FC<{ onClose?(): void }> = ({ onClose }) => {
 const { t } = useTranslation();
 const [amount, setAmount] = useState('');
 const [accounts, updateAccounts] = useAtom(accountsAtom);
 const [, updateTransactions] = useAtom(transactionBaseAtom);
 const defaultAccount = useAtomValue(defaultAccountAtom);
 const externalAccounts = useAtomValue(externalAccountsAtom);
 const [fromAccountId, setFromAccountId] = useState(defaultAccount?.id ?? 0);
 const [toAccountId, setToAccountId] = useState(0);
 const [isToExternal, setIsToExternal] = useState(false);

 const { mutate: mutateTransfer, isLoading: isTransfering } = useMutation(TransactionEvents.CreateTransfer, {
 successMessage: t('Successfully transferred funds'),
 onSuccess: async () => {
 await updateAccounts();
 await updateTransactions();
 onClose?.();
 setAmount('');
 },
 });

 const parsedAmount = Number(amount.replace(/\D/g, ''));
 const fromAccount = accounts.find((account) => account.id === fromAccountId);

 const message = isToExternal ? t('External transfer') : t('Internal transfer');
 const type = isToExternal ? TransferType.External : TransferType.Internal;

 const handleTransfer = () => {
 const payload: CreateTransferInput = {
 type,
 message,
 amount: parsedAmount,
 fromAccountId,
 toAccountId,
 };
 mutateTransfer(payload);
 };

 const handleToSelect = (id: number, isExternal?: boolean) => {
 setToAccountId(id);
 setIsToExternal(isExternal ?? false);
 };

 const isAmountTooHigh = fromAccount && fromAccount.balance < parsedAmount;
 const isAmountTooLow = parsedAmount <= 0;
 const isToAccountSelected = toAccountId > 0;
 const isSameAccount = !isToExternal && toAccountId === fromAccountId;
 const isDisabled = isSameAccount || !parsedAmount || !isToAccountSelected || isAmountTooHigh || isAmountTooLow;

 const rawValue = Number.parseInt(amount.replace(/\D/g, ''));
 const value = isNaN(rawValue) ? 0 : rawValue;
 const newBalance = (fromAccount?.balance ?? 0) - value;
 const isValidNewBalance = newBalance >= 0;

 return (
 <div className="relative flex flex-col gap-8 pt-4">
 {isTransfering && (
 <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden rounded-full">
 <div className="h-full bg-primary animate-[shimmer_2s_infinite] w-[40%]" />
 </div>
 )}

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="flex flex-col gap-2">
 <Typography variant="pre" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
 {t('Source Account')}
 </Typography>
 <AccountSelect
 isFromAccount
 onSelect={(id) => setFromAccountId(id)}
 accounts={accounts}
 selectedId={fromAccountId}
 />
 </div>

 <div className="flex flex-col gap-2">
 <Typography variant="pre" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
 {t('Beneficiary Account')}
 </Typography>
 <AccountSelect
 onSelect={handleToSelect}
 accounts={accounts}
 excludeId={fromAccountId}
 selectedId={toAccountId}
 isExternalSelected={isToExternal}
 externalAccounts={externalAccounts}
 />
 </div>
 </div>

 <div className="flex flex-col gap-2">
 <Typography variant="pre" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
 {t('Amount')}
 </Typography>
 <PriceField 
 placeholder={t('Amount')} 
 value={amount} 
 onChange={(event) => setAmount(event.target.value)} 
 />
 <div className="mt-1">
 <NewBalance amount={newBalance} isValid={isValidNewBalance} />
 </div>
 </div>

 <div className="flex justify-end gap-3 pt-4">
 <Button 
 disabled={isDisabled || isTransfering} 
 onClick={handleTransfer}
 className="px-8 py-3"
 >
 {t('Confirm Transfer')}
 </Button>
 </div>
 </div>
 );
};

export default TransferFunds;
