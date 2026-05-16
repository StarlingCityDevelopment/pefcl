// web/src/components/Modals/PayInvoice.tsx
import { useGlobalSettings } from "@hooks/useGlobalSettings";
import { InvoiceEvents } from "@typings/Events";
import type { Invoice, PayInvoiceInput } from "@typings/Invoice";
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AlertCircle, CheckCircle2, Calendar, MessageSquare, User, Wallet } from 'lucide-solid';
import { createSignal, Show, createMemo } from 'solid-js';
import i18n from "@utils/i18n";
import { accounts, refetchAccounts, defaultAccount } from "@data/accounts";
import { refetchInvoices } from "@data/invoices";
import { refetchTransactions } from "@data/transactions";
import { useConfig } from "@hooks/useConfig";
import { formatMoney } from "@utils/currency";
import { fetchNui } from "@utils/fetchNui";
import AccountSelect from '../AccountSelect';
import Summary from '../Summary';
import Button from '../ui/Button';
import { Typography } from '../ui/Typography';

dayjs.extend(calendar);
dayjs.extend(relativeTime);

interface PayInvoiceModalProps {
  invoice: Invoice;
  onClose(): void;
}

const PayInvoiceModal = (props: PayInvoiceModalProps) => {
  const [selectedAccountId, setSelectedAccountId] = createSignal(defaultAccount()?.id ?? 0);
  const [isPaid, setIsPaid] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  const config = useConfig();

  const expiresDate = () => dayjs(props.invoice.expiresAt);
  const selectedAccount = createMemo(() => accounts().find((account) => account.id === selectedAccountId()));

  const handlePayInvoice = () => {
    setError('');
    setIsLoading(true);
    const payload: PayInvoiceInput = {
      fromAccountId: selectedAccountId(),
      invoiceId: props.invoice.id,
    };

    fetchNui(InvoiceEvents.PayInvoice, payload)
      .then(async () => {
        setIsPaid(true);
        await refetchInvoices();
        await refetchAccounts();
        await refetchTransactions();
        setTimeout(props.onClose, 2000);
      })
      .catch((err) => {
        setError(err.message || i18n.t('Failed to pay invoice'));
      })
      .finally(() => setIsLoading(false));
  };

  const hasEnoughFunds = () => (selectedAccount()?.balance ?? 0) >= props.invoice.amount;

  return (
    <div class='flex flex-col w-full h-full'>
      <Show when={isPaid()} fallback={
        <>
          {/* Header Section */}
          <div class='flex items-center gap-2 mb-6 w-full'>
            <Typography variant='pre' class='text-primary/60 font-medium text-xs uppercase tracking-wider'>
              {i18n.t('Invoice Statement')}
            </Typography>
            <div class='h-px flex-1 bg-white/5' />
            <Typography variant='pre' class='text-white/40 font-medium text-[10px] tracking-widest uppercase'>
              #{props.invoice.id.toString().padStart(6, '0')}
            </Typography>
          </div>

          <div class='flex flex-col mb-8'>
            <Typography variant='h1' class='text-5xl font-light tracking-tight text-white mb-2'>
              {formatMoney(props.invoice.amount, config()?.general)}
            </Typography>
          </div>

          {/* Main Content: Single Column Stack */}
          <div class='flex flex-col gap-6 flex-1'>
            {/* Details Card */}
            <div class='p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-5'>
              <div class='flex items-start gap-3'>
                <div class='p-2 rounded-xl bg-white/5 border border-white/5 shrink-0'>
                  <User size={16} class='text-slate-400' />
                </div>
                <div class='flex flex-col flex-1 min-w-0'>
                  <Typography
                    variant='label'
                    class='mb-0.5 text-[10px] opacity-40 uppercase tracking-widest font-medium'
                  >
                    {i18n.t('From')}
                  </Typography>
                  <Typography class='text-white font-medium text-sm tracking-tight leading-tight break-words'>
                    {props.invoice.from}
                  </Typography>
                </div>
              </div>

              <div class='flex items-start gap-3'>
                <div class='p-2 rounded-xl bg-white/5 border border-white/5 shrink-0'>
                  <MessageSquare size={16} class='text-slate-400' />
                </div>
                <div class='flex flex-col flex-1 min-w-0'>
                  <Typography
                    variant='label'
                    class='mb-0.5 text-[10px] opacity-40 uppercase tracking-widest font-medium'
                  >
                    {i18n.t('Message')}
                  </Typography>
                  <Typography class='text-white/80 text-sm leading-relaxed break-words whitespace-pre-wrap'>
                    {props.invoice.message}
                  </Typography>
                </div>
              </div>

              <div class='h-px bg-white/5 w-full' />

              <div class='flex items-center justify-between'>
                <div class='flex items-center gap-2 text-slate-500 shrink-0'>
                  <Calendar size={16} />
                  <Typography variant='pre' class='text-[10px] font-medium uppercase tracking-widest opacity-60'>
                    {i18n.t('Expires')}
                  </Typography>
                </div>
                <Typography class='text-white/90 text-sm font-medium leading-none truncate ml-2'>
                  {expiresDate().format(i18n.t('DATE_FORMAT'))}
                  <span class='ml-2 opacity-50 font-normal'>/ {expiresDate().fromNow()}</span>
                </Typography>
              </div>
            </div>

            {/* Payment Configuration */}
            <div class='flex flex-col gap-4'>
              <div class='flex items-center gap-2'>
                <div class='p-1.5 rounded-md bg-primary/10 border border-primary/20'>
                  <Wallet size={16} class='text-primary' />
                </div>
                <Typography variant='pre' class='font-medium uppercase tracking-widest text-xs text-white/60'>
                  {i18n.t('Payment Source')}
                </Typography>
              </div>

              <AccountSelect
                isFromAccount
                accounts={accounts()}
                onSelect={(id) => setSelectedAccountId(id)}
                selectedId={selectedAccountId()}
              />
            </div>

            {/* Financial Summary */}
            <div class='mt-2'>
              <Summary balance={selectedAccount()?.balance ?? 0} payment={props.invoice.amount} />
            </div>

            {/* Interaction Region */}
            <div class='flex flex-col gap-3 mt-auto pt-8'>
              <Show when={error()}>
                <div class='flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500'>
                  <AlertCircle size={16} class='shrink-0' />
                  <Typography variant='pre' class='text-red-500 leading-tight text-[11px]'>
                    {error()}
                  </Typography>
                </div>
              </Show>

              <Button
                class='w-full h-14 text-base font-medium transition-all'
                onClick={handlePayInvoice}
                disabled={!selectedAccountId() || !hasEnoughFunds() || isLoading()}
              >
                {isLoading() ? i18n.t('Processing...') : i18n.t('Authorize Payment')}
              </Button>

              <Button
                variant='ghost'
                class='w-full h-12 text-xs font-medium text-white/40 hover:text-white transition-all'
                onClick={props.onClose}
                disabled={isLoading()}
              >
                {i18n.t('Cancel')}
              </Button>
            </div>
          </div>
        </>
      }>
        <div class='flex flex-col items-center justify-center py-12 px-6 min-h-[300px]'>
          <div class='w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 transition-transform animate-in zoom-in duration-500'>
            <CheckCircle2 size={32} />
          </div>
          <Typography variant='h2' class='italic uppercase mb-1'>
            {i18n.t('Settled')}
          </Typography>
          <Typography class='text-slate-400 text-sm'>{i18n.t('Invoice has been successfully paid.')}</Typography>
        </div>
      </Show>
    </div>
  );
};

export default PayInvoiceModal;
