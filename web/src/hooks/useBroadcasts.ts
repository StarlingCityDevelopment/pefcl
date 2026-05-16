// web/src/hooks/useBroadcasts.ts
import { setRawAccounts, refetchAccounts, accounts } from "@data/accounts";
import { setRawCash } from "@data/cash";
import { refetchInvoices } from "@data/invoices";
import { refetchTransactions } from "@data/transactions";
import { useNuiEvent } from "@hooks/useNuiEvent";
import type { Account } from "@typings/Account";
import { Broadcasts } from "@typings/Events";
import { updateAccount } from "@utils/account";

export const useBroadcasts = () => {
  useNuiEvent(Broadcasts.NewTransaction, () => {
    refetchTransactions();
  });

  useNuiEvent(Broadcasts.NewAccount, (account: Account) => {
    setRawAccounts([...accounts(), account]);
  });

  useNuiEvent(Broadcasts.UpdatedAccount, () => {
    refetchAccounts();
  });

  useNuiEvent(Broadcasts.NewAccountBalance, (account: Account) => {
    setRawAccounts(updateAccount(accounts(), account));
  });

  useNuiEvent(Broadcasts.NewInvoice, () => {
    refetchInvoices();
  });

  useNuiEvent(Broadcasts.NewSharedUser, () => {
    refetchAccounts();
  });

  useNuiEvent(Broadcasts.RemovedSharedUser, () => {
    refetchAccounts();
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
