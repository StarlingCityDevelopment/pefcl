import { InvoiceEvents } from '@typings/Events';
import { mockedInvoices } from '@utils/constants';
import { atom } from 'jotai';
import { type GetInvoicesInput, type GetInvoicesResponse, InvoiceStatus } from '../../../typings/Invoice';
import { fetchNui } from '../utils/fetchNui';
import { isEnvBrowser } from '../utils/misc';

const initialState: GetInvoicesResponse = {
  total: 0,
  offset: 0,
  limit: 10,
  totalUnpaid: 0,
  invoices: [],
};

const getInvoices = async (input: GetInvoicesInput): Promise<GetInvoicesResponse> => {
  try {
    const res = await fetchNui<GetInvoicesResponse>(InvoiceEvents.Get, input);
    return res ?? initialState;
  } catch (e) {
    if (isEnvBrowser()) {
      return {
        ...initialState,
        invoices: mockedInvoices,
      };
    }
    console.error(e);
    return initialState;
  }
};

const isLoadedAtom = atom(false);
const invoicesAtomRaw = atom<GetInvoicesResponse>(initialState);
export const invoicesAtom = atom<Promise<GetInvoicesResponse>, GetInvoicesInput | undefined, Promise<void>>(
  async (get) => {
    const isLoaded = get(isLoadedAtom);
    const raw = get(invoicesAtomRaw);

    if (!isLoaded && raw.invoices.length === 0) {
      return await getInvoices({ ...initialState });
    }

    return raw;
  },
  async (get, set, by?) => {
    const currentSettings = get(invoicesAtomRaw);
    const input = by ?? { limit: currentSettings.limit, offset: currentSettings.offset };
    const data = await getInvoices(input);
    set(invoicesAtomRaw, data);
    set(isLoadedAtom, true);
  },
);

export const unpaidInvoicesAtom = atom((get) => {
  return get(invoicesAtom).invoices.filter((invoice) => invoice.status === InvoiceStatus.PENDING);
});

export const totalInvoicesAtom = atom((get) => get(invoicesAtom).total);
export const totalUnpaidInvoicesAtom = atom((get) => get(invoicesAtom).totalUnpaid);
