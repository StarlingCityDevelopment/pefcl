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
          'group flex flex-col gap-5 p-6 rounded-[2.5rem] transition-all duration-300 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/10 w-full text-left',
          'bg-white/[0.02] border border-white/5',
          isPending
            ? 'cursor-pointer hover:bg-white/[0.04] hover:border-white/10 active:scale-[0.98]'
            : 'cursor-default opacity-80',
        )}
      >
        <div className='flex justify-between items-start gap-4'>
          <div className='flex flex-col min-w-0 flex-1'>
            <Typography variant='pre' className='text-slate-500 font-black mb-1'>
              {t('Bill from')}
            </Typography>
            <Typography className='text-sm font-black text-white truncate uppercase italic leading-none'>
              {from}
            </Typography>
            <Typography className='text-[11px] text-slate-500 font-medium line-clamp-2 mt-2 leading-tight'>
              {message}
            </Typography>
          </div>
          <div className='flex flex-col items-end shrink-0'>
            <Typography className='text-xl font-black text-white tracking-tighter leading-none'>
              {formatMoney(amount, config.general)}
            </Typography>
            <Typography variant='pre' className='text-[9px] text-slate-600 font-black mt-2'>
              {createdDate.fromNow()}
            </Typography>
          </div>
        </div>

        {(isPending || isPaid) && (
          <div className='flex justify-between items-center pt-5 border-t border-white/[0.03] w-full'>
            {isPending ? (
              <div className='flex flex-col'>
                <Typography variant='label' className='text-slate-600 mb-1'>
                  {t('Expires')}
                </Typography>
                <Typography variant='pre' className='text-slate-400 font-black tracking-tight text-[10px]'>
                  {expiresDate.format(t('DATE_FORMAT'))}
                </Typography>
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <div className='w-1.5 h-1.5 rounded-full bg-slate-500' />
                <Typography variant='pre' className='text-slate-500 font-black tracking-widest text-[9px]'>
                  {t('Archived')}
                </Typography>
              </div>
            )}

            {isPending ? (
              <div className='px-6 h-9 flex items-center justify-center rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-colors'>
                {t('Pay Now')}
              </div>
            ) : (
              <div className='px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center justify-center'>
                <Typography
                  variant='pre'
                  className='text-[10px] font-black text-white uppercase tracking-widest leading-none'
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
