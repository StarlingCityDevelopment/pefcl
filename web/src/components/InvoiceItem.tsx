// web/src/components/InvoiceItem.tsx
import { useConfig } from "@hooks/useConfig";
import { type Invoice, InvoiceStatus } from "@typings/Invoice";
import { cn } from "@utils/cn";
import { formatMoney } from "@utils/currency";
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import relative from 'dayjs/plugin/relativeTime';
import { createSignal, Show } from 'solid-js';
import i18n from "@utils/i18n";
import PayInvoiceModal from './Modals/PayInvoice';
import { Modal } from './ui/Modal';
import { Typography } from './ui/Typography';

dayjs.extend(calendar);
dayjs.extend(relative);

const InvoiceItem = (props: { invoice: Invoice }) => {
  const { message, amount, createdAt, expiresAt, from } = props.invoice;
  const config = useConfig();
  const expiresDate = () => dayjs(expiresAt);
  const createdDate = () => dayjs(createdAt);
  const [isPayOpen, setIsPayOpen] = createSignal(false);

  const isPending = () => props.invoice.status === InvoiceStatus.PENDING;
  const isPaid = () => props.invoice.status === InvoiceStatus.PAID;

  return (
    <>
      <Modal isOpen={isPayOpen()} onClose={() => setIsPayOpen(false)} title={i18n.t('Pay Invoice')}>
        <PayInvoiceModal onClose={() => setIsPayOpen(false)} invoice={props.invoice} />
      </Modal>

      <button
        type='button'
        onClick={() => isPending() && setIsPayOpen(true)}
        onKeyDown={(e) => {
          if (isPending() && (e.key === 'Enter' || e.key === ' ')) {
            setIsPayOpen(true);
          }
        }}
        class={cn(
          'group flex flex-col gap-4 p-5 transition-all duration-150 relative overflow-hidden focus:outline-none focus:ring-1 focus:ring-[var(--gta-green)] w-full text-left',
          'bg-[var(--gta-panel)] border border-[var(--gta-border)]',
          isPending()
            ? 'cursor-pointer hover:border-[var(--gta-green)]/50 hover:bg-[var(--gta-surface)] active:scale-[0.99]'
            : 'cursor-default opacity-70',
        )}
      >
        {/* Left accent bar */}
        <div
          class={cn(
            'absolute left-0 top-0 bottom-0 w-[2px]',
            isPending() ? 'bg-[var(--gta-yellow)]' : 'bg-[var(--gta-green)]',
          )}
        />

        <div class='flex justify-between items-start gap-4'>
          <div class='flex flex-col min-w-0 flex-1'>
            <Typography variant='pre' class='text-[var(--gta-text-dim)] mb-1'>
              {i18n.t('Bill from')}
            </Typography>
            <Typography class='text-sm font-bold text-[var(--gta-text)] truncate uppercase leading-none'>
              {from}
            </Typography>
            <Typography class='text-[11px] text-[var(--gta-text-dim)] font-medium line-clamp-2 mt-2 leading-tight'>
              {message}
            </Typography>
          </div>
          <div class='flex flex-col items-end shrink-0'>
            <Typography class={cn('text-lg font-bold leading-none', isPending() ? 'text-[var(--gta-yellow)]' : 'text-[var(--gta-text-muted)]')}>
              {formatMoney(amount, config()?.general)}
            </Typography>
            <Typography variant='pre' class='text-[9px] text-[var(--gta-text-dim)] mt-2'>
              {createdDate().fromNow()}
            </Typography>
          </div>
        </div>

        <Show when={isPending() || isPaid()}>
          <div class='flex justify-between items-center pt-4 border-t border-[var(--gta-border)] w-full'>
            <Show when={isPending()} fallback={
              <div class='flex items-center gap-2'>
                <div class='w-1.5 h-1.5 bg-[var(--gta-green)]' />
                <Typography variant='pre' class='text-[var(--gta-green)] text-[9px]'>
                  {i18n.t('Archived')}
                </Typography>
              </div>
            }>
              <div class='flex flex-col'>
                <Typography variant='label' class='text-[var(--gta-text-dim)] mb-0.5'>
                  {i18n.t('Expires')}
                </Typography>
                <Typography variant='pre' class='text-[var(--gta-text-muted)] text-[10px]'>
                  {expiresDate().format(i18n.t('DATE_FORMAT'))}
                </Typography>
              </div>
            </Show>

            <Show when={isPending()} fallback={
              <div class='px-3 py-1.5 bg-[var(--gta-surface)] border border-[var(--gta-border)] flex items-center justify-center'>
                <Typography
                  variant='pre'
                  class='text-[10px] font-bold text-[var(--gta-green)] uppercase tracking-[0.15em] leading-none'
                >
                  {i18n.t('Paid')}
                </Typography>
              </div>
            }>
              <div class='px-4 h-8 flex items-center justify-center bg-[var(--gta-green)] text-black text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[var(--gta-green)]/90 transition-colors'>
                {i18n.t('Pay Now')}
              </div>
            </Show>
          </div>
        </Show>
      </button>
    </>
  );
};

export default InvoiceItem;
