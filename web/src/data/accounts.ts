// web/src/data/accounts.ts
import type { Account } from "@typings/Account";
import { AccountEvents } from "@typings/Events";
import { createSignal, createMemo, createResource, createRoot } from 'solid-js';
import { mockedAccounts } from "@utils/constants";
import { fetchNui } from "@utils/fetchNui";
import { isEnvBrowser } from "@utils/misc";

const getAccounts = async (): Promise<Account[]> => {
  try {
    const res = await fetchNui<Account[]>(AccountEvents.GetAccounts);
    return res ?? [];
  } catch (e) {
    if (isEnvBrowser()) {
      return mockedAccounts;
    }
    console.error(e);
    return [];
  }
};

export const {
  rawAccounts,
  setRawAccounts,
  accountsResource,
  mutateAccounts,
  refetchAccounts,
  accounts,
  totalBalance,
  activeAccountId,
  setActiveAccountId,
  activeAccount,
  defaultAccount,
  defaultAccountBalance,
  accountOrder,
  setAccountOrder,
  orderedAccounts,
} = createRoot(() => {
  const [rawAccounts, setRawAccounts] = createSignal<Account[]>([]);
  const [isLoaded, setIsLoaded] = createSignal(false);

  const [resource, { mutate, refetch }] = createResource(async () => {
    if (!isLoaded() && rawAccounts().length === 0) {
      const data = await getAccounts();
      setIsLoaded(true);
      setRawAccounts(data);
      return data;
    }
    return rawAccounts();
  });

  const accountsMemo = createMemo(() => resource() ?? []);

  const totalBalanceMemo = createMemo(() =>
    accountsMemo().reduce((prev, curr) => prev + curr.balance, 0),
  );

  const [activeAccountId, setActiveAccountId] = createSignal<number>(0);
  const activeAccountMemo = createMemo(() =>
    accountsMemo().find((account) => account.id === activeAccountId()),
  );

  const defaultAccountMemo = createMemo(() => accountsMemo().find((account) => account.isDefault));
  const defaultAccountBalanceMemo = createMemo(() => defaultAccountMemo()?.balance);

  const [accountOrder, setAccountOrder] = createSignal<string>(localStorage.getItem('order') ?? '');

  const orderedAccountsMemo = createMemo(() => {
    const accs = [...accountsMemo()];
    const storageOrder = accountOrder();

    try {
      const order = JSON.parse(storageOrder);
      return accs.sort((a, b) => {
        const aIndex = order?.[a.id] ?? 0;
        const bIndex = order?.[b.id] ?? 0;
        return aIndex > bIndex ? 1 : -1;
      });
    } catch {
      return accs;
    }
  });

  return {
    rawAccounts,
    setRawAccounts,
    accountsResource: resource,
    mutateAccounts: mutate,
    refetchAccounts: refetch,
    accounts: accountsMemo,
    totalBalance: totalBalanceMemo,
    activeAccountId,
    setActiveAccountId,
    activeAccount: activeAccountMemo,
    defaultAccount: defaultAccountMemo,
    defaultAccountBalance: defaultAccountBalanceMemo,
    accountOrder,
    setAccountOrder,
    orderedAccounts: orderedAccountsMemo,
  };
});

export const setOrderedAccounts = (order: Record<number, number>) => {
  const orderStr = JSON.stringify(order);
  setAccountOrder(orderStr);
  localStorage.setItem('order', orderStr);
};
