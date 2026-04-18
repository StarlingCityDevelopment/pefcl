import type { Card, GetCardInput } from '@typings/BankCard';
import { CardEvents } from '@typings/Events';
import { mockedAccounts } from '@utils/constants';
import { fetchNui } from '@utils/fetchNui';
import { isEnvBrowser } from '@utils/misc';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const mockedCards: Card[] = [];

const getCards = async (accountId: number): Promise<Card[]> => {
  try {
    const res = await fetchNui<Card[], GetCardInput>(CardEvents.Get, { accountId });
    return res ?? [];
  } catch (e) {
    if (isEnvBrowser()) {
      return mockedCards;
    }

    console.error(e);
    return [];
  }
};

export const selectedAccountIdAtom = atom<number>(0);
const isLoadedAtom = atom<Record<number, boolean>>({});
export const rawCardAtom = atom<Record<number, Card[]>>({});

export const cardsAtom = atom<Promise<Card[]>, Card | number | undefined, Promise<void>>(
  async (get) => {
    const accountId = get(selectedAccountIdAtom);
    const state = get(rawCardAtom);
    const isLoaded = get(isLoadedAtom)[accountId];

    if (!isLoaded && (!state[accountId] || state[accountId].length === 0)) {
      return await getCards(accountId);
    }

    return state[accountId] ?? [];
  },
  async (get, set, by) => {
    const accountId = get(selectedAccountIdAtom);
    const state = get(rawCardAtom);

    if (typeof by === 'number') {
      const cards = await getCards(by);
      set(rawCardAtom, { ...state, [by]: cards });
      set(isLoadedAtom, { ...get(isLoadedAtom), [by]: true });
      return;
    }

    if (!by) {
      const cards = await getCards(accountId);
      set(rawCardAtom, { ...state, [accountId]: cards });
      set(isLoadedAtom, { ...get(isLoadedAtom), [accountId]: true });
      return;
    }

    const currentCards = state[accountId] ?? [];
    set(rawCardAtom, { ...state, [accountId]: [...currentCards, by] });
  },
);
