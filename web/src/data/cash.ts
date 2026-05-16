// web/src/data/cash.ts
import { CashEvents } from "@typings/Events";
import { fetchNui } from "@utils/fetchNui";
import { createSignal, createResource, createMemo, createRoot } from 'solid-js';

const getCash = async (): Promise<number> => {
  try {
    const res = await fetchNui<number>(CashEvents.GetMyCash);
    return res ?? 0;
  } catch (e) {
    return 0;
  }
};

export const {
  rawCash,
  setRawCash,
  cashResource,
  mutateCash,
  refetchCash,
  cash,
  updateCash,
} = createRoot(() => {
  const [rawCash, setRawCash] = createSignal<number>(0);
  const [isLoaded, setIsLoaded] = createSignal(false);

  const [resource, { mutate, refetch }] = createResource(async () => {
    if (!isLoaded()) {
      const data = await getCash();
      setRawCash(data);
      setIsLoaded(true);
      return data;
    }
    return rawCash();
  });

  const cashMemo = createMemo(() => resource() ?? 0);

  const updateCashAction = async (by?: number) => {
    const amount = by ?? (await getCash());
    setRawCash(amount);
    setIsLoaded(true);
    mutate(amount);
  };

  return {
    rawCash,
    setRawCash,
    cashResource: resource,
    mutateCash: mutate,
    refetchCash: refetch,
    cash: cashMemo,
    updateCash: updateCashAction,
  };
});

