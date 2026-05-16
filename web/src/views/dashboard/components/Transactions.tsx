// web/src/views/dashboard/components/Transactions.tsx
import TransactionItem from "@components/TransactionItem";
import { createMemo, For } from 'solid-js';
import { transactions } from "@data/transactions";

const Transactions = () => {
  const latestTransactions = createMemo(() => transactions().slice(0, 5));

  return (
    <div class='flex flex-col gap-3'>
      <For each={latestTransactions()}>
        {(transaction) => (
          <TransactionItem transaction={transaction} isLimitedSpace />
        )}
      </For>
    </div>
  );
};

export default Transactions;
