import TransactionItem from '@components/TransactionItem';
import { useAtomValue } from 'jotai';
import React from 'react';
import { transactionsAtom } from '../../../data/transactions';

const Transactions = () => {
 const transactions = useAtomValue(transactionsAtom);

 return (
 <div className="flex flex-col gap-3">
 {transactions.slice(0, 5).map((transaction) => (
 <TransactionItem key={transaction.id} transaction={transaction} isLimitedSpace />
 ))}
 </div>
 );
};

export default Transactions;
