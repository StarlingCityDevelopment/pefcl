// web/src/data/transactions.ts
import { TransactionEvents } from "@typings/Events";
import type { GetTransactionsInput, GetTransactionsResponse } from "@typings/Transaction";
import { createSignal, createMemo, createResource, createRoot } from 'solid-js';
import { mockedTransactions } from "@utils/constants";
import { fetchNui } from "@utils/fetchNui";
import { isEnvBrowser } from "@utils/misc";

export const transactionInitialState: GetTransactionsResponse = {
  total: 0,
  offset: 0,
  limit: 10,
  transactions: [],
};

const getTransactions = async (input: GetTransactionsInput): Promise<GetTransactionsResponse> => {
  try {
    const res = await fetchNui<GetTransactionsResponse>(TransactionEvents.Get, input);
    return res ?? transactionInitialState;
  } catch (e) {
    if (isEnvBrowser()) {
      return mockedTransactions;
    }
    console.error(e);
    return transactionInitialState;
  }
};

export const {
  rawTransactions,
  setRawTransactions,
  transactionsResource,
  mutateTransactions,
  refetchTransactions,
  transactionBase,
  transactions,
  transactionsTotal,
  transactionsLimit,
  transactionsOffset,
} = createRoot(() => {
  const [rawTransactions, setRawTransactions] = createSignal<GetTransactionsResponse>(
    transactionInitialState,
  );
  const [isLoaded, setIsLoaded] = createSignal(false);

  const [resource, { mutate, refetch }] = createResource(async () => {
    if (!isLoaded() && rawTransactions().transactions.length === 0) {
      const data = await getTransactions({ ...transactionInitialState });
      setIsLoaded(true);
      setRawTransactions(data);
      return data;
    }
    return rawTransactions();
  });

  const base = createMemo(() => resource() ?? transactionInitialState);

  const txs = createMemo(() => base().transactions);
  const total = createMemo(() => base().total);
  const limit = createMemo(() => base().limit);
  const offset = createMemo(() => base().offset);

  return {
    rawTransactions,
    setRawTransactions,
    transactionsResource: resource,
    mutateTransactions: mutate,
    refetchTransactions: refetch,
    transactionBase: base,
    transactions: txs,
    transactionsTotal: total,
    transactionsLimit: limit,
    transactionsOffset: offset,
  };
});
