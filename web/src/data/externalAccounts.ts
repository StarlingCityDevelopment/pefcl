// web/src/data/externalAccounts.ts
import type { ExternalAccount } from "@typings/Account";
import { ExternalAccountEvents } from "@typings/Events";
import { fetchNui } from "@utils/fetchNui";
import { isEnvBrowser } from "@utils/misc";
import { createSignal, createResource, createMemo, createRoot } from 'solid-js';

const getExternalAccounts = async (): Promise<ExternalAccount[]> => {
  try {
    const res = await fetchNui<ExternalAccount[]>(ExternalAccountEvents.Get);
    return res ?? [];
  } catch (e) {
    if (isEnvBrowser()) {
      return [
        {
          id: 1,
          name: 'Bossman',
          number: '803, 5800-6000-7000',
        },
      ];
    }
    console.error(e);
    return [];
  }
};

export const {
  rawExternalAccounts,
  setRawExternalAccounts,
  externalAccountsResource,
  mutateExternalAccounts,
  refetchExternalAccounts,
  externalAccounts,
} = createRoot(() => {
  const [rawExternalAccounts, setRawExternalAccounts] = createSignal<ExternalAccount[]>([]);

  const [resource, { mutate, refetch }] = createResource(async () => {
    if (rawExternalAccounts().length === 0) {
      const data = await getExternalAccounts();
      setRawExternalAccounts(data);
      return data;
    }
    return rawExternalAccounts();
  });

  const externalAccountsMemo = createMemo(() => resource() ?? []);

  return {
    rawExternalAccounts,
    setRawExternalAccounts,
    externalAccountsResource: resource,
    mutateExternalAccounts: mutate,
    refetchExternalAccounts: refetch,
    externalAccounts: externalAccountsMemo,
  };
});
