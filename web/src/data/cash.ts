import { CashEvents } from '@typings/Events';
import { fetchNui } from '@utils/fetchNui';
import { atom } from 'jotai';

const getCash = async (): Promise<number> => {
  try {
    const res = await fetchNui<number>(CashEvents.GetMyCash);
    return res ?? 0;
  } catch (e) {
    return 0;
  }
};

const isLoadedAtom = atom(false);
export const rawCashAtom = atom<number>(0);

export const cashAtom = atom<Promise<number>, number | undefined, Promise<void>>(
  async (get) => {
    const isLoaded = get(isLoadedAtom);
    const raw = get(rawCashAtom);

    if (!isLoaded) {
      // First load — fetch from server
      return await getCash();
    }

    // After first load, trust the local state (updated via broadcasts or mutations)
    return raw;
  },
  async (get, set, by) => {
    const cash = by ?? (await getCash());
    set(rawCashAtom, cash);
    set(isLoadedAtom, true);
  },
);
