import { useConfig } from '@hooks/useConfig';
import { type Invoice, InvoiceStatus } from '@typings/Invoice';
import { cn } from '@utils/cn';
import { formatMoney } from '@utils/currency';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import relative from 'dayjs/plugin/relativeTime';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PayInvoiceModal from './Modals/PayInvoice';
import Button from './ui/Button';
import { Modal } from './ui/Modal';
import { Typography } from './ui/Typography';

dayjs.extend(calendar);
dayjs.extend(relative);

const InvoiceItem: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  const { t } = useTranslation();
  const { message, amount, id, createdAt, expiresAt, from } = invoice;
  const config = useConfig();
  const expiresDate = dayjs(expiresAt);
  const createdDate = dayjs(createdAt);
  const [isPayOpen, setIsPayOpen] = React.useState(false);

  const isPending = invoice.status === InvoiceStatus.PENDING;
  const isPaid = invoice.status === InvoiceStatus.PAID;

  return (
    <>
      <Modal isOpen={isPayOpen} onClose={() => setIsPayOpen(false)} title={t('Pay Invoice')}>
        <PayInvoiceModal onClose={() => setIsPayOpen(false)} invoice={invoice} />
      </Modal>

      <button
        type='button'
        onClick={() => isPending && setIsPayOpen(true)}
        onKeyDown={(e) => {
          if (isPending && (e.key === 'Enter' || e.key === ' ')) {
            setIsPayOpen(true);
          }
        }}
        className={cn(
          'group flex flex-col gap-4 p-5 transition-all duration-150 relative overflow-hidden focus:outline-none focus:ring-1 focus:ring-[var(--gta-green)] w-full text-left',
          'bg-[var(--gta-panel)] border border-[var(--gta-border)]',
          isPending
            ? 'cursor-pointer hover:border-[var(--gta-green)]/50 hover:bg-[var(--gta-surface)] active:scale-[0.99]'
            : 'cursor-default opacity-70',
        )}
      >
        {/* Left accent bar */}
        <div
          className={cn(
            'absolute left-0 top-0 bottom-0 w-[2px]',
            isPending ? 'bg-[var(--gta-yellow)]' : 'bg-[var(--gta-green)]',
          )}
        />

        <div className='flex justify-between items-start gap-4'>
          <div className='flex flex-col min-w-0 flex-1'>
            <Typography variant='pre' className='text-[var(--gta-text-dim)] mb-1'>
              {t('Bill from')}
            </Typography>
            <Typography className='text-sm font-bold text-[var(--gta-text)] truncate uppercase leading-none'>
              {from}
            </Typography>
            <Typography className='text-[11px] text-[var(--gta-text-dim)] font-medium line-clamp-2 mt-2 leading-tight'>
              {message}
            </Typography>
          </div>
          <div className='flex flex-col items-end shrink-0'>
            <Typography className={cn('text-lg font-bold leading-none', isPending ? 'text-[var(--gta-yellow)]' : 'text-[var(--gta-text-muted)]')}>
              {formatMoney(amount, config.general)}
            </Typography>
            <Typography variant='pre' className='text-[9px] text-[var(--gta-text-dim)] mt-2'>
              {createdDate.fromNow()}
            </Typography>
          </div>
        </div>

        {(isPending || isPaid) && (
          <div className='flex justify-between items-center pt-4 border-t border-[var(--gta-border)] w-full'>
            {isPending ? (
              <div className='flex flex-col'>
                <Typography variant='label' className='text-[var(--gta-text-dim)] mb-0.5'>
                  {t('Expires')}
                </Typography>
                <Typography variant='pre' className='text-[var(--gta-text-muted)] text-[10px]'>
                  {expiresDate.format(t('DATE_FORMAT'))}
                </Typography>
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <div className='w-1.5 h-1.5 bg-[var(--gta-green)]' />
                <Typography variant='pre' className='text-[var(--gta-green)] text-[9px]'>
                  {t('Archived')}
                </Typography>
              </div>
            )}

            {isPending ? (
              <div className='px-4 h-8 flex items-center justify-center bg-[var(--gta-green)] text-black text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[var(--gta-green)]/90 transition-colors'>
                {t('Pay Now')}
              </div>
            ) : (
              <div className='px-3 py-1.5 bg-[var(--gta-surface)] border border-[var(--gta-border)] flex items-center justify-center'>
                <Typography
                  variant='pre'
                  className='text-[10px] font-bold text-[var(--gta-green)] uppercase tracking-[0.15em] leading-none'
                >
                  {t('Paid')}
                </Typography>
              </div>
            )}
          </div>
        )}
      </button>
    </>
  );
};

export default InvoiceItem;
