// web/src/data/cards.ts
import type { Card, GetCardInput } from "@typings/BankCard";
import { CardEvents } from "@typings/Events";
import { fetchNui } from "@utils/fetchNui";
import { isEnvBrowser } from "@utils/misc";
import { createSignal, createResource, createMemo, createRoot } from 'solid-js';

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

export const {
  selectedAccountId,
  setSelectedAccountId,
  rawCards,
  setRawCards,
  loadedAccounts,
  setLoadedAccounts,
  cardsResource,
  mutateCards,
  refetchCards,
  cards,
  updateCards,
} = createRoot(() => {
  const [selectedAccountId, setSelectedAccountId] = createSignal<number>(0);
  const [rawCards, setRawCards] = createSignal<Record<number, Card[]>>({});
  const [loadedAccounts, setLoadedAccounts] = createSignal<Record<number, boolean>>({});

  const [resource, { mutate, refetch }] = createResource(selectedAccountId, async (accountId) => {
    if (!accountId) return [];
    const data = await getCards(accountId);
    setRawCards((prev) => ({ ...prev, [accountId]: data }));
    setLoadedAccounts((prev) => ({ ...prev, [accountId]: true }));
    return data;
  });

  const cardsMemo = createMemo(() => resource() ?? []);

  const updateCardsAction = async (accountId?: number) => {
    const id = accountId ?? selectedAccountId();
    if (!id) return;
    const data = await getCards(id);
    setRawCards((prev) => ({ ...prev, [id]: data }));
    setLoadedAccounts((prev) => ({ ...prev, [id]: true }));
    mutate(data);
  };

  return {
    selectedAccountId,
    setSelectedAccountId,
    rawCards,
    setRawCards,
    loadedAccounts,
    setLoadedAccounts,
    cardsResource: resource,
    mutateCards: mutate,
    refetchCards: refetch,
    cards: cardsMemo,
    updateCards: updateCardsAction,
  };
});
