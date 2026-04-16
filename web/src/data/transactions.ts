import { atom } from 'jotai';
import { TransactionEvents } from '@typings/Events';
import { GetTransactionsInput, GetTransactionsResponse } from '@typings/Transaction';
import { mockedTransactions } from '../utils/constants';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';

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

const isLoadedAtom = atom(false);
export const rawTransactionsAtom = atom<GetTransactionsResponse>(transactionInitialState);

export const transactionBaseAtom = atom<
  Promise<GetTransactionsResponse>,
  GetTransactionsResponse | undefined,
  Promise<void>
>(
  async (get) => {
    const isLoaded = get(isLoadedAtom);
    const raw = get(rawTransactionsAtom);

    if (!isLoaded && raw.transactions.length === 0) {
      return await getTransactions({ ...transactionInitialState });
    }

    return raw;
  },
  async (get, set, by?) => {
    const currentSettings = get(rawTransactionsAtom);
    const data = by ?? (await getTransactions({ ...currentSettings }));
    set(rawTransactionsAtom, data);
    set(isLoadedAtom, true);
  },
);

export const transactionsAtom = atom(async (get) => {
  const transactions = get(transactionBaseAtom).transactions;
  return transactions;
});

export const transactionsTotalAtom = atom((get) => get(transactionBaseAtom).total);
export const transactionsLimitAtom = atom((get) => get(transactionBaseAtom).limit);
export const transactionsOffsetAtom = atom((get) => get(transactionBaseAtom).offset);
