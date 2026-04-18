import { accountsAtom, rawAccountAtom } from '@data/accounts';
import { rawCashAtom } from '@data/cash';
import { invoicesAtom } from '@data/invoices';
import { transactionBaseAtom } from '@data/transactions';
import { useNuiEvent } from '@hooks/useNuiEvent';
import type { Account } from '@typings/Account';
import { Broadcasts } from '@typings/Events';
import { updateAccount } from '@utils/account';
import { useAtom, useSetAtom } from 'jotai';

export const useBroadcasts = () => {
  const updateInvoices = useSetAtom(invoicesAtom);
  const updateTransactions = useSetAtom(transactionBaseAtom);
  const setRawAccounts = useSetAtom(rawAccountAtom);
  const setRawCash = useSetAtom(rawCashAtom);
  const [accounts, updateAccounts] = useAtom(accountsAtom);

  useNuiEvent(Broadcasts.NewTransaction, () => {
    updateTransactions();
  });

  useNuiEvent(Broadcasts.NewAccount, (account: Account) => {
    setRawAccounts([...accounts, account]);
  });

  useNuiEvent(Broadcasts.UpdatedAccount, () => {
    updateAccounts();
  });

  useNuiEvent(Broadcasts.NewAccountBalance, (account: Account) => {
    setRawAccounts(updateAccount(accounts, account));
  });

  useNuiEvent(Broadcasts.NewInvoice, () => {
    updateInvoices();
  });

  useNuiEvent(Broadcasts.NewSharedUser, () => {
    updateAccounts();
  });

  useNuiEvent(Broadcasts.RemovedSharedUser, () => {
    updateAccounts();
  });

  // Real-time cash updates from server broadcasts
  useNuiEvent<number>(Broadcasts.NewCashAmount, (newCash) => {
    setRawCash(newCash);
  });
};

export const BroadcastsWrapper = () => {
  useBroadcasts();
  return null;
};
