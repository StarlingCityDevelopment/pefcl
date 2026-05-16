// web/src/data/invoices.ts
import { InvoiceEvents } from "@typings/Events";
import { mockedInvoices } from "@utils/constants";
import { createSignal, createMemo, createResource, createRoot } from 'solid-js';
import { type GetInvoicesInput, type GetInvoicesResponse, InvoiceStatus } from '../../../typings/Invoice';
import { fetchNui } from "@utils/fetchNui";
import { isEnvBrowser } from "@utils/misc";

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

export const {
  query,
  setQuery,
  rawInvoices,
  setRawInvoices,
  invoicesResource,
  mutateInvoices,
  refetchInvoices,
  invoicesBase,
  unpaidInvoices,
  totalInvoices,
  totalUnpaidInvoices,
} = createRoot(() => {
  const [query, setQuery] = createSignal<GetInvoicesInput>({
    limit: initialState.limit,
    offset: initialState.offset,
  });
  const [rawInvoices, setRawInvoices] = createSignal<GetInvoicesResponse>(initialState);
  const [isLoaded, setIsLoaded] = createSignal(false);

  const [resource, { mutate, refetch }] = createResource(query, async (input) => {
    const data = await getInvoices(input);
    setRawInvoices(data);
    setIsLoaded(true);
    return data;
  });

  const base = createMemo(() => resource() ?? initialState);

  const unpaid = createMemo(() => {
    return base().invoices.filter((invoice) => invoice.status === InvoiceStatus.PENDING);
  });

  const total = createMemo(() => base().total);
  const totalUnpaid = createMemo(() => base().totalUnpaid);

  return {
    query,
    setQuery,
    rawInvoices,
    setRawInvoices,
    invoicesResource: resource,
    mutateInvoices: mutate,
    refetchInvoices: refetch,
    invoicesBase: base,
    unpaidInvoices: unpaid,
    totalInvoices: total,
    totalUnpaidInvoices: totalUnpaid,
  };
});

export const setInvoicesQuery = setQuery;
